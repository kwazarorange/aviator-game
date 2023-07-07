import anime from "animejs";
import {
  MutableRefObject,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import styles from "./Coefficient.module.scss";
import { GameContext } from "../../state";
import {
  cancelAnimation,
  calculateDuration,
  roundToTwoDecimals,
} from "../../helpers";

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
    const duration = calculateDuration(
      finalCoefficient,
      animationRandomnessCoefficient
    );

    animationRef.current = anime({
      targets: animationTarget,
      coefficient: finalCoefficient,
      easing: "linear",
      round: 100,
      duration,
      update: () => {
        currentCoefficientRef.current = roundToTwoDecimals(
          animationTarget.coefficient
        );
        if (containerRef.current) {
          containerRef.current.innerHTML = `x${animationTarget.coefficient.toFixed(
            2
          )}`;
        }
      },
      complete: () => {
        onAnimationEnd();
      },
    });

    return () => {
      cancelAnimation(animationRef.current as anime.AnimeInstance);
    };
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
