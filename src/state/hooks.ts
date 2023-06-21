import { useEffect, useReducer, useRef } from "react";

import { WAITING_SCREEN_DURATION_SECONDS } from "../constants";

import reducer from "./reducer";
import initialState from "./state";
import { ActionType, GameStage } from "./types";
import { api } from "../api";
import { roundToTwoDecimals } from "../helpers";

const useGameLogic = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentCoefficientRef = useRef(1);
  const { user_id } = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );

  const handleSetLoadStage = () =>
    dispatch({ type: ActionType.SET_WAIT_STAGE });
  const handleSetPlayStage = () =>
    dispatch({ type: ActionType.SET_PLAY_STAGE });

  //@TODO: maybe put this into component, and handleSetBet will be used when button clicked
  // so until you press the button to bet, there's no value in store.
  // I wont have to convert to number every time as well

  const handleSetBetAmount = (value: string) => {
    const { moneyAmount } = state;

    const parsedValue = Number(value);

    const validatedValue = isNaN(parsedValue)
      ? state.betAmount
      : parsedValue > moneyAmount
      ? moneyAmount.toString()
      : parsedValue < 1
      ? "1"
      : Number(value).toFixed(2);

    dispatch({
      type: ActionType.SET_BET_AMOUNT,
      value: validatedValue,
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
  };

  const handleWithdrawBet = () => {
    api.bets
      .post({
        user_id: user_id,
        bet: Number(state.betAmount),
        coefficient: state.withdrawCoefficient,
        winning_amount: roundToTwoDecimals(
          state.withdrawCoefficient * Number(state.betAmount)
        ),
        is_active_bet: true,
      })
      .then((response) => {
        if (response.ok) {
          dispatch({
            type: ActionType.WITHDRAW_BET,
            value: currentCoefficientRef.current,
          });
        }
      });
  };

  const handleCloseWithdrawModal = () =>
    dispatch({ type: ActionType.CLOSE_WITHDRAW_MODAL });

  const handleGetHistory = () => {
    api.bets.list(user_id).then((response) => {
      const list = response.data;
      dispatch({
        type: ActionType.SET_BET_HISTORY,
        value: list,
      });
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
      type: ActionType.CLOSE_WITHDRAW_MODAL,
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
      const { money_amount } = response.data;
      console.log(money_amount);
      dispatch({
        type: ActionType.SET_MONEY_AMOUNT,
        value: money_amount,
      });
    });
  };
  useEffect(getMoneyAmountEffect, []);

  const getHistoryEffect = () => {
    api.bets.list(user_id).then((response) => {
      const list = response.data;
      dispatch({
        type: ActionType.SET_BET_HISTORY,
        value: list,
      });
      dispatch({
        type: ActionType.SET_COEFFICIENT_LIST,
        value: list.map((bet) => Math.round(bet.coefficient)).slice(0, 7),
      });
    });
  };

  useEffect(getHistoryEffect, []);

  const postSessionEffect = () => {
    api.session.post({ user_id: user_id });
  };

  useEffect(postSessionEffect, []);

  const getCasinoLinkEffect = () => {
    api.casino.get(user_id).then((response) => {
      const link = response.data?.link;

      dispatch({
        type: ActionType.SET_CASINO_LINK,
        value: link,
      });
    });
  };

  useEffect(getCasinoLinkEffect, []);

  useEffect(() => {
    handleGetHistory();
  }, [state.isRoundFinished]);

  //@NOTE: if user confirmed bet, then money is removed
  //(and POST with new money amount is sent) on gmae start
  const withdrawBetAmountOnGameStartEffect = () => {
    const { stage, isBetConfirmed, moneyAmount, betAmount } = state;

    if (stage === GameStage.PLAY && isBetConfirmed) {
      const newAmount = moneyAmount - Number(betAmount);

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

  //@TODO: remove
  console.debug(state);

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
