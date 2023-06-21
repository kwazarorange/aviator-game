import { Bet } from "../types";

export type BetPayload = Bet;

export type TimeOfPlayPayload = {
  user_id: string;
};

export type CasinoLinkPayload = {
  link: string;
};

export type GetMoneyAmountPayload = {
  money_amount: number;
};

export type PostMoneyAmountPayload = {
  user_id: string;
  money_amount: number;
};

export type PostBetPayload = {
  user_id: string;
  bet: number;
  coefficient: number;
  winning_amount: number;
  is_active_bet: boolean;
};

export type RequestPayload<T> = { data: T };
export type ResponsePayload<T> = { ok: boolean; data: T };
