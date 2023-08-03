import { useEffect, useReducer, useRef } from "react";

import { WAITING_SCREEN_DURATION_SECONDS } from "../constants";

import reducer from "./reducer";
import initialState from "./state";
import { ActionType, GameStage } from "./types";
import { api } from "../api";
import { roundToTwoDecimals, useSearchParams } from "../helpers";

const useGameLogic = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentCoefficientRef = useRef(1);
  const { user_id } = useSearchParams();

  const handleSetLoadStage = () =>
    dispatch({ type: ActionType.SET_WAIT_STAGE });
  const handleSetPlayStage = () => {
    dispatch({ type: ActionType.SET_PLAY_STAGE });
  };

  const handleSetBetAmount = (value: number) => {
    dispatch({
      type: ActionType.SET_BET_AMOUNT,
      value: value,
    });
  };

  const handleConfirmBet = (value: boolean) => {
    dispatch({
      type: ActionType.CONFIRM_BET,
      value,
    });
  };

  const handleRoundEnd = () => {
    dispatch({
      type: ActionType.SET_ROUND_END,
      value: currentCoefficientRef.current,
    });

    api.bets.create_coefficient({
      user_id: user_id,
      coefficient: currentCoefficientRef.current,
    });
  };

  const handleBetResult = (isWin: boolean) => {
    const moneyAmountDifference = isWin
      ? roundToTwoDecimals(
          currentCoefficientRef.current * Number(state.betAmount)
        )
      : 0;

    const coefficient = isWin
      ? currentCoefficientRef.current
      : state.maxCoefficient;

    api.bets
      .post({
        user_id: user_id,
        bet: Number(state.betAmount),
        coefficient: coefficient,
        winning_amount: moneyAmountDifference,
        is_active_bet: true,
      })
      .then((response) => {
        if (isWin && response.ok) {
          dispatch({
            type: ActionType.WITHDRAW_BET,
            value: coefficient,
          });
          dispatch({
            type: ActionType.SET_BET_HISTORY,
            value: [...state.history, response.data],
          });
        }
      });
  };

  const handleLoseBet = () => handleBetResult(false);

  const handleWithdrawBet = () => handleBetResult(true);

  const handleCloseWithdrawModal = () =>
    dispatch({ type: ActionType.CLOSE_WITHDRAW_MODAL });

  const handleGetHistory = () => {
    api.bets.list(user_id).then((response) => {
      if (response.ok) {
        const list = response.data;
        dispatch({
          type: ActionType.SET_BET_HISTORY,
          value: list,
        });
      }
    });
  };

  const handleResetRound = () => {
    dispatch({
      type: ActionType.RESET_ROUND,
    });
  };

  const handleRequestFunds = () => {
    const newAmount = roundToTwoDecimals(state.moneyAmount + 100);

    dispatch({
      type: ActionType.CLOSE_REQUEST_FUNDS_POPUP,
    });

    api.wallet
      .post({ user_id: user_id, money_amount: newAmount })
      .then((response) => {
        if (response.ok) {
          dispatch({
            type: ActionType.SET_MONEY_AMOUNT,
            value: newAmount,
          });
        }
      });
  };

  const switchLoadingToPlayEffect = () => {
    if (state.stage === GameStage.WAIT) {
      setTimeout(() => {
        handleSetPlayStage();
      }, WAITING_SCREEN_DURATION_SECONDS * 1000);
    }
  };

  useEffect(switchLoadingToPlayEffect, [state.stage]);

  const switchPlayToLoadingEffect = () => {
    if (state.stage === GameStage.PLAY && state.isRoundFinished) {
      setTimeout(() => {
        handleSetLoadStage();
      }, 5000);

      if (!state.isBetWithdrawn && state.isBetConfirmed) {
        handleLoseBet();
      }

      if (!state.isBetConfirmed) {
        api.bets.post({
          user_id: user_id,
          bet: 0,
          coefficient: state.maxCoefficient,
          winning_amount: 0,
          is_active_bet: false,
        });
      }
    }
  };

  useEffect(switchPlayToLoadingEffect, [state.isRoundFinished, state.stage]);

  const closeRequestFundsPopupEffect = () => {
    if (state.isRequestFundsPopupVisible) {
      setTimeout(() => {
        dispatch({
          type: ActionType.CLOSE_REQUEST_FUNDS_POPUP,
        });
      }, 3000);
    }
  };

  useEffect(closeRequestFundsPopupEffect, [state.isRequestFundsPopupVisible]);

  /** Gets amount of money on start */
  const getMoneyAmountEffect = () => {
    api.wallet.get(user_id).then((response) => {
      if (response.ok) {
        const { money_amount } = response.data;
        dispatch({
          type: ActionType.SET_MONEY_AMOUNT,
          value: money_amount,
        });
      }
    });
  };
  useEffect(getMoneyAmountEffect, []);

  const getHistoryEffect = () => {
    api.bets.list(user_id).then((response) => {
      if (response.ok) {
        const list = response.data;
        dispatch({
          type: ActionType.SET_BET_HISTORY,
          value: list,
        });
      }
    });
  };

  useEffect(getHistoryEffect, []);

  const getCoefficientListEffect = () => {
    api.bets.coefficient(user_id).then((response) => {
      if (response.ok) {
        const list = response.data;

        dispatch({
          type: ActionType.SET_COEFFICIENT_LIST,
          value: list,
        });
      }
    });
  };

  useEffect(getCoefficientListEffect, []);

  // const postSessionEffect = () => {
  //   api.session.post({ user_id: user_id });
  // };

  // useEffect(postSessionEffect, []);

  const getCasinoLinkEffect = () => {
    api.casino.get(user_id).then((response) => {
      if (response.ok) {
        const link = response.data?.link;

        dispatch({
          type: ActionType.SET_CASINO_LINK,
          value: link,
        });
      }
    });
  };

  useEffect(getCasinoLinkEffect, []);

  //@NOTE: if user confirmed bet, then money is removed
  //(and POST with new money amount is sent) on gmae start
  const withdrawBetAmountOnGameStartEffect = () => {
    const { stage, isBetConfirmed, moneyAmount, betAmount } = state;

    if (stage === GameStage.PLAY && isBetConfirmed) {
      const newAmount = moneyAmount - betAmount;

      api.wallet
        .post({ money_amount: newAmount, user_id: user_id })
        .then(() => {
          dispatch({
            type: ActionType.SET_MONEY_AMOUNT,
            value: newAmount,
          });
        });
    }
  };

  useEffect(withdrawBetAmountOnGameStartEffect, [state.stage]);

  return [
    state,
    {
      handleSetLoadStage,
      handleSetPlayStage,
      handleSetBetAmount,
      handleConfirmBet,
      handleWithdrawBet,
      handleRoundEnd,
      handleRequestFunds,
      handleGetHistory,
      handleCloseWithdrawModal,
      handleResetRound,
    },
    currentCoefficientRef,
  ] as const;
};

export default useGameLogic;
