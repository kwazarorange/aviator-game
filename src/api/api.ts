import { AxiosResponse } from "axios";
import axios from "./client";

import {
  BASE_ROUTE,
  GET_BET_HISTORY,
  GET_CASINO_LINK,
  GET_COEFFICIENT_HISTORY,
  GET_MONEY_AMOUNT,
  POST_BET,
  SET_COEFFICIENT,
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
  CoefficientListPayload,
  PostCoefficientPayload,
} from "./types";

const handleResponse = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) =>
    axios
      .get<T>(`${BASE_ROUTE}${url}/`, {
        headers: { init_data: Telegram.WebApp.initData },
      })
      .then(handleResponse),
  post: <T>(url: string, data: {}) =>
    axios
      .post<T>(`${BASE_ROUTE}${url}/`, data, {
        headers: { init_data: Telegram.WebApp.initData },
      })
      .then(handleResponse),
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
  coefficient: (userId: string) =>
    request.get<ResponsePayload<CoefficientListPayload>>(
      `${GET_COEFFICIENT_HISTORY}/${userId}`
    ),
  create_coefficient: (data: PostCoefficientPayload) =>
    request.post<ResponsePayload<null>>(SET_COEFFICIENT, data),
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
