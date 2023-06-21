import { RefObject, useContext, useEffect, useRef } from "react";
import anime from "animejs";
import clsx from "clsx";

import Coefficient from "../Coefficient";

import jetpackImage from "../../assets/images/jetpack.gif";
import fireImage from "../../assets/images/fire.gif";
import graphImage from "../../assets/images/graph.png";

import styles from "./PlayScreen.module.scss";
import { GameContext } from "../../state";
import { createPortal } from "react-dom";
import { localization, roundToTwoDecimals } from "../../helpers";
import { GAME_CONTAINER_WIDTH } from "../../constants";

/** How far away from boundaries of game container rider must be. in px */
const RIDER_SCREEN_OFFSET = 10;

/** Game container is offset from borders for some reason. */
const GAME_CONTAINER_OFFSET = {
  x: 29,
  y: 12,
};

const RIDER_DIMENSIONS = {
  height: 124,
  width: 87,
};

/** Min/max values for pause after each rider flying animation */
const RIDER_ANIMATION_OFFSET_MS = {
  from: 0,
  to: 500,
};

const useRiderAnimation = (
  containerRef: RefObject<HTMLDivElement>,
  riderRef: RefObject<HTMLImageElement>,
  exhaustRef: RefObject<HTMLDivElement>,
  graphRef: RefObject<HTMLImageElement>,
  isRoundFinished: boolean
) => {
  const riderAnimationRef = useRef<anime.AnimeInstance>();
  const graphAnimationRef = useRef<anime.AnimeInstance>();

  useEffect(() => {
    const containerDOMRect = containerRef.current?.getBoundingClientRect();
    const containerWidth = containerDOMRect?.width as number;
    const containerHeight = containerDOMRect?.height as number;

    /** Boundaries where jetpack rider can move. Top right quarter of the screen */
    const flyingBoundaries = {
      x: {
        from: containerWidth / 2,
        to:
          containerWidth -
          RIDER_DIMENSIONS.width -
          GAME_CONTAINER_OFFSET.x -
          RIDER_SCREEN_OFFSET,
      },
      y: {
        from: -(containerHeight / 2),
        to: -(
          containerHeight -
          RIDER_DIMENSIONS.height -
          GAME_CONTAINER_OFFSET.y -
          RIDER_SCREEN_OFFSET
        ),
      },
    };

    const addAnimation = (count: number) => {
      const riderX = anime.random(
        flyingBoundaries.x.from,
        flyingBoundaries.x.to
      );
      const riderY = anime.random(
        flyingBoundaries.y.from,
        flyingBoundaries.y.to
      );

      const endDelay = anime.random(
        RIDER_ANIMATION_OFFSET_MS.from,
        RIDER_ANIMATION_OFFSET_MS.to
      );

      riderAnimationRef.current = anime({
        targets: [riderRef.current, exhaustRef.current],
        easing: "easeInOutQuart",
        translateX: riderX,
        translateY: riderY,
        endDelay: endDelay,
        complete: () => {
          addAnimation(count + 1);
        },
      });

      graphAnimationRef.current = anime({
        targets: graphRef.current,
        easing: "easeInOutQuart",
        scaleX: (riderX + RIDER_DIMENSIONS.width / 2) / 10,
        scaleY: (-riderY + RIDER_DIMENSIONS.height) / 10,
        endDelay: endDelay,
      });
    };

    addAnimation(0);
  }, []);

  useEffect(() => {
    if (isRoundFinished) {
      const containerDOMRect = containerRef.current?.getBoundingClientRect();
      const containerHeight = containerDOMRect?.height as number;

      anime.remove([riderRef.current, exhaustRef.current, graphRef.current]);
      riderAnimationRef.current = anime({
        targets: [riderRef.current, exhaustRef.current],
        easing: "linear",
        duration: 400,
        translateX: GAME_CONTAINER_WIDTH,
        translateY: -containerHeight,
      });
    }
  }, [isRoundFinished]);
};

type Props = {
  gameContainerRef: RefObject<HTMLDivElement>;
};

function PlayScreen({ gameContainerRef }: Props) {
  const [
    {
      casinoLink,
      withdrawCoefficient,
      betAmount,
      isRoundFinished,
      isBetWithdrawn,
      isRequestFundsPopupVisible,
      isWithdrawModalVisible,
    },
    { handleCloseWithdrawModal, handleRequestFunds },
  ] = useContext(GameContext);
  const riderRef = useRef<HTMLImageElement>(null);
  const exhaustRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLImageElement>(null);

  useRiderAnimation(
    gameContainerRef,
    riderRef,
    exhaustRef,
    graphRef,
    isRoundFinished
  );

  return (
    <>
      <Coefficient />
      <div className={styles.game__container}>
        <img
          ref={riderRef}
          className={styles.game__jetpack}
          src={jetpackImage}
          height={RIDER_DIMENSIONS.height}
          width={RIDER_DIMENSIONS.width}
          alt="jetpack"
        />
        <div ref={exhaustRef} className={styles["game__exhaust-container"]}>
          <img className={styles.game__exhaust} src={fireImage} alt="exhaust" />
        </div>
        <img
          ref={graphRef}
          className={styles.game__graph}
          src={graphImage}
          alt="graph"
        />
      </div>
      {isBetWithdrawn && (
        <div className={styles.withdraw_popup}>
          <div className={styles.withdraw_popup__text}>
            <p>{localization("withdraw.popup.title")}</p>
            <h2>
              {roundToTwoDecimals(Number(betAmount) * withdrawCoefficient)}
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
          className={clsx(styles.request_funds_button, styles.withdraw_popup)}
          onClick={handleRequestFunds}
        >
          <div className={styles.request_funds_button__text}>
            <h2>{localization("request.popup.title")}</h2>
          </div>
        </button>
      )}
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

export default PlayScreen;
