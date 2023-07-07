import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import PlayScreen from "../PlayScreen";

import styles from "./Game.module.scss";
import LoadingScreen from "../LoadingScreen";
import { GameContext, GameStage } from "../../state";
import { localization, roundToTwoDecimals } from "../../helpers";

function Game() {
  const [
    {
      stage,
      betAmount,
      withdrawCoefficient,
      casinoLink,
      isBetWithdrawn,
      isRequestFundsPopupVisible,
      isWithdrawModalVisible,
    },
    { handleRequestFunds, handleCloseWithdrawModal },
  ] = useContext(GameContext);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className={styles.container}>
        <div ref={gameContainerRef} className={styles.container__border}>
          {stage === GameStage.PLAY ? (
            <PlayScreen gameContainerRef={gameContainerRef} />
          ) : (
            <LoadingScreen />
          )}
          {isBetWithdrawn && (
            <div className={styles.withdraw_popup}>
              <div className={styles.withdraw_popup__text}>
                <p>{localization("withdraw.popup.title")}</p>
                <h2>
                  {roundToTwoDecimals(betAmount * withdrawCoefficient)}
                  &nbsp;💎
                </h2>
              </div>
              <div className={styles.withdraw_popup__ratio}>
                <p>{withdrawCoefficient}X</p>
              </div>
            </div>
          )}
          {isRequestFundsPopupVisible && (
            <button
              className={clsx(
                styles.request_funds_button,
                styles.withdraw_popup
              )}
              onClick={handleRequestFunds}
            >
              <div className={styles.request_funds_button__text}>
                <h2>{localization("request.popup.title")}</h2>
              </div>
            </button>
          )}
          <div
            className={clsx(styles.background, styles["background--stars"])}
          />
          <div
            className={clsx(
              styles.background,
              styles["background--left"],
              stage === GameStage.PLAY && styles["background--left--running"]
            )}
          />
          <div
            className={clsx(
              styles.background,
              styles["background--bottom"],
              stage === GameStage.PLAY && styles["background--bottom--running"]
            )}
          />
        </div>
      </div>
      {isWithdrawModalVisible &&
        createPortal(
          <div
            id="modal-root"
            style={{ zIndex: 140, position: "absolute", left: 0, top: 0 }}
          >
            <div className={styles.withdraw_modal}>
              <div className={styles.withdraw_modal__content}>
                <div style={{ width: "100%" }}>
                  <a
                    className={styles.withdraw_modal__button}
                    href={casinoLink}
                    target="_blank"
                  >
                    <p>{localization("withdraw.modal.link")}</p>
                  </a>
                </div>
                <div style={{ width: "100%" }}>
                  <button
                    className={styles.withdraw_modal__button}
                    onClick={handleCloseWithdrawModal}
                  >
                    <p>{localization("withdraw.modal.continue")}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Game;
