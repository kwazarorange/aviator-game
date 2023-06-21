import anime from "animejs";
import {
  MutableRefObject,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import styles from "./Coefficient.module.scss";
import { ANIMATION_DURATION_COEFFICIENT_MS } from "../../constants";
import { GameContext } from "../../state";
import { roundToTwoDecimals } from "../../helpers";

const useCoefficientAnimation = (
  containerRef: RefObject<HTMLDivElement>,
  currentCoefficientRef: MutableRefObject<number>,
  finalCoefficient: number,
  animationRandomnessCoefficient: number,
  onAnimationEnd: () => void
) => {
  const animationRef = useRef<anime.AnimeInstance>();
  const animationTarget = { coefficient: 1 };

  useEffect(() => {
    animationRef.current = anime({
      targets: animationTarget,
      coefficient: finalCoefficient,
      easing: "linear",
      round: 100,
      duration:
        ANIMATION_DURATION_COEFFICIENT_MS *
        animationRandomnessCoefficient *
        finalCoefficient,
      update: () => {
        currentCoefficientRef.current = roundToTwoDecimals(
          animationTarget.coefficient
        );
        containerRef.current!.innerHTML = `x${animationTarget.coefficient.toFixed(
          2
        )}`;
      },
      complete: () => {
        onAnimationEnd();
      },
    });
  }, []);
};

function Coefficient() {
  const [
    { maxCoefficient, animationRandomnessCoefficient },
    { handleRoundEnd },
    currentCoefficientRef,
  ] = useContext(GameContext);
  const containerRef = useRef<HTMLDivElement>(null);
  useCoefficientAnimation(
    containerRef,
    currentCoefficientRef,
    maxCoefficient,
    animationRandomnessCoefficient,
    handleRoundEnd
  );

  return (
    <div ref={containerRef} className={styles.coefficient}>
      x1.00
    </div>
  );
}

export default Coefficient;
