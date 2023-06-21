import loadingScreenStyles from "./components/LoadingScreen/LoadingScreen.module.scss";

export const WAITING_SCREEN_DURATION_SECONDS = parseInt(
  loadingScreenStyles.loadingDurationSeconds
);

/** Animation speed coefficient. Smaller number makes animation faster */
export const ANIMATION_DURATION_COEFFICIENT_MS = 3000;

export const MAX_HISTORY_ELEMENTS_ON_PAGE = 10;

export const LOCALIZATION: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    "withdraw.popup.title": "Вы успели вывести!",
    "withdraw.modal.link": "Забрать выигрыш",
    "withdraw.modal.continue": "Продолжить играть",

    "request.popup.title":
      "У вас недостаточно средств на счете. Нажми на кнопку, чтобы получить 100 💎",

    "wait.title": "Ожидание следующего раунда",

    "header.record": "Рекорд",

    "cashout.link": "Забрать выигрыш",

    "bet.withdraw": "ВЫВЕСТИ",
    "bet.cancel": "ОТМЕНА",
    "bet.place": "СТАВКА",
    "history.title": "МОЯ ИСТОРИЯ СТАВОК",
  },
  en: {},
};

export const GAME_CONTAINER_WIDTH = 500
