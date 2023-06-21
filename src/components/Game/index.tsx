import { useContext, useRef } from "react";
import clsx from "clsx";

import PlayScreen from "../PlayScreen";

import styles from "./Game.module.scss";
import LoadingScreen from "../LoadingScreen";
import { GameContext, GameStage } from "../../state";

function Game() {
  const [{ stage }] = useContext(GameContext);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <div ref={gameContainerRef} className={styles.container__border}>
        {stage === GameStage.PLAY ? (
          <PlayScreen gameContainerRef={gameContainerRef} />
        ) : (
          <LoadingScreen />
        )}
        <div className={clsx(styles.background, styles["background--stars"])} />
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
  );
}

export default Game;
