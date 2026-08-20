export type Order = {
  id: string;
  price: number;
  remaining: number;
  side: "buy" | "sell";
};

export type AggregatedOrder = {
  price: number;
  size: number;
  total: number;
};

export type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type OrderbookSnapshot = {
  asks: Order[];
  bids: Order[];
  base: string;
  quote: string;
  lastPrice: number;
};

export type OrderSide = "buy" | "sell";
export type OrderType = "limit" | "market";
