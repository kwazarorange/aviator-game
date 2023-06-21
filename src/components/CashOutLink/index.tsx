import { useContext } from "react";
import { GameContext } from "../../state";
import styles from "./CashOutLink.module.scss";
import { localization } from "../../helpers";

function CashOutLink() {
  const [{ casinoLink }] = useContext(GameContext);

  return (
    <a className={styles.cashout} href={casinoLink} target="_blank">
      {localization("cashout.link")}
    </a>
  );
}

export default CashOutLink;
