import { RefObject, useContext, useEffect, useRef } from "react";
import clsx from "clsx";
import anime from "animejs";

import { ANIMATION_DURATION_COEFFICIENT_MS } from "../../constants";
import { GameContext, GameStage } from "../../state";

import styles from "./Betting.module.scss";
import { cancelAnimation, localization } from "../../helpers";

const usePotentialWinAnimation = (
  containerRef: RefObject<HTMLParagraphElement>,
  finalCoefficient: number,
  betAmount: string,
  animationRandomnessCoefficient: number,
  isAnimationStarted: boolean,
  isAnimationStopped: boolean,
  isRoundLost: boolean
) => {
  const animationRef = useRef<anime.AnimeInstance>();
  const animationTarget = { betAmount: Number(betAmount) };

  useEffect(() => {
    if (isAnimationStarted) {
      animationRef.current = anime({
        targets: animationTarget,
        betAmount: finalCoefficient * Number(betAmount),
        easing: "linear",
        round: 100,
        duration:
          ANIMATION_DURATION_COEFFICIENT_MS *
          animationRandomnessCoefficient *
          finalCoefficient,
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
      if (containerRef.current && isRoundLost) {
        containerRef.current.innerHTML = "0&nbsp;💎";
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

  usePotentialWinAnimation(
    betAmountRef,
    maxCoefficient,
    betAmount,
    animationRandomnessCoefficient,
    stage === GameStage.PLAY && isBetConfirmed,
    isBetWithdrawn || isRoundFinished,
    isRoundFinished && !isBetWithdrawn
  );

  const handleBetInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => handleSetBetAmount(e.target.value);

  const handleBetButtonClick = (value: number) =>
    handleSetBetAmount((Number(betAmount) + value).toString());

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
            onClick={() => handleBetButtonClick(-1)}
          />
          <div className={styles["betting__input__counter__input-container"]}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={betAmount}
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
            onClick={() => handleBetButtonClick(1)}
          />
        </div>
        <div className={styles.betting__input__delimiter} />
        <div className={styles.betting__input__bids}>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(50)}
          >
            +50
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(100)}
          >
            +100
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(250)}
          >
            +250
          </button>
          <button
            disabled={isBetControlsDisabled}
            className={styles.betting__input__bids__bid}
            onClick={() => handleBetButtonClick(moneyAmount)}
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
