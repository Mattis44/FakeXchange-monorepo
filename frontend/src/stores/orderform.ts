import { create } from "zustand";
import type { OrderSide, OrderType } from "../types/Market";

type OrderFormState = {
  orderType: OrderType;
  orderSide: OrderSide;
  price: number | undefined;
  amount: number | undefined;
  setOrderType: (type: OrderType) => void;
  setOrderSide: (side: OrderSide) => void;
  setPrice: (price: number | undefined) => void;
  setAmount: (amount: number | undefined) => void;
};

export const useOrderFormStore = create<OrderFormState>((set) => ({
  orderType: "limit",
  orderSide: "buy",
  price: undefined,
  amount: undefined,
  setOrderType: (orderType) => set({ orderType }),
  setOrderSide: (orderSide) => set({ orderSide }),
  setPrice: (price) => set({ price }),
  setAmount: (amount) => set({ amount }),
}));
