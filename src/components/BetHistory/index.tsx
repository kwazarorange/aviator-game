import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import format from "date-fns/format";
import { Link } from "wouter";

import crossImage from "../../assets/images/cross.svg";
import arrowImage from "../../assets/images/arrow.svg";
import { GameContext } from "../../state";

import styles from "./BetHistory.module.scss";
import { MAX_HISTORY_ELEMENTS_ON_PAGE } from "../../constants";
import { localization, roundToTwoDecimals } from "../../helpers";

function BetHistory() {
  const [{ history }, { handleGetHistory }] = useContext(GameContext);
  const [page, setPage] = useState(1);

  useEffect(handleGetHistory, []);

  const pagesAmount = Math.ceil(history.length / MAX_HISTORY_ELEMENTS_ON_PAGE);

  const currentPageHistory = history.slice(
    (page - 1) * MAX_HISTORY_ELEMENTS_ON_PAGE,
    page * MAX_HISTORY_ELEMENTS_ON_PAGE + 1
  );

  const handleNextPage = () =>
    setPage((page) => (page >= pagesAmount ? page : page + 1));
  const handlePrevPage = () =>
    setPage((page) => (page === 1 ? page : page - 1));

  return (
    <div className={styles.container}>
      <header className={styles.bets__header}>
        <div className={styles.bets__title}>
          <p>{localization('history.title')}</p>
        </div>
        <Link href="/">
          <a className={styles.bets__close}>
            <img src={crossImage} />
          </a>
        </Link>
      </header>
      <div className={styles.bets__list}>
        {currentPageHistory.map((bet) => (
          <div
            className={clsx(
              styles.bet,
              bet.winning_amount && styles["bet--success"]
            )}
          >
            <div className={styles.bet__datetime}>
              <span>{format(new Date(bet.time), "H:mm:ss")}</span>
              <span>{format(new Date(bet.time), "d.MM.yyyy")}</span>
            </div>
            <div className={styles.bet__amount}>
              {bet.winning_amount
                ? `+${bet.winning_amount}`
                : `-${roundToTwoDecimals(bet.bet * bet.coefficient)}`}
              &nbsp;💎
            </div>
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <div className={styles.footer__page}>{page > 1 ? page - 1 : ""}</div>
        <button
          className={clsx(styles.footer__nav, styles["footer__nav--left"])}
          disabled={page === 1}
          onClick={handlePrevPage}
        >
          <img src={arrowImage} />
        </button>
        <div
          className={clsx(styles.footer__page, styles["footer__page--current"])}
        >
          {page}
        </div>
        <button
          className={styles.footer__nav}
          disabled={page === pagesAmount}
          onClick={handleNextPage}
        >
          <img src={arrowImage} />
        </button>
        <div className={styles.footer__page}>{pagesAmount}</div>
      </footer>
    </div>
  );
}

export default BetHistory;
