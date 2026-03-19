import { useState } from "react";
import { useOrderFormStore } from "../stores/orderform";
import type { OrderSide, OrderType } from "../types/Market";

const tabs: OrderType[] = ["limit", "market"];

export function OrderForm() {
  const { orderType, orderSide, price, amount, setOrderType, setOrderSide, setPrice, setAmount } =
    useOrderFormStore();
  const [submitting, setSubmitting] = useState(false);

  const isBuy = orderSide === "buy";

  const handleSubmit = () => {
    if (!price || !amount) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 300);
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary p-3 gap-3">
      <div className="flex rounded-md overflow-hidden border border-border">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOrderType(t)}
            className={`flex-1 py-1.5 text-xs font-medium capitalize transition-colors ${
              orderType === t
                ? "bg-bg-hover text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex rounded-md overflow-hidden">
        {(["buy", "sell"] as OrderSide[]).map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => setOrderSide(side)}
            className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
              orderSide === side
                ? side === "buy"
                  ? "bg-green text-black"
                  : "bg-red text-white"
                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
            }`}
          >
            {side}
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-text-secondary uppercase tracking-wider">
            Price
          </label>
          <input
            type="number"
            value={price ?? ""}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0.00"
            className="bg-bg-tertiary border border-border rounded px-3 py-2 text-sm font-mono text-text-primary outline-none focus:border-accent"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-text-secondary uppercase tracking-wider">
          Amount
        </label>
        <input
          type="number"
          value={amount ?? ""}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="0.0000"
          className="bg-bg-tertiary border border-border rounded px-3 py-2 text-sm font-mono text-text-primary outline-none focus:border-accent"
        />
      </div>

      {price && amount ? (
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Total</span>
          <span className="font-mono">{(price * amount).toFixed(2)}</span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!price || !amount || submitting}
        className={`mt-auto py-2.5 rounded font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          isBuy
            ? "bg-green hover:bg-green/90 text-black"
            : "bg-red hover:bg-red/90 text-white"
        }`}
      >
        {isBuy ? "Buy" : "Sell"}
      </button>
    </div>
  );
}
