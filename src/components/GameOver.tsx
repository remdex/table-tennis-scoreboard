import { onCleanup, onMount, createSignal, Show } from "solid-js";
import type { MatchState, GameConfig } from "./common";
import ThankYou from "./ThankYou";

interface GameOverProps {
  matchState: MatchState;
  config: GameConfig;
  newGame: Function;
}
export default function GameOver(props: GameOverProps) {
  const [countdown, setCountdown] = createSignal(5);
  let autoRestartTimer: ReturnType<typeof setTimeout> | undefined;
  let countdownInterval: ReturnType<typeof setInterval> | undefined;

  const winnerName = () =>
    props.matchState.player1.score > props.matchState.player2.score
      ? props.matchState.player1.name
      : props.matchState.player2.name;

  const startNewGame = () => {
    // Clear timers if they exist
    if (autoRestartTimer) clearTimeout(autoRestartTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    props.newGame();
  };

  const handleKeyUp = (ev: KeyboardEvent) => {
    ev.preventDefault();
    startNewGame();
  };

  onMount(() => {
    document.addEventListener("keyup", handleKeyUp);
    
    // Only start auto-restart timer if enabled in config
    if (props.config.autoRestart) {
      autoRestartTimer = setTimeout(() => {
        startNewGame();
      }, 5000);
      
      // Start countdown display
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(countdownInterval);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
  });
  
  onCleanup(() => {
    document.removeEventListener("keyup", handleKeyUp);
    if (autoRestartTimer) clearTimeout(autoRestartTimer);
    if (countdownInterval) clearInterval(countdownInterval);
  });

  return (
    <div
      class="max-w-5xl mx-auto px-4 mb-96 text-white"
      data-testid="game-end-screen"
    >
      <header class="w-full flex justify-center text-center pt-20">
        <h1
          class="text-7xl font-normal font-sports tracking-wider"
          data-testid="winner-text"
        >
          {winnerName()} Wins!
        </h1>
      </header>
      <div class="flex justify-center w-full text-center mt-6">
        <h4 class="text-4xl font-normal font-sports px-4 border-b-4 border-black pb-2 tracking-wider">
          Final Score
        </h4>
      </div>
      <section class="flex px-4 max-w-2xl -mt-12 mx-auto justify-center space-x-8 font-bold">
        <div class="text-[22rem] font-seven" data-testid="player1-score">
          {props.matchState.player1.score}
        </div>
        <div class="text-[22rem] font-seven">-</div>
        <div class="text-[22rem] font-seven" data-testid="player2-score">
          {props.matchState.player2.score}
        </div>
      </section>
      <Show when={props.config.autoRestart}>
        <section class="mt-2 flex w-full justify-center">
          <h6 class="font-mono font-bold uppercase text-2xl text-center">
            Auto-restart in {countdown()} seconds...
            <br />
            <span class="text-lg">Press any key to start now</span>
          </h6>
        </section>
      </Show>
      <Show when={!props.config.autoRestart}>
        <section class="mt-2 flex w-full justify-center">
          <h6 class="font-mono font-bold uppercase text-2xl text-center">
            Press any key or click the button below to start a new game
          </h6>
        </section>
      </Show>
      <section class="mx-auto mt-2 px-8 flex justify-center">
        <button
          class="font-mono text-2xl uppercase bg-white text-black border-t-0 border-l-0 border-b-4 border-r-4 border-black px-8 py-2 font-bold active:border-b-0 active:border-r-0 active:border-t-4 active:border-l-4 selectable"
          onClick={startNewGame}
          data-testid="new-game-button"
        >
          New Game
        </button>
      </section>
      <div class="mt-8 text-white container max-w-2xl mx-auto">
        <ThankYou />
      </div>
    </div>
  );
}
