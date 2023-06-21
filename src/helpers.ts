import { LOCALIZATION } from "./constants";

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
  return LOCALIZATION[lang as "ru" | "en"][id] ?? id;
};
