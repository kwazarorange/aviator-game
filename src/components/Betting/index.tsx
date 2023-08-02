import { RefObject, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import anime from "animejs";

import { GameContext, GameStage } from "../../state";

import styles from "./Betting.module.scss";
import {
  calculateDuration,
  cancelAnimation,
  localization,
  roundToTwoDecimals,
} from "../../helpers";

const usePotentialWinAnimation = (
  containerRef: RefObject<HTMLParagraphElement>,
  finalCoefficient: number,
  withdrawCoefficient: number,
  betAmount: number,
  animationRandomnessCoefficient: number,
  isAnimationStarted: boolean,
  isAnimationStopped: boolean,
  isRoundLost: boolean
) => {
  const animationRef = useRef<anime.AnimeInstance>();
  const animationTarget = { betAmount };

  useEffect(() => {
    if (isAnimationStarted) {
      const duration = calculateDuration(
        finalCoefficient,
        animationRandomnessCoefficient
      );

      animationRef.current = anime({
        targets: animationTarget,
        betAmount: finalCoefficient * betAmount,
        easing: "linear",
        round: 100,
        duration,
        update: () => {
          if (containerRef.current) {
            containerRef.current.innerHTML = `${animationTarget.betAmount.toFixed(
              2
            )}&nbsp;💎`;
          }
        },
      });
    }
  }, [isAnimationStarted]);

  useEffect(() => {
    if (isAnimationStopped) {
      //@TODO: cancelAnimation crashes the game in this instance for some reason
      // cancelAnimation(animationRef.current as anime.AnimeInstance);
      animationRef.current?.pause();
      if (containerRef.current) {
        if (isRoundLost) {
          containerRef.current.innerHTML = "0&nbsp;💎";
        } else {
          containerRef.current.innerHTML = `${roundToTwoDecimals(betAmount * withdrawCoefficient)}&nbsp;💎`;
        }
      }
    }
  }, [isAnimationStopped]);

  useEffect(() => {
    return () => cancelAnimation(animationRef.current as anime.AnimeInstance);
  }, []);
};

function Betting() {
  const [
    {
      maxCoefficient,
      withdrawCoefficient,
      betAmount,
      moneyAmount,
      isBetConfirmed,
      isBetWithdrawn,
      isRoundFinished,
      stage,
      animationRandomnessCoefficient,
    },
    { handleSetBetAmount, handleConfirmBet, handleWithdrawBet },
  ] = useContext(GameContext);
  const betAmountRef = useRef<HTMLParagraphElement>(null);
  const [inputValue, setInputValue] = useState<string>("10");

  usePotentialWinAnimation(
    betAmountRef,
    maxCoefficient,
    withdrawCoefficient,
    betAmount,
    animationRandomnessCoefficient,
    stage === GameStage.PLAY && isBetConfirmed,
    isBetWithdrawn || isRoundFinished,
    isRoundFinished && !isBetWithdrawn
  );

  const handleBetInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const parsedValue = Number(e.target.value);
    const validatedValue = roundToTwoDecimals(Math.max(0, parsedValue));

    if (!Number.isNaN(parsedValue)) {
      setInputValue(
        parsedValue !== validatedValue
          ? validatedValue.toString()
          : e.target.value
      );
      handleSetBetAmount(validatedValue);
    }
  };

  const handleBetButtonClick = (value: number) => {
    const updatedValue = roundToTwoDecimals(Math.max(0, value));
    setInputValue(updatedValue.toString());
    handleSetBetAmount(updatedValue);
  };

  const handleConfirmBetButtonClick = () => handleConfirmBet(!isBetConfirmed);

  const handleWithdrawBetButtonClick = () => handleWithdrawBet();

  const isAbleToWithdraw =
    stage === GameStage.PLAY &&
    isBetConfirmed &&
    !isRoundFinished &&
    !isBetWithdrawn;
  const isAbleToConfirmBet = stage === GameStage.WAIT;

  const isBetControlsDisabled = isBetConfirmed || stage === GameStage.PLAY;

  return (
    <div className={styles.betting}>
      <div className={styles.betting__input}>
        <div className={styles.betting__input__counter}>
          <button
            disabled={isBetControlsDisabled}
            className={clsx(
              styles.betting__input__counter__button,
              styles["betting__input__counter__button--minus"]
            )}
            onClick={() => handleBetButtonClick(betAmount - 10)}
          />
          <div className={styles["betting__input__counter__input-container"]}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={inputValue}
              disabled={isBetControlsDisabled}
              onChange={handleBetInputChange}
            ></input>
            <span>&nbsp;💎</span>
          </div>
          <button
            disabled={isBetControlsDisabled}
            className={clsx(
              styles.betting__input__counter__button,
              styles["betting__input__counter__button--plus"]
            )}
            onClick={() => handleBetButtonClick(betAmount + 10)}
          />
        </div>
        <div className={styles.betting__input__delimiter} />
        <div className={styles.betting__input__bids}>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(betAmount + 50)}
          >
            +50
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(betAmount + 100)}
          >
            +100
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(betAmount + 250)}
          >
            +250
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() =>
              handleBetButtonClick(moneyAmount > 10 ? moneyAmount : 10)
            }
          >
            max
          </button>
        </div>
      </div>
      <button
        className={clsx(
          styles["betting__place-bet"],
          isBetConfirmed &&
            stage === GameStage.WAIT &&
            styles["betting__place-bet--cancel"],
          isBetConfirmed &&
            stage === GameStage.PLAY &&
            styles["betting__place-bet--bright"]
        )}
        disabled={!isAbleToConfirmBet && !isAbleToWithdraw}
        onClick={
          isAbleToWithdraw
            ? handleWithdrawBetButtonClick
            : isAbleToConfirmBet
            ? handleConfirmBetButtonClick
            : () => {}
        }
      >
        {isBetConfirmed && stage === GameStage.PLAY && (
          <p ref={betAmountRef}>
            {isRoundFinished && !isBetWithdrawn ? 0 : betAmount}&nbsp;💎
          </p>
        )}
        {isBetConfirmed && stage === GameStage.PLAY
          ? localization("bet.withdraw")
          : isBetConfirmed && stage === GameStage.WAIT
          ? localization("bet.cancel")
          : localization("bet.place")}
      </button>
    </div>
  );
}

export default Betting;
