import { LOCALIZATION } from "./constants";

export const roundToTwoDecimals = (x: number) => Math.round(x * 100) / 100;
export const localization = (id: string) => {
  const { lang } = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );

  return LOCALIZATION[lang as "ru" | "en"][id] ?? id;
};
