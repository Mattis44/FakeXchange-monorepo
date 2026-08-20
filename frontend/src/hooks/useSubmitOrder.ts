import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { OrderSide, OrderType } from "../types/Market";

type SubmitOrderParams = {
  userId: string;
  marketId: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  size: number;
};

export function useSubmitOrder() {
  return useMutation({
    mutationFn: (params: SubmitOrderParams) =>
      api.post("/orders", params).then((r) => r.data),
  });
}
