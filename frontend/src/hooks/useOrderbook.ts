import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useWebSocketStore } from "../stores/websocket";
import { useOrderbookStore } from "../stores/orderbook";
import type { OrderbookSnapshot } from "../types/Market";

export function useOrderbook(symbol: string | undefined) {
  const { isConnected, send, subscribe } = useWebSocketStore();
  const { setSnapshot, applyDelta, setLastPrice } = useOrderbookStore();

  const query = useQuery({
    queryKey: ["orderbook", symbol],
    queryFn: async () => {
      const { data } = await api.get<OrderbookSnapshot>(
        `/orderbook/${symbol}`
      );
      return data;
    },
    enabled: !!symbol && isConnected,
  });

  useEffect(() => {
    if (query.data) setSnapshot(query.data);
  }, [query.data, setSnapshot]);

  useEffect(() => {
    if (!isConnected || !symbol) return;

    send({ type: "orderbook.subscribe", payload: { symbol } });
    send({ type: "trade.subscribe", payload: { symbol } });

    const unsubs = [
      subscribe("orderbook.delta.batch", (msg: any) => {
        if (!Array.isArray(msg.deltas)) return;
        for (const d of msg.deltas) applyDelta(d.action, d.order);
      }),
      subscribe("orderbook.delta", (msg: any) => {
        applyDelta(msg.action, msg.order);
      }),
      subscribe("trade.executed.batch", (msg: any) => {
        const trades = msg.trades;
        if (Array.isArray(trades) && trades.length > 0) {
          setLastPrice(trades[trades.length - 1].price);
        }
      }),
      subscribe("trade.executed", (msg: any) => {
        if (msg.price) setLastPrice(msg.price);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [isConnected, symbol, send, subscribe, applyDelta, setLastPrice]);

  return query;
}
