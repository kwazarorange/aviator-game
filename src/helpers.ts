import anime, { AnimeInstance } from "animejs";
import { ANIMATION_DURATION_COEFFICIENT_MS, LOCALIZATION } from "./constants";
import { Language } from "./types";
export const roundToTwoDecimals = (x: number) => Math.round(x * 100) / 100;

export const useSearchParams = () => {
  const { user_id = "", lang = "ru" } = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );

  return {
    user_id,
    lang,
  };
};

export const localization = (id: string) => {
  const { lang } = useSearchParams();
  return (
    LOCALIZATION[lang as Language]?.[id] ??
    LOCALIZATION["ru" as Language][id] ??
    id
  );
};

/** @TODO: hack to ACTUALLY stop animation,
 * because anime.js is deprecated single man project */
export const cancelAnimation = (animation: AnimeInstance) => {
  const activeInstances = anime.running;
  const index = activeInstances.indexOf(animation);
  activeInstances.splice(index, 1);
};

const COEFFICIENT_CAP = 350;
/** probability of coefficient = 1, arbitrary value, 60 to 100 */
const CHANCE_OF_MINIMAL_COEF = 100;
/** Decide on graph */
const STARTING_RATE_OF_DECAY = 100;
/** Decide on graph */
const MINIMAL_RATE_OF_DECAY = 2;

const HIDDEN_COEFFICIENT = 0.3; //@TODO: TBD
/**
 * Returns winning coefficient
 * @param n number of rounds
 */
export const getWinCoefficient = (n: number) => {
  const probability = Math.random() * 100;

  const rateOfDecay = Math.max(
    MINIMAL_RATE_OF_DECAY,
    STARTING_RATE_OF_DECAY - HIDDEN_COEFFICIENT * n
  );

  return (
    1 +
    (COEFFICIENT_CAP - 1) *
      (1 - Math.pow(probability / CHANCE_OF_MINIMAL_COEF, 1 / rateOfDecay))
  );
};

export function calculateDuration(x: number, randomnessCoefficient: number) {
  return (
    (2.9 * x + 1) * ANIMATION_DURATION_COEFFICIENT_MS * randomnessCoefficient
  );
}
