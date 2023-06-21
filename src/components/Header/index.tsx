import CoefficientList from "../CoefficientList";

import luckyJetLogoImage from "../../assets/images/LuckyJet.svg";
import walletImage from "../../assets/images/wallet.svg";
import styles from "./Header.module.scss";
import { Link } from "wouter";
import { useContext } from "react";
import { GameContext } from "../../state";
import { localization, roundToTwoDecimals } from "../../helpers";

function Header() {
  const [{ moneyAmount, history }] = useContext(GameContext);

  const maxWinCoefficient = Math.max(
    0,
    ...history
      .filter((bet) => bet.winning_amount)
      .map((bet) => roundToTwoDecimals(bet.coefficient))
  );

  return (
    <div className={styles.header}>
      <div className={styles.header__info}>
        <img src={luckyJetLogoImage} alt="Logo" />
        <div className={styles.header__statistics}>
          <Link href="/bids">
            <a className={styles.header__wallet}>
              <img src={walletImage} alt="Wallet" />
              <h3>{moneyAmount}&nbsp;💎</h3>
            </a>
          </Link>
          <div className={styles.header__delimiter} />
          <div className={styles.header__record}>
            <span>{localization('header.record')}</span>
            <div className={styles.header__ratio}>{maxWinCoefficient}</div>
          </div>
        </div>
      </div>
      <CoefficientList />
    </div>
  );
}

export default Header;
