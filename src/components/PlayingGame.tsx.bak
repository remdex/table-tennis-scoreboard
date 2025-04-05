import { onCleanup, onMount, type Setter } from "solid-js";
import { GameMode, type GameConfig, type MatchState } from "./common";
import PlayerScore from "./PlayerScore";

// TODO: option to hide ui
interface PlayingGameProps {
  mode: GameMode;
  setMode: Setter<GameMode>;
  config: GameConfig;
  matchState: MatchState;
  setMatchState: Setter<MatchState>;
}

export default function PlayingGame(props: PlayingGameProps) {
  const player1Scored = () =>
    props.setMatchState((state) => {
      const nextScore = state.player1.score + 1;
      // check for win
      if (
        nextScore >= props.config.winningScore &&
        nextScore > state.player2.score + 1
      ) {
        // update games
        let nextGames = state.player1.games + 1;
        // check for game over or match over
        if (nextGames > props.config.matchLength / 2) {
          props.setMode(GameMode.MatchOver);
        } else {
          props.setMode(GameMode.GameOver);
        }
        return {
          ...state,
          gameLog: [
            ...state.gameLog,
            {
              winner: state.player1,
              player1Score: nextScore,
              player2Score: state.player2.score,
            },
          ],
          player1: {
            ...state.player1,
            games: nextGames,
            score: nextScore,
          },
        };
      }
      return {
        ...state,
        player1: {
          ...state.player1,
          score: nextScore,
        },
      };
    });

  const player2Scored = () =>
    props.setMatchState((state) => {
      const nextScore = state.player2.score + 1;
      // check for win
      if (
        nextScore >= props.config.winningScore &&
        nextScore > state.player1.score + 1
      ) {
        // update games
        let nextGames = state.player2.games + 1;
        // check for game over or match over
        if (nextGames > props.config.matchLength / 2) {
          props.setMode(GameMode.MatchOver);
        } else {
          props.setMode(GameMode.GameOver);
        }
        return {
          ...state,
          gameLog: [
            ...state.gameLog,
            {
              winner: state.player2,
              player1Score: state.player1.score,
              player2Score: nextScore,
            },
          ],
          player2: {
            ...state.player2,
            games: nextGames,
            score: nextScore,
          },
        };
      }
      return {
        ...state,
        player2: {
          ...state.player2,
          score: nextScore,
        },
      };
    });

  const player1Correction = () => {
    props.setMatchState((state) => {
      let nextScore = state.player1.score - 1;
      if (nextScore < 0) {
        return state;
      }
      return {
        ...state,
        player1: {
          ...state.player1,
          score: nextScore,
        },
      };
    });
  };
  const player2Correction = () => {
    props.setMatchState((state) => {
      let nextScore = state.player2.score - 1;
      if (nextScore < 0) {
        return state;
      }
      return {
        ...state,
        player2: {
          ...state.player2,
          score: nextScore,
        },
      };
    });
  };
  const leftPlayer = () =>
    props.matchState.swapped
      ? {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
        }
      : {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
        };

  const rightPlayer = () =>
    props.matchState.swapped
      ? {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
        }
      : {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
        };

  const handleKeyUp = (ev: KeyboardEvent) => {
    console.log("keyboard event");
    if (props.mode === GameMode.Game) {
      ev.preventDefault();
      if (ev.key === props.config.player1Key) {
        player1Scored();
      } else if (ev.key === props.config.player2Key) {
        player2Scored();
      } else if (ev.key === props.config.scoreCorrectionKey) {
        props.setMode(GameMode.Correction);
      } else if (ev.key === props.config.player1CorrectionKey) {
        player1Correction();
      } else if (ev.key === props.config.player2CorrectionKey) {
        player2Correction();
      }
    } else if (props.mode === GameMode.Correction) {
      ev.preventDefault();
      if (
        ev.key === props.config.player1Key ||
        ev.key === props.config.player1CorrectionKey
      ) {
        player1Correction();
      } else if (
        ev.key === props.config.player2Key ||
        ev.key === props.config.player2CorrectionKey
      ) {
        player2Correction();
      } else if (ev.key === props.config.scoreCorrectionKey) {
        props.setMode(GameMode.Game);
      }
    }
  };
  onMount(() => {
    if (globalThis.addEventListener) {
      console.log("added event listener");
      globalThis.addEventListener("keyup", handleKeyUp);
    }
  });
  onCleanup(() => {
    if (globalThis.removeEventListener) {
      globalThis.removeEventListener("keyup", handleKeyUp);
    }
  });

  return (
    <main class="grid grid-cols-2">
      <PlayerScore
        mode={props.mode}
        showBorder={true}
        name={leftPlayer().name}
        reverse={false}
        score={leftPlayer().score}
        games={leftPlayer().games}
        onScore={leftPlayer().onScore}
        onCorrection={leftPlayer().onCorrection}
        testid="left"
      />
      <PlayerScore
        mode={props.mode}
        showBorder={false}
        name={rightPlayer().name}
        reverse={true}
        score={rightPlayer().score}
        games={rightPlayer().games}
        onScore={rightPlayer().onScore}
        onCorrection={rightPlayer().onCorrection}
        testid="right"
      />
    </main>
  );
}
