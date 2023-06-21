import { GameStage, State } from "./types";

const initialState: State = {
  stage: GameStage.WAIT,
  isBetConfirmed: false,
  isBetWithdrawn: false,
  isRoundFinished: false,
  isWithdrawModalVisible: false,
  isRequestFundsPopupVisible: false,
  betAmount: "10",
  maxCoefficient: 0,
  withdrawCoefficient: 0,
  animationRandomnessCoefficient: 1,

  moneyAmount: 0,
  history: [],
  coefficientList: [],
  casinoLink: ''
};

export default initialState;
