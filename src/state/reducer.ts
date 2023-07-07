import { Reducer } from "react";
import { type State, type Action, ActionType, GameStage } from "./types";
import { initialState } from ".";
import { getWinCoefficient, roundToTwoDecimals } from "../helpers";

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SET_PLAY_STAGE:
      return {
        ...state,
        stage: GameStage.PLAY,
        maxCoefficient: roundToTwoDecimals(
          getWinCoefficient(state.numberOfRounds)
        ),
        animationRandomnessCoefficient: Math.random() * (1.3 - 0.7) + 0.7,
      };
    case ActionType.SET_WAIT_STAGE:
      return {
        ...state,
        stage: GameStage.WAIT,
        isRoundFinished: initialState.isRoundFinished,
        isBetConfirmed: initialState.isBetConfirmed,
        isBetWithdrawn: initialState.isBetWithdrawn,
        betAmount: initialState.betAmount,
        numberOfRounds: state.numberOfRounds + 1,
      };
    case ActionType.SET_MONEY_AMOUNT:
      return { ...state, moneyAmount: action.value };
    case ActionType.SET_BET_HISTORY:
      return {
        ...state,
        history: action.value,
        maxCoefficient: Math.max(
          0,
          ...action.value
            .filter((bet) => bet.winning_amount)
            .map((bet) => bet.coefficient)
        ),
      };
    case ActionType.SET_COEFFICIENT_LIST:
      return {
        ...state,
        coefficientList: action.value,
      };
    case ActionType.SET_BET_AMOUNT:
      return { ...state, betAmount: action.value };
    case ActionType.CONFIRM_BET: {
      const isNotEnoughFunds =
        !state.isBetConfirmed && Number(state.betAmount) > state.moneyAmount;

      if (isNotEnoughFunds) {
        return {
          ...state,
          isRequestFundsPopupVisible: true,
        };
      }

      return { ...state, isBetConfirmed: action.value };
    }
    case ActionType.WITHDRAW_BET:
      return {
        ...state,
        withdrawCoefficient: action.value,
        moneyAmount: roundToTwoDecimals(
          state.moneyAmount + Number(state.betAmount) * action.value
        ),
        isBetWithdrawn: true,
        isWithdrawModalVisible: true,
      };
    case ActionType.SET_ROUND_END:
      return {
        ...state,
        isRoundFinished: true,
        coefficientList: [
          Math.round(action.value),
          ...state.coefficientList,
        ].slice(0, 8),
      };
    case ActionType.SET_CASINO_LINK:
      return { ...state, casinoLink: action.value };
    case ActionType.CLOSE_WITHDRAW_MODAL:
      return { ...state, isWithdrawModalVisible: false };
    case ActionType.CLOSE_REQUEST_FUNDS_POPUP:
      return {
        ...state,
        isRequestFundsPopupVisible: false,
      };
    case ActionType.RESET_ROUND:
      return {
        ...initialState,
        casinoLink: state.casinoLink,
        history: state.history,
        moneyAmount: state.moneyAmount,
        coefficientList: state.coefficientList,
      };
    default:
      return state;
  }
};

export default reducer;
