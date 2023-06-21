import { createContext } from "react";

import useGameLogic from "./hooks";

const GameContext = createContext({} as ReturnType<typeof useGameLogic>);

export default GameContext;
