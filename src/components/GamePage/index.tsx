import styles from "./GamePage.module.scss";
import { useContext, useEffect } from "react";
import { GameContext } from "../../state";
import Header from "../Header";
import Game from "../Game";
import Betting from "../Betting";
import CashOutLink from "../CashOutLink";

function GamePage() {
  const [_, { handleResetRound }] = useContext(GameContext);
  useEffect(() => {
    return () => {
      handleResetRound();
    };
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <Game />
      <Betting />
      <CashOutLink />
    </div>
  );
}

export default GamePage;
