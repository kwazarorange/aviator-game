import { Bet } from "../types";

export enum GameStage {
  WAIT,
  PLAY,
}

export type State = {
  stage: GameStage;
  isBetConfirmed: boolean;
  isBetWithdrawn: boolean;
  isRoundFinished: boolean; // whether coefficient stopped increasing or not
  isWithdrawModalVisible: boolean;
  isRequestFundsPopupVisible: boolean;
  betAmount: string;
  maxCoefficient: number; // coefficient for the round
  withdrawCoefficient: number;
  /** Animation speed randomness coefficient. Range: 0.5 - 1.5 */
  //@TODO: decide whether I need this or not.
  animationRandomnessCoefficient: number;

  moneyAmount: number;
  history: Array<Bet>;
  coefficientList: Array<number>
  casinoLink: string;
};

export enum ActionType {
  SET_PLAY_STAGE = "SET_PLAY_STAGE",
  SET_WAIT_STAGE = "SET_WAIT_STAGE",
  SET_BET_AMOUNT = "SET_BET_AMOUNT",
  SET_MONEY_AMOUNT = "SET_MONEY_AMOUNT",
  SET_BET_HISTORY = "SET_BET_HISTORY",
  SET_CASINO_LINK = "SET_CASINO_LINK",
  SET_COEFFICIENT_LIST = "SET_COEFFICIENT_LIST",
  CONFIRM_BET = "CONFIRM_BET",
  WITHDRAW_BET = "WITHDRAW_BET",
  SET_ROUND_END = "SET_ROUND_END",
  RESET_ROUND = "RESET_ROUND",
  CLOSE_WITHDRAW_MODAL = "CLOSE_WITHDRAW_MODAL",
  CLOSE_REQUEST_FUNDS_POPUP = "CLOSE_REQUEST_FUNDS_POPUP"
}

export type Action =
  | {
      type: ActionType.SET_WAIT_STAGE;
    }
  | {
      type: ActionType.SET_PLAY_STAGE;
    }
  | {
      type: ActionType.SET_BET_AMOUNT;
      value: string;
    }
  | {
      type: ActionType.CONFIRM_BET;
      value: boolean;
    }
  | {
      type: ActionType.WITHDRAW_BET;
      value: number;
    }
  | {
      type: ActionType.SET_MONEY_AMOUNT;
      value: number;
    }
  | {
      type: ActionType.SET_BET_HISTORY;
      value: Array<Bet>;
    }
  | {
      type: ActionType.SET_ROUND_END;
      value: number;
    }
  | {
      type: ActionType.SET_CASINO_LINK;
      value: string;
    }
  | {
      type: ActionType.CLOSE_WITHDRAW_MODAL;
    } | {
      type: ActionType.CLOSE_REQUEST_FUNDS_POPUP
    }
  | {
      type: ActionType.RESET_ROUND;
    } | {
      type: ActionType.SET_COEFFICIENT_LIST,
      value: Array<number>
    };
