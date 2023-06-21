import { AxiosResponse } from "axios";
import axios from "./client";

import {
  GET_BET_HISTORY,
  GET_CASINO_LINK,
  GET_MONEY_AMOUNT,
  POST_BET,
  SET_GAME_TIME,
  SET_MONEY_AMOUNT,
} from "./routes";
import type {
  ResponsePayload,
  BetPayload,
  TimeOfPlayPayload,
  CasinoLinkPayload,
  GetMoneyAmountPayload,
  PostMoneyAmountPayload,
  PostBetPayload,
} from "./types";

const handleResponse = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(handleResponse),
  post: <T>(url: string, data: {}) =>
    axios.post<T>(url, data).then(handleResponse),
};

const wallet = {
  get: (userId: string) =>
    request.get<ResponsePayload<GetMoneyAmountPayload>>(
      `${GET_MONEY_AMOUNT}/${userId}`
    ),
  post: (data: PostMoneyAmountPayload) =>
    request.post<ResponsePayload<null>>(SET_MONEY_AMOUNT, data),
};

const bets = {
  list: (userId: string) =>
    request.get<ResponsePayload<Array<BetPayload>>>(
      `${GET_BET_HISTORY}/${userId}`
    ),
  post: (data: PostBetPayload) =>
    request.post<ResponsePayload<null>>(POST_BET, data),
};

const casino = {
  get: (userId: string) =>
    request.get<ResponsePayload<CasinoLinkPayload>>(
      `${GET_CASINO_LINK}/${userId}`
    ),
};

const session = {
  post: (data: TimeOfPlayPayload) =>
    request.post<ResponsePayload<null>>(SET_GAME_TIME, data),
};

export const api = {
  wallet,
  bets,
  casino,
  session,
};
