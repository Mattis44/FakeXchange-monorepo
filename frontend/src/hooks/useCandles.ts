import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useWebSocketStore } from "../stores/websocket";
import type { Candle } from "../types/Market";

export function useCandles(symbol: string, resolution = "1m") {
  const { isConnected, send, subscribe } = useWebSocketStore();
  const [liveCandles, setLiveCandles] = useState<Candle[]>([]);
  const initializedRef = useRef(false);

  const query = useQuery({
    queryKey: ["candles", symbol, resolution],
    queryFn: async () => {
      const now = Date.now();
      const intervalMs = 60_000;
      const { data } = await api.post<Candle[]>("/candles", {
        symbol,
        resolution,
        startTime: now - intervalMs * 100,
        endTime: now,
      });
      return data;
    },
    enabled: !!symbol && isConnected,
  });

  useEffect(() => {
    if (query.data && !initializedRef.current) {
      setLiveCandles(query.data);
      initializedRef.current = true;
    }
  }, [query.data]);

  useEffect(() => {
    if (!isConnected || !symbol) return;

    send({ type: "candle.subscribe", payload: { symbol, resolution } });

    const upsertCandle = (c: Candle) => {
      setLiveCandles((prev) => {
        const idx = prev.findIndex((x) => x.timestamp === c.timestamp);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = c;
          return next;
        }
        return [...prev, c].sort((a, b) => a.timestamp - b.timestamp);
      });
    };

    const unsubs = [
      subscribe("candle.add", (msg: any) => upsertCandle(msg.data)),
      subscribe("candle.update", (msg: any) => {
        if (msg.data) upsertCandle(msg.data);
      }),
      subscribe("candle.update.batch", (msg: any) => {
        if (Array.isArray(msg.candles)) msg.candles.forEach(upsertCandle);
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, [isConnected, symbol, resolution, send, subscribe]);

  return { candles: liveCandles, isLoading: query.isLoading };
}
