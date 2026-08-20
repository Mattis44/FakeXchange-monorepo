import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { Candle } from "../types/Market";

const UP = "#0ecb81";
const DOWN = "#f6465d";

export function Chart({
  candles,
  symbol,
}: {
  candles: Candle[];
  symbol: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { color: "#1a1d23" },
        textColor: "#848e9c",
      },
      grid: {
        vertLines: { color: "#2b3139" },
        horzLines: { color: "#2b3139" },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#2b3139" },
      timeScale: { borderColor: "#2b3139", timeVisible: true },
    });

    candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
      title: symbol,
    });

    volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    candleSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.2, bottom: 0.4 },
    });
    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    const ro = new ResizeObserver(() => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);
    chartRef.current.timeScale().fitContent();

    return () => {
      ro.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [symbol]);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !candles.length)
      return;

    const mapped = candles.map((c) => ({
      time: Math.floor(Number(c.timestamp) / 1000) as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumes = candles.map((c) => ({
      time: Math.floor(Number(c.timestamp) / 1000) as Time,
      value: c.volume,
      color: c.close >= c.open ? `${UP}33` : `${DOWN}33`,
    }));

    candleSeriesRef.current.setData(mapped);
    volumeSeriesRef.current.setData(volumes);
  }, [candles]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
  );
}
