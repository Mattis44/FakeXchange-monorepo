import { useOrderbookStore } from "../stores/orderbook";
import { useWebSocketStore } from "../stores/websocket";

export function AssetHeader() {
  const { base, quote, lastPrice, prevPrice } = useOrderbookStore();
  const isConnected = useWebSocketStore((s) => s.isConnected);

  const priceColor =
    prevPrice === null
      ? "text-text-primary"
      : lastPrice >= prevPrice
        ? "text-green"
        : "text-red";

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-bg-secondary border-b border-border">
      <span className="text-lg font-semibold">
        {base}
        <span className="text-text-secondary">/{quote}</span>
      </span>

      {lastPrice > 0 && (
        <span className={`text-lg font-mono font-semibold ${priceColor}`}>
          {lastPrice.toFixed(2)}
        </span>
      )}

      <div className="ml-auto flex items-center gap-2 text-xs text-text-secondary">
        <span
          className={`w-2 h-2 rounded-full ${isConnected ? "bg-green" : "bg-red"}`}
        />
        {isConnected ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
}
