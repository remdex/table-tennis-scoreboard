import { type Setter } from "solid-js";
import { GameMode } from "./common";
import ThankYou from "./ThankYou";

interface SwitchingSidesProps {
  setMode: Setter<GameMode>;
}
export default function SwitchingSides(props: SwitchingSidesProps) {
  return (
    <div
      class="max-w-5xl mx-auto px-4 mb-96 text-white"
      data-testid="switch-sides-screen"
    >
      <header class="w-full flex justify-center text-center pt-20">
        <h1
          class="text-7xl font-normal font-sports tracking-wider"
          data-testid="winner-text"
        >
          Switch Ends
        </h1>
      </header>
      <div class="flex justify-center w-full text-center mt-6">
        <h4 class="text-2xl font-normal font-sports px-4 pb-2 tracking-wider">
          It’s time to switch ends
        </h4>
      </div>
      <section class="mt-15 flex w-full justify-center">
        <h6 class="font-mono font-bold uppercase text-2xl text-center">
          Press any key to start the next game...
        </h6>
      </section>
      <section class="mx-auto mt-2 px-8 flex justify-center">
        <button
          class="font-mono text-2xl uppercase bg-white text-black border-t-0 border-l-0 border-b-4 border-r-4 border-black px-8 py-2 font-bold active:border-b-0 active:border-r-0 active:border-t-4 active:border-l-4 selectable"
          onClick={() => props.setMode(GameMode.Game)}
          data-testid="start-game-button"
        >
          Start Game
        </button>
      </section>
      <div class="mt-8 text-white container max-w-2xl mx-auto">
        <ThankYou />
      </div>
    </div>
  );
}
