import { RefObject, useContext, useEffect, useRef } from "react";
import anime from "animejs";

import Coefficient from "../Coefficient";

import jetpackImage from "../../assets/images/jetpack.gif";
import fireImage from "../../assets/images/fire.gif";
import graphImage from "../../assets/images/graph.png";

import styles from "./PlayScreen.module.scss";
import { GameContext } from "../../state";
import { cancelAnimation } from "../../helpers";
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
  to: 250,
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

      // const endDelay = anime.random(
      //   RIDER_ANIMATION_OFFSET_MS.from,
      //   RIDER_ANIMATION_OFFSET_MS.to
      // );

      // the greater the mass, the larger the displacement 
      // from the equilibrium position and the longer the duration 
      // of the oscillations
      const mass = 20
      // the lower the value, the stronger the spring
      const stiffness = 100
      // Higher damping leads to fewer oscillations and lower duration
      const damping = 80
      // Greater velocity leads to greater displacement 
      // from the equilibrium position
      const velocity = 5

      const easingFunction = `spring(${mass}, ${stiffness}, ${damping}, ${velocity})`

      riderAnimationRef.current = anime({
        targets: [riderRef.current, exhaustRef.current],
        easing: easingFunction,
        translateX: riderX,
        translateY: riderY,
        complete: () => {
          addAnimation(count + 1);
        },
      });

      graphAnimationRef.current = anime({
        targets: graphRef.current,
        easing: easingFunction,
        scaleX: (riderX + RIDER_DIMENSIONS.width / 2) / 10,
        scaleY: (-riderY + RIDER_DIMENSIONS.height / 1.5) / 10,
      });
    };

    addAnimation(0);

    return () => {
      cancelAnimation(riderAnimationRef.current as anime.AnimeInstance);
      cancelAnimation(graphAnimationRef.current as anime.AnimeInstance);
    };
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
  const [{ isRoundFinished }] = useContext(GameContext);
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
    </>
  );
}

export default PlayScreen;
