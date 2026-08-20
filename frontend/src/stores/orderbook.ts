import { create } from "zustand";
import type { Order, AggregatedOrder } from "../types/Market";

type OrderbookState = {
  asks: Order[];
  bids: Order[];
  base: string;
  quote: string;
  lastPrice: number;
  prevPrice: number | null;
  setSnapshot: (data: {
    asks: Order[];
    bids: Order[];
    base: string;
    quote: string;
    lastPrice: number;
  }) => void;
  applyDelta: (action: string, order: Order) => void;
  setLastPrice: (price: number) => void;
};

export const useOrderbookStore = create<OrderbookState>((set) => ({
  asks: [],
  bids: [],
  base: "",
  quote: "",
  lastPrice: 0,
  prevPrice: null,

  setSnapshot: (data) =>
    set({
      asks: data.asks,
      bids: data.bids,
      base: data.base,
      quote: data.quote,
      lastPrice: data.lastPrice,
      prevPrice: null,
    }),

  applyDelta: (action, order) =>
    set((state) => {
      const side = order.side === "sell" ? "asks" : "bids";
      const list = [...state[side]];

      if (action === "add") {
        list.push(order);
      } else if (action === "update") {
        const idx = list.findIndex((o) => o.id === order.id);
        if (idx !== -1) list[idx] = order;
      } else if (action === "remove") {
        const idx = list.findIndex((o) => o.id === order.id);
        if (idx !== -1) list.splice(idx, 1);
      }

      return { [side]: list };
    }),

  setLastPrice: (price) =>
    set((state) => ({ lastPrice: price, prevPrice: state.lastPrice })),
}));

export function aggregateOrders(orders: Order[]): AggregatedOrder[] {
  const map = new Map<number, number>();
  for (const o of orders) {
    const key = parseFloat(o.price.toFixed(2));
    map.set(key, (map.get(key) ?? 0) + o.remaining);
  }

  let total = 0;
  return Array.from(map.entries()).map(([price, size]) => {
    total += size;
    return { price, size, total };
  });
}
