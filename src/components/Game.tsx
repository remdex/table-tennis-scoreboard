import { createSignal, Switch, Match, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import {
  GameMode,
  type MatchState,
  type GameConfig,
  defaultGameConfig,
} from "./common";
import PlayingGame from "./PlayingGame";
import GameOver from "./GameOver";
import SwitchingSides from "./SwitchingSides";
import MatchOver from "./MatchOver";
import Setup from "./Setup";

// TODO: make option to download match data
// TODO: load initial config from localStorage
//

export default function Game() {
  const [mode, setMode] = createSignal<GameMode>(GameMode.Game);
  const [matchState, setMatchState] = createStore<MatchState>({
    player1: {
      name: "Player 1",
      score: 0,
      games: 0,
    },
    player2: {
      name: "Player 2",
      score: 0,
      games: 0,
    },
    // A game is an object with keys winner, player1score, and player2score
    gameLog: [],
    swapped: false,
  });
  const [config, setConfig] = createStore<GameConfig>({
    ...defaultGameConfig,
  });

  onMount(() => {
    if (globalThis.localStorage) {
      const loadedConfig = JSON.parse(localStorage.getItem("config") ?? "{}");
      if (loadedConfig instanceof Object) {
        setConfig({
          ...loadedConfig,
          ...defaultGameConfig,
        });
      }
      const player1Name = localStorage.getItem("player1Name");
      const player2Name = localStorage.getItem("player2Name");
      setMatchState((state) => ({
        ...state,
        player1: {
          ...state.player1,
          name: player1Name ?? state.player1.name,
        },
        player2: {
          ...state.player2,
          name: player2Name ?? state.player2.name,
        },
      }));
    }
  });

  const newGame = () => {
    setMatchState((state) => ({
      ...state,
      swapped: config.switchSides ? !state.swapped : state.swapped,
      player1: {
        ...state.player1,
        score: 0,
      },
      player2: {
        ...state.player2,
        score: 0,
      },
    }));
    if (config.switchSides) {
      setMode(GameMode.SwitchingSides);
      setTimeout(() => {
        setMode(GameMode.Game);
      }, 3000);
    } else {
      setMode(GameMode.Game);
    }
  };
  const newMatch = () => {
    setMode(GameMode.Game);
    setMatchState((state) => ({
      player1: {
        name: state.player1.name,
        score: 0,
        games: 0,
      },
      player2: {
        name: state.player2.name,
        score: 0,
        games: 0,
      },
      gameLog: [],
      swapped: false,
    }));
  };

  return (
    <div
      classList={{
        "min-h-screen h-auto": true,
        "bg-blue-700": mode() === GameMode.Game,
        "bg-red-700": mode() === GameMode.Correction,
        "bg-green-700":
          mode() === GameMode.GameOver ||
          mode() === GameMode.MatchOver ||
          mode() === GameMode.SwitchingSides,
        "bg-yellow-500": mode() === GameMode.Setup,
      }}
      id="main-content"
    >
      <div class="px-4 mx-auto max-w-4xl min-h-screen text-white xl:max-w-7xl">
        <Switch fallback={<div>Not Implemented</div>}>
          <Match
            when={mode() === GameMode.Game || mode() === GameMode.Correction}
          >
            <PlayingGame
              mode={mode()}
              setMode={setMode}
              setMatchState={setMatchState}
              config={config}
              matchState={matchState}
            />
          </Match>
          <Match when={mode() === GameMode.GameOver}>
            <GameOver matchState={matchState} newGame={newGame} />
          </Match>
          <Match when={mode() === GameMode.SwitchingSides}>
            <SwitchingSides setMode={setMode} />
          </Match>
          <Match when={mode() === GameMode.MatchOver}>
            <MatchOver newMatch={newMatch} matchState={matchState} />
          </Match>
          <Match when={mode() === GameMode.Setup}>
            <Setup
              config={config}
              setConfig={setConfig}
              setMode={setMode}
              matchState={matchState}
              setMatchState={setMatchState}
            />
          </Match>
        </Switch>
      </div>

      <div id="correction" class="fixed bottom-0 left-0 mb-4 ml-4">
        <Switch fallback={<div></div>}>
          <Match when={mode() === GameMode.Game}>
            <button
              class="py-2 px-4 font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t-1 border-l-1 selectable"
              data-testid="correction-button"
              title="Correct a scoring mistake"
              onClick={() => setMode(GameMode.Correction)}
            >
              Correction
            </button>
          </Match>
          <Match when={mode() === GameMode.Correction}>
            <button
              class="py-2 px-4 font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t-1 border-l-1 selectable"
              onClick={() => setMode(GameMode.Game)}
              title="Correct a scoring mistake"
              data-testid="end-correction-button"
            >
              Correction Complete
            </button>
          </Match>
        </Switch>
      </div>
      {mode() !== GameMode.Setup && (
        <>
          <div
            id="help"
            class="fixed bottom-0 right-1/2 mb-4 transform translate-x-1/2"
          >
            <a
              class="block py-2 px-4 font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t-1 border-l-1 selectable"
              href="/help"
              target="_blank"
              data-testid="help-button"
            >
              Help
            </a>
          </div>
          <div id="config" class="fixed right-0 bottom-0 mr-4 mb-4">
            <button
              class="py-2 px-4 font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t-1 border-l-1 selectable"
              onClick={() => setMode(GameMode.Setup)}
              title="Configure Match Settings"
              data-testid="setup-button"
            >
              Setup
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// swap sides button in menu
//<button
//  class="py-2 px-4 font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t-1 border-l-1 selectable"
//  onClick={() =>
//    setMatchState((state) => ({ ...state, swapped: !state.swapped }))
//  }
//  title="Correct a scoring mistake"
//  data-testid="end-correction-button"
//>
//  swap
//</button>
