import { useContext } from "react";
import clsx from "clsx";

import { GameContext } from "../../state";

import styles from "./CoefficientList.module.scss";

function CoefficientList() {
  const [{ coefficientList }] = useContext(GameContext);

  return (
    <div className={styles.history}>
      {coefficientList.map((coefficient) => (
        <div
          className={clsx(
            styles.history__item,
            coefficient >= 3 && styles["history__item--purple"],
            coefficient >= 10 && styles["history__item--orange"]
          )}
        >
          {`${coefficient}x`}
        </div>
      ))}
    </div>
  );
}

export default CoefficientList;
