import { useParams } from "react-router-dom";
import { useOrderbook } from "../hooks/useOrderbook";
import { useCandles } from "../hooks/useCandles";
import { AssetHeader } from "../components/AssetHeader";
import { Chart } from "../components/Chart";
import { Orderbook } from "../components/Orderbook";
import { OrderForm } from "../components/OrderForm";
import { AccountSummary } from "../components/AccountSummary";

export function Trade() {
  const { symbol = "TESTUSD" } = useParams();
  useOrderbook(symbol);
  const { candles } = useCandles(symbol);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AssetHeader />

      <div className="flex-1 flex min-h-0 gap-px">
        <div className="flex-3 min-w-0">
          <Chart candles={candles} symbol={symbol} />
        </div>

        <div className="w-64 shrink-0 border-x border-border">
          <Orderbook />
        </div>

        <div className="w-72 shrink-0">
          <OrderForm />
        </div>
      </div>

      <div className="h-48 border-t border-border">
        <AccountSummary />
      </div>
    </div>
  );
}
