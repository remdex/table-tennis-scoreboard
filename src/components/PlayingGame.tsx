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
import { soundService } from "./SoundService";

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
  isServing: boolean;
  onChooseInitialServer?: Function;
  isChosenAsInitialServer: boolean;
}

export default function PlayingGame(props: PlayingGameProps) {
  const [showAdvancedConfig, setShowAdvancedConfig] = createSignal(false);
  const [player1RedNumber, setPlayer1RedNumber] = createSignal(false);
  const [player2RedNumber, setPlayer2RedNumber] = createSignal(false);
  
  // Backlog service setup
  let backlogService: BacklogService | null = null;

  // Calculate who should serve based on total points scored and games played
  // In table tennis, players alternate serving every 2 points within a game
  // AND the first server alternates between games
  const calculateCurrentServer = (): 'player1' | 'player2' => {
    const p1 = props.matchState.player1.score;
    const p2 = props.matchState.player2.score;
    const totalPoints = p1 + p2;
    const totalGames = props.matchState.player1.games + props.matchState.player2.games;
    const winningScore = props.config.winningScore;
    const initialServer = props.matchState.initialServer || 'player1';
    let gameStartServer: 'player1' | 'player2';
    if (totalGames % 2 === 0) {
      gameStartServer = initialServer;
    } else {
      gameStartServer = initialServer === 'player1' ? 'player2' : 'player1';
    }

    // If either player has reached (winningScore - 1), alternate every point
    if (p1 >= winningScore - 1 && p2 >= winningScore - 1) {
      // Deuce: alternate every point
      if (totalPoints % 2 === 0) {
        return gameStartServer;
      } else {
        return gameStartServer === 'player1' ? 'player2' : 'player1';
      }
    } else {
      // Normal: alternate every 2 points
      const servePairs = Math.floor(totalPoints / 2);
      if (servePairs % 2 === 0) {
        return gameStartServer;
      } else {
        return gameStartServer === 'player1' ? 'player2' : 'player1';
      }
    }
  };

  // Check if match has not started (no scores and no games played)
  const matchHasNotStarted = () => {
    return props.matchState.player1.score === 0 && 
           props.matchState.player2.score === 0 && 
           props.matchState.player1.games === 0 && 
           props.matchState.player2.games === 0;
  };

  // Handle choosing initial server
  const choosePlayer1AsInitialServer = () => {
    props.setMatchState((state) => ({
      ...state,
      initialServer: 'player1'
    }));
    // Save to localStorage for future matches
    if (globalThis.localStorage) {
      localStorage.setItem("initialServer", "player1");
    }
  };

  const choosePlayer2AsInitialServer = () => {
    props.setMatchState((state) => ({
      ...state,
      initialServer: 'player2'
    }));
    // Save to localStorage for future matches
    if (globalThis.localStorage) {
      localStorage.setItem("initialServer", "player2");
    }
  };

  const player1Scored = () => {
    props.setMatchState((state) => {
      const nextScore = state.player1.score + 1;
      
      // Play score sound with updated scores
      soundService.playScoreSound(nextScore, state.player2.score);
      
      // If this is the first score and no initial server is set, default to player1
      const needsInitialServer = !state.initialServer && 
        state.player1.score === 0 && state.player2.score === 0 && 
        state.player1.games === 0 && state.player2.games === 0;
      
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
        // Play win sound for game victory
        setTimeout(() => soundService.playWinSound('player1'), 100);
        return {
          ...state,
          initialServer: needsInitialServer ? 'player1' : state.initialServer,
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
        initialServer: needsInitialServer ? 'player1' : state.initialServer,
        player1: {
          ...state.player1,
          score: nextScore,
        },
      };
    });
  };

  const player2Scored = () => {
    props.setMatchState((state) => {
      const nextScore = state.player2.score + 1;
      
      // Play score sound with updated scores
      soundService.playScoreSound(state.player1.score, nextScore);
      
      // If this is the first score and no initial server is set, default to player1
      const needsInitialServer = !state.initialServer && 
        state.player1.score === 0 && state.player2.score === 0 && 
        state.player1.games === 0 && state.player2.games === 0;
      
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
        // Play win sound for game victory
        setTimeout(() => soundService.playWinSound('player2'), 100);
        return {
          ...state,
          initialServer: needsInitialServer ? 'player1' : state.initialServer,
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
        initialServer: needsInitialServer ? 'player1' : state.initialServer,
        player2: {
          ...state.player2,
          score: nextScore,
        },
      };
    });
  };

  const player1Correction = () => {
    soundService.playCorrectionSound();
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
    soundService.playCorrectionSound();
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
  const leftPlayer = (): SidePlayer => {
    const currentServer = calculateCurrentServer();
    return props.matchState.swapped
      ? {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
          redNumber: player2RedNumber,
          isServing: currentServer === 'player2',
          onChooseInitialServer: choosePlayer2AsInitialServer,
          isChosenAsInitialServer: props.matchState.initialServer === 'player2',
        }
      : {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
          redNumber: player1RedNumber,
          isServing: currentServer === 'player1',
          onChooseInitialServer: choosePlayer1AsInitialServer,
          isChosenAsInitialServer: props.matchState.initialServer === 'player1',
        };
  };

  const rightPlayer = (): SidePlayer => {
    const currentServer = calculateCurrentServer();
    return props.matchState.swapped
      ? {
          ...props.matchState.player1,
          onScore: player1Scored,
          onCorrection: player1Correction,
          redNumber: player1RedNumber,
          isServing: currentServer === 'player1',
          onChooseInitialServer: choosePlayer1AsInitialServer,
          isChosenAsInitialServer: props.matchState.initialServer === 'player1',
        }
      : {
          ...props.matchState.player2,
          onScore: player2Scored,
          onCorrection: player2Correction,
          redNumber: player2RedNumber,
          isServing: currentServer === 'player2',
          onChooseInitialServer: choosePlayer2AsInitialServer,
          isChosenAsInitialServer: props.matchState.initialServer === 'player2',
        };
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
        isServing={leftPlayer().isServing}
        matchHasNotStarted={matchHasNotStarted()}
        onChooseInitialServer={leftPlayer().onChooseInitialServer}
        isChosenAsInitialServer={leftPlayer().isChosenAsInitialServer}
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
        isServing={rightPlayer().isServing}
        matchHasNotStarted={matchHasNotStarted()}
        onChooseInitialServer={rightPlayer().onChooseInitialServer}
        isChosenAsInitialServer={rightPlayer().isChosenAsInitialServer}
        testid="right"
      />
    </main>
  );
}
