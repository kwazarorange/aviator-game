import styles from "./LoadingScreen.module.scss";
import circleInsideImage from "../../assets/images/loader-circle-inside.svg";
import circleOutsideImage from "../../assets/images/loader-circle-outside.svg";
import loaderRocketImage from "../../assets/images/loader-rocket.svg";
import loaderExhaustImage from "../../assets/images/loader-fires.svg";
import { localization } from "../../helpers";

function LoadingScreen() {

  return (
    <div className={styles.container}>
      <div className={styles.loader__container}>
        <div className={styles.circle__container}>
          <div className={styles.circle}>
            <img
              className={styles.circle__inside}
              src={circleInsideImage}
              alt="insideCircle"
            />
            <img
              className={styles.circle__outside}
              src={circleOutsideImage}
              alt="outsideCircle"
            />
          </div>
        </div>
        <div className={styles.rocket__container}>
          <img className={styles.rocket} src={loaderRocketImage} alt="rocket" />
          <img
            className={styles.exhaust}
            src={loaderExhaustImage}
            alt="exhaust"
          />
        </div>
      </div>
      <div className={styles.loader__title}>{localization('wait.title')}</div>
      <div className={styles.loader__bar}></div>
    </div>
  );
}

export default LoadingScreen;
