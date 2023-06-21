import MockAdapter from "axios-mock-adapter";
import {
  GET_BET_HISTORY,
  GET_CASINO_LINK,
  GET_MONEY_AMOUNT,
  POST_BET,
  SET_GAME_TIME,
  SET_MONEY_AMOUNT,
} from "./routes";
import axios from "./client";

const mock = new MockAdapter(axios);

const GET_BET_HISTORY_REGEX = new RegExp(`${GET_BET_HISTORY}/*`);

mock.onGet(GET_BET_HISTORY_REGEX).reply(200, {
  ok: true,
  data: [
    {
      bet: 766930,
      coefficient: 1.3576,
      id: "a9d13bfb-673f-49ab-8f47-c91fade37162",
      is_active_bet: false,
      time: "2023-06-13T05:29:49.269916+00:00",
      user_id: "732888264",
      winning_amount: 123,
    },
  ],
});

const GET_CASINO_LINK_REGEX = new RegExp(`${GET_CASINO_LINK}/*`);

mock.onGet(GET_CASINO_LINK_REGEX).reply(200, {
  ok: true,
  data: { link: "https://1wllzo.top/casino/play" },
});

const GET_MONEY_AMOUNT_REGEX = new RegExp(`${GET_MONEY_AMOUNT}/*`);

mock.onGet(GET_MONEY_AMOUNT_REGEX).reply(200, {
  ok: true,
  data: { money_amount: 114.34 },
});

mock.onPost(SET_GAME_TIME).reply(200, {
  ok: true,
  data: null,
});

mock.onPost(SET_MONEY_AMOUNT).reply(200, {
  ok: true,
  data: null,
});

mock.onPost(POST_BET).reply(200, {
  ok: true,
  data: null,
});
