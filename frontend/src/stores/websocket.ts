import { create } from "zustand";
import { WS_URL } from "../lib/constants";

type Callback = (data: unknown) => void;

type WebSocketState = {
  socket: WebSocket | null;
  isConnected: boolean;
  subscribers: Map<string, Set<Callback>>;
  connect: () => void;
  disconnect: () => void;
  send: (data: unknown) => void;
  subscribe: (type: string, cb: Callback) => () => void;
};

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  subscribers: new Map(),

  connect: () => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => set({ isConnected: true });

    ws.onclose = () => {
      set({ isConnected: false, socket: null });
      setTimeout(() => get().connect(), 2000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const cbs = get().subscribers.get(msg.type);
        cbs?.forEach((cb) => cb(msg));
      } catch {
        // ignore malformed messages
      }
    };

    set({ socket: ws });
  },

  disconnect: () => {
    get().socket?.close();
    set({ socket: null, isConnected: false });
  },

  send: (data) => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  },

  subscribe: (type, cb) => {
    const { subscribers } = get();
    if (!subscribers.has(type)) subscribers.set(type, new Set());
    subscribers.get(type)!.add(cb);
    return () => {
      subscribers.get(type)?.delete(cb);
    };
  },
}));
