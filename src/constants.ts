import loadingScreenStyles from "./components/LoadingScreen/LoadingScreen.module.scss";
import { Language } from "./types";

export const WAITING_SCREEN_DURATION_SECONDS = parseInt(
  loadingScreenStyles.loadingDurationSeconds
);

/** Animation speed coefficient. Smaller number makes animation faster */
export const ANIMATION_DURATION_COEFFICIENT_MS = 1000;

export const MAX_HISTORY_ELEMENTS_ON_PAGE = 10;

export const LOCALIZATION: Record<Language, Record<string, string>> = {
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
  en: {
    "withdraw.popup.title": "You managed to pick up!",
    "withdraw.modal.link": "Get rewarded",
    "withdraw.modal.continue": "Continue playing",

    "request.popup.title":
      "You do not have enough funds in your account. Click the button to get 100 💎",

    "wait.title": "Waiting for the next round",

    "header.record": "Record",

    "cashout.link": "Get rewarded",

    "bet.withdraw": "WITHDRAW",
    "bet.cancel": "CANCEL",
    "bet.place": "BET",
    "history.title": "MY BET HISTORY",
  },
  pt: {
    "withdraw.popup.title": "Você conseguiu pegar!",
    "withdraw.modal.link": "Seja recompensado",
    "withdraw.modal.continue": "Continue jogando",
    "request.popup.title":
      "Você não tem fundos suficientes em sua conta. Clique no botão abaixo para obter 100 💎",
    "wait.title": "Aguardando a próxima rodada",

    "header.record": "Recorde",

    "cashout.link": "Seja recompensado",

    "bet.withdraw": "TIRAR",
    "bet.cancel": "ANULAR",
    "bet.place": "APOSTAS",
    "history.title": "MEU HISTÓRICO DE APOSTAS",
  },
  es: {
    "withdraw.popup.title": "¡Lograste recoger!",
    "withdraw.modal.link": "Ser recompensado",
    "withdraw.modal.continue": "Continuar jugando",

    "request.popup.title":
      "No tienes fondos suficientes en tu cuenta. Haga clic en el botón de abajo para obtener 100 💎",

    "wait.title": "Esperando la siguiente ronda",

    "header.record": "Registro",

    "cashout.link": "Ser recompensado",

    "bet.withdraw": "RETIRAR",
    "bet.cancel": "CANCELAR",
    "bet.place": "APUESTA",
    "history.title": "MI HISTORIAL DE APUESTA",
  },

  fr: {
    "withdraw.popup.title": "Vous avez réussi à décrocher!",
    "withdraw.modal.link": "Soyez récompensé",
    "withdraw.modal.continue": "Continue de jouer",

    "request.popup.title":
      "Vous n’avez pas assez de fonds sur votre compte. Cliquez sur le bouton ci-dessous pour obtenir 100 💎",

    "wait.title": "Attendre le prochain tour",

    "header.record": "Enregister",

    "cashout.link": "Soyez récompensé",

    "bet.withdraw": "RETIRER",
    "bet.cancel": "ANNULER",
    "bet.place": "PARI",
    "history.title": "MON HISTORIQUE DE PARI",
  },
};

export const GAME_CONTAINER_WIDTH = 500;
