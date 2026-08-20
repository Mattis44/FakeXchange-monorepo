import { useMemo } from "react";
import { useOrderbookStore, aggregateOrders } from "../stores/orderbook";
import { useOrderFormStore } from "../stores/orderform";
import type { AggregatedOrder } from "../types/Market";

const DEPTH = 10;

function Row({
  order,
  side,
  maxTotal,
  onClick,
}: {
  order: AggregatedOrder;
  side: "buy" | "sell";
  maxTotal: number;
  onClick: () => void;
}) {
  const isBuy = side === "buy";
  const fillPct = maxTotal > 0 ? (order.total / maxTotal) * 100 : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid grid-cols-3 w-full text-xs font-mono py-0.5 px-2 hover:bg-bg-hover relative cursor-pointer text-right"
    >
      <div
        className={`absolute inset-0 ${isBuy ? "bg-green-dim" : "bg-red-dim"}`}
        style={{ width: `${fillPct}%`, [isBuy ? "right" : "right"]: 0 }}
      />
      <span className={`relative z-10 ${isBuy ? "text-green" : "text-red"}`}>
        {order.price.toFixed(2)}
      </span>
      <span className="relative z-10 text-text-primary">
        {order.size.toFixed(4)}
      </span>
      <span className="relative z-10 text-text-secondary">
        {order.total.toFixed(4)}
      </span>
    </button>
  );
}

export function Orderbook() {
  const { asks, bids, lastPrice, prevPrice } = useOrderbookStore();
  const setPrice = useOrderFormStore((s) => s.setPrice);

  const aggAsks = useMemo(() => {
    const agg = aggregateOrders(asks);
    agg.sort((a, b) => a.price - b.price);
    // recalculate totals ascending
    let total = 0;
    for (const o of agg) {
      total += o.size;
      o.total = total;
    }
    return agg.slice(-DEPTH).reverse();
  }, [asks]);

  const aggBids = useMemo(() => {
    const agg = aggregateOrders(bids);
    agg.sort((a, b) => b.price - a.price);
    let total = 0;
    for (const o of agg) {
      total += o.size;
      o.total = total;
    }
    return agg.slice(0, DEPTH);
  }, [bids]);

  const maxAskTotal = aggAsks.length > 0 ? Math.max(...aggAsks.map((o) => o.total)) : 0;
  const maxBidTotal = aggBids.length > 0 ? Math.max(...aggBids.map((o) => o.total)) : 0;

  const priceColor =
    prevPrice === null
      ? "text-text-primary"
      : lastPrice >= prevPrice
        ? "text-green"
        : "text-red";

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      <div className="grid grid-cols-3 text-[10px] text-text-secondary uppercase tracking-wider px-2 py-1.5 border-b border-border text-right">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="flex-1 flex flex-col justify-end overflow-hidden">
        {aggAsks.map((o) => (
          <Row
            key={o.price}
            order={o}
            side="sell"
            maxTotal={maxAskTotal}
            onClick={() => setPrice(o.price)}
          />
        ))}
      </div>

      {lastPrice > 0 && (
        <div
          className={`text-center text-sm font-mono font-bold py-1.5 border-y border-border ${priceColor}`}
        >
          {lastPrice.toFixed(2)}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {aggBids.map((o) => (
          <Row
            key={o.price}
            order={o}
            side="buy"
            maxTotal={maxBidTotal}
            onClick={() => setPrice(o.price)}
          />
        ))}
      </div>
    </div>
  );
}
