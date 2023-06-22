import anime, { AnimeInstance } from "animejs";
import { LOCALIZATION } from "./constants";
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
  return LOCALIZATION[lang as Language]?.[id] ?? id;
};

/** @TODO: hack to ACTUALLY stop animation,
 * because anime.js is deprecated single man project */
export const cancelAnimation = (animation: AnimeInstance) => {
  const activeInstances = anime.running;
  const index = activeInstances.indexOf(animation);
  activeInstances.splice(index, 1);
};
