import {
  createSignal,
  onCleanup,
  onMount,
  createEffect,
  type Accessor,
  type Setter,
} from "solid-js";
import { GameMode, type GameConfig, type MatchState } from "./common";
import PlayerScore from "./PlayerScore";
import { BacklogService } from "./BacklogService";

// TODO: option to hide ui
interface PlayingGameProps {
  mode: GameMode;
  setMode: Setter<GameMode>;
  config: GameConfig;
  matchState: MatchState;
  setMatchState: Setter<MatchState>;
  newGame: () => void;
}

interface SidePlayer {
  name: string;
  score: number;
  games: number;
  onScore: Function;
  onCorrection: Function;
  redNumber: Accessor<boolean>;
}

export default function PlayingGame(props: PlayingGameProps) {
  const [showAdvancedConfig, setShowAdvancedConfig] = createSignal(false);
  const [player1RedNumber, setPlayer1RedNumber] = createSignal(false);
  const [player2RedNumber, setPlayer2RedNumber] = createSignal(false);
  
  // Backlog service setup
  let backlogService: BacklogService | null = null;

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
  const leftPlayer = (): SidePlayer =>
    props.matchState.swapped
      ? {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
          redNumber: player2RedNumber,
        }
      : {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
          redNumber: player1RedNumber,
        };

  const rightPlayer = (): SidePlayer =>
    props.matchState.swapped
      ? {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
          redNumber: player1RedNumber,
        }
      : {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
          redNumber: player2RedNumber,
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
        setPlayer1RedNumber(true);
        player1Correction();
        setTimeout(() => setPlayer1RedNumber(false), 300);
      } else if (ev.key === props.config.player2CorrectionKey) {
        setPlayer2RedNumber(true);
        player2Correction();
        setTimeout(() => setPlayer2RedNumber(false), 300);
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
    
    // Initialize backlog service if URL is configured
    if (props.config.backlogUrl) {
      backlogService = new BacklogService(
        props.config.backlogUrl,
        props.setMatchState,
        props.setMode,
        player1Scored,
        player2Scored,
        player1Correction,
        player2Correction,
        props.newGame
      );
      backlogService.start();
      console.log("Started backlog service for:", props.config.backlogUrl);
    }
  });
  
  // Effect to handle backlog URL changes
  createEffect(() => {
    const url = props.config.backlogUrl;
    
    if (url && backlogService) {
      // Update existing service
      backlogService.updateUrl(url);
    } else if (url && !backlogService) {
      // Create new service
      backlogService = new BacklogService(
        url,
        props.setMatchState,
        props.setMode,
        player1Scored,
        player2Scored,
        player1Correction,
        player2Correction,
        props.newGame
      );
      backlogService.start();
      console.log("Started backlog service for:", url);
    } else if (!url && backlogService) {
      // Stop service if URL is removed
      backlogService.stop();
      backlogService = null;
      console.log("Stopped backlog service");
    }
  });
  
  onCleanup(() => {
    if (globalThis.removeEventListener) {
      globalThis.removeEventListener("keyup", handleKeyUp);
    }
    
    // Stop backlog service
    if (backlogService) {
      backlogService.stop();
      backlogService = null;
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
        redNumber={leftPlayer().redNumber()}
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
        redNumber={rightPlayer().redNumber()}
        testid="right"
      />
    </main>
  );
}
