import { Route, Router } from "wouter";

import { BetHistory, GamePage } from "./components";

import { GameContext, useGameLogic } from "./state";
import styles from "./App.module.scss";

/**
 * TODO:
 * 1. find out what telegram-web-app does (maybe it's something given by telegram)
 * 2. create complete layout.
 * 3. start working on the game:
 *  - game requires state. I want to make state understandable.
 *  - game has different stages.
 *  - some buttons (cash out for example have animations, find out what they are)
 *  - refactor a bit, maybe. i hate margins for everything. but not really needed
 * 4. need languages
 */

function App() {
  const [state, handlers, currentCoefficientRef] = useGameLogic();

  return (
    <main className={styles.App}>
      <GameContext.Provider value={[state, handlers, currentCoefficientRef]}>
        <Router>
          <Route path="/bids" component={BetHistory} />
          <Route path="/" component={GamePage} />
        </Router>
      </GameContext.Provider>
    </main>
  );
}

export default App;
