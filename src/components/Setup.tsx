import { createSignal, type Setter } from "solid-js";
import { GameMode, type GameConfig, type MatchState } from "./common";
import ThankYou from "./ThankYou";

interface SetupProps {
  config: GameConfig;
  setConfig: Setter<GameConfig>;
  setMode: Setter<GameMode>;
  matchState: MatchState;
  setMatchState: Setter<MatchState>;
}

enum Listening {
  None = 0,
  Player1Key = 1,
  Player2Key = 2,
  ScoreCorrectionKey = 3,
  Player1CorrectionKey = 4,
  Player2CorrectionKey = 5,
}

export default function Setup(props: SetupProps) {
  let formRef!: HTMLFormElement;

  const [listeningFor, setListeningFor] = createSignal<Listening>(
    Listening.None,
  );
  const [player1Key, setPlayer1Key] = createSignal(props.config.player1Key);
  const [player2Key, setPlayer2Key] = createSignal(props.config.player2Key);
  const [player1CorrectionKey, setPlayer1CorrectionKey] = createSignal(
    props.config.player1CorrectionKey,
  );
  const [player2CorrectionKey, setPlayer2CorrectionKey] = createSignal(
    props.config.player2CorrectionKey,
  );
  const [scoreCorrectionKey, setScoreCorrectionKey] = createSignal(
    props.config.scoreCorrectionKey,
  );

  const recordPlayer1Key = (ev: KeyboardEvent) => {
    ev.preventDefault();
    if (ev.key !== "Escape") {
      setPlayer1Key(ev.key);
    }
    document.removeEventListener("keyup", recordPlayer1Key);
    setListeningFor(Listening.None);
  };

  const listenForPlayer1Key = () => {
    document.addEventListener("keyup", recordPlayer1Key);
    setListeningFor(Listening.Player1Key);
  };

  const recordPlayer2Key = (ev: KeyboardEvent) => {
    ev.preventDefault();
    if (ev.key !== "Escape") {
      setPlayer2Key(ev.key);
    }
    document.removeEventListener("keyup", recordPlayer2Key);
    setListeningFor(Listening.None);
  };

  const listenForPlayer2Key = () => {
    document.addEventListener("keyup", recordPlayer2Key);
    setListeningFor(Listening.Player2Key);
  };

  const recordScoreCorrectionKey = (ev: KeyboardEvent) => {
    ev.preventDefault();
    if (ev.key !== "Escape") {
      setScoreCorrectionKey(ev.key);
    }
    document.removeEventListener("keyup", recordScoreCorrectionKey);
    setListeningFor(Listening.None);
  };

  const listenForScoreCorrectionKey = () => {
    document.addEventListener("keyup", recordScoreCorrectionKey);
    setListeningFor(Listening.ScoreCorrectionKey);
  };

  const recordPlayer1CorrectionKey = (ev: KeyboardEvent) => {
    ev.preventDefault();
    if (ev.key !== "Escape") {
      setPlayer1CorrectionKey(ev.key);
    }
    document.removeEventListener("keyup", recordPlayer1CorrectionKey);
    setListeningFor(Listening.None);
  };

  const listenForPlayer1CorrectionKey = () => {
    document.addEventListener("keyup", recordPlayer1CorrectionKey);
    setListeningFor(Listening.Player1CorrectionKey);
  };

  const recordPlayer2CorrectionKey = (ev: KeyboardEvent) => {
    ev.preventDefault();
    if (ev.key !== "Escape") {
      setPlayer2CorrectionKey(ev.key);
    }
    document.removeEventListener("keyup", recordPlayer2CorrectionKey);
    setListeningFor(Listening.None);
  };

  const listenForPlayer2CorrectionKey = () => {
    document.addEventListener("keyup", recordPlayer2CorrectionKey);
    setListeningFor(Listening.Player2CorrectionKey);
  };

  const saveConfig = (ev: SubmitEvent) => {
    ev.preventDefault();
    const data = new FormData(formRef);

    let matchLength = parseInt(data.get("matchLength") as string, 10);
    if (isNaN(matchLength)) {
      matchLength = props.config.matchLength;
    } else if (matchLength % 2 == 0) {
      matchLength += 1;
    }

    let winningScore = parseInt(data.get("winningScore") as string, 10);
    if (isNaN(winningScore)) {
      winningScore = props.config.winningScore;
    }

    const player1Name =
      data.get("player1Name") ?? props.matchState.player1.name;
    const player2Name =
      data.get("player2Name") ?? props.matchState.player2.name;

    const switchSides = data.get("switchSides") === "on" || false;
    const autoRestart = data.get("autoRestart") === "on" || false;
    const backlogUrl = data.get("backlogUrl") as string || undefined;
    const nextConfig = {
      matchLength,
      winningScore,
      switchSides,
      autoRestart,
      backlogUrl,
      scoreCorrectionKey: scoreCorrectionKey(),
      player1Key: player1Key(),
      player2Key: player2Key(),
      player1CorrectionKey: player1CorrectionKey(),
      player2CorrectionKey: player2CorrectionKey(),
    };

    props.setConfig(nextConfig);

    props.setMatchState((state) => ({
      ...state,
      player1: {
        ...state.player1,
        name: player1Name as string,
      },
      player2: {
        ...state.player2,
        name: player2Name as string,
      },
    }));
    localStorage.setItem("config", JSON.stringify(nextConfig));
    localStorage.setItem("player1Name", player1Name as string);
    localStorage.setItem("player2Name", player2Name as string);

    props.setMode(GameMode.Game);
  };

  // TODO: make signals for keys, wrap everything in form, make form onsubmit save config
  return (
    <form
      action="#"
      onSubmit={saveConfig}
      id="main-content"
      class="mx-auto pt-14 max-w-4xl min-h-screen text-black pb-20"
      ref={formRef}
    >
      <header class="flex justify-center w-full text-center">
        <h1 class="text-4xl font-normal font-sports">Setup Your Match</h1>
      </header>
      <div class="grid grid-cols-1 mt-8 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label
            for="player1Name"
            class="font-normal tracking-wider text-black font-sports"
          >
            Player 1 Name
          </label>
          <div class="border-2 border-transparent focus-within:border-black">
            <input
              type="text"
              name="player1Name"
              value={props.matchState.player1.name}
              data-testid="player1-name-input"
              id="player1Name"
              class="py-2 px-4 w-full font-mono uppercase bg-white border-2 border-black focus:outline-none"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label
            for="player2Name"
            class="font-normal tracking-wider text-black font-sports"
          >
            Player 2 Name
          </label>
          <div class="border-2 border-transparent focus-within:border-black">
            <input
              type="text"
              value={props.matchState.player2.name}
              data-testid="player2-name-input"
              id="player2Name"
              name="player2Name"
              class="py-2 px-4 w-full font-mono uppercase bg-white border-2 border-black focus:outline-none"
            />
          </div>
        </div>
      </div>
      <section class="mt-4">
        <h4 class="mb-2 text-2xl font-normal tracking-wider font-sports">
          Scoring Keys
        </h4>
        <div class="flex flex-col my-4 gap-y-2 gap-x-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <RecordKeyInput
            label="Player 1 Scored"
            listening={listeningFor() === Listening.Player1Key}
            onRecordKey={listenForPlayer1Key}
            keyName={player1Key()}
            testid="player1-keybind-button"
          />
          <RecordKeyInput
            label="Player 2 Scored"
            listening={listeningFor() === Listening.Player2Key}
            onRecordKey={listenForPlayer2Key}
            keyName={player2Key()}
            testid="player2-keybind-button"
          />
          <RecordKeyInput
            label="Correction Mode"
            listening={listeningFor() === Listening.ScoreCorrectionKey}
            onRecordKey={listenForScoreCorrectionKey}
            keyName={scoreCorrectionKey()}
            testid="correction-keybind-button"
          />
        </div>
        <details>
          <summary class="font-bold font-mono cursor-pointer">
            More info
          </summary>
          <p class="font-mono">
            You can use this app with some sort of remote control (bluetooth
            presentation remote works well). Click record below each input to
            set up different keys.
          </p>
        </details>
      </section>
      <section class="grid sm:grid-cols-2 mt-4 gap-4">
        <div class="flex-col flex gap-2">
          <label
            for="winningScore"
            class="text-2xl font-normal tracking-wider font-sports"
          >
            Winning Score
          </label>
          <NumberInputWithButtons
            id="winningScore"
            name="winningScore"
            default={props.config.winningScore}
            min={2}
            step={1}
            increaseText="+"
            decreaseText="-"
            suffixText="points"
            testid="winning-score-input"
          />

          <details class="mt-2">
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              Minimum winning score for the game (can go higher depending on
              deuce rule). Default is 11.
            </p>
          </details>
        </div>
        <div class="flex flex-col gap-2">
          <label
            for="matchLength"
            class="text-2xl font-normal tracking-wider font-sports"
          >
            Match Length
          </label>
          <NumberInputWithButtons
            id="matchLength"
            name="matchLength"
            default={props.config.matchLength}
            min={1}
            step={2}
            increaseText="+"
            decreaseText="-"
            suffixText="games per match"
            testid="match-length-input"
          />

          <details class="mt-2">
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              Number of games in a match, which is usually five or seven. This
              number must be odd so there are no ties.
            </p>
          </details>
        </div>
        <div class="flex flex-col">
          <h3 class="mb-2 text-2xl font-normal tracking-wider font-sports">
            Switch Sides
          </h3>
          <div class="flex items-center mt-4">
            <label
              for="switchSides"
              class="flex gap-4 items-center text-xl font-normal tracking-wider font-spots"
            >
              <span>Switch Sides?</span>
              <input
                type="checkbox"
                id="switchSides"
                name="switchSides"
                class="mr-2 w-5 h-5 text-black border-2 border-black"
                data-testid="switch-sides-input"
                checked={props.config.switchSides}
              />
            </label>
          </div>
          <details class="mt-2">
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              It is traditional to switch sides between games in a match. The
              scoreboard can swap sides to match if you want.
            </p>
          </details>
        </div>
        <div class="flex flex-col">
          <h3 class="mb-2 text-2xl font-normal tracking-wider font-sports">
            Auto Restart
          </h3>
          <div class="flex items-center mt-4">
            <label
              for="autoRestart"
              class="flex gap-4 items-center text-xl font-normal tracking-wider font-spots"
            >
              <span>Auto Restart Games/Matches?</span>
              <input
                type="checkbox"
                id="autoRestart"
                name="autoRestart"
                class="mr-2 w-5 h-5 text-black border-2 border-black"
                data-testid="auto-restart-input"
                checked={props.config.autoRestart}
              />
            </label>
          </div>
          <details class="mt-2">
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              When enabled, games and matches will automatically restart after 5 seconds.
              Disable this if you want to manually control when to start the next game or match.
            </p>
          </details>
        </div>
        <div class="flex-col" data-testid="advanced-config">
          <h4 class="mb-2 text-2xl font-normal tracking-wider font-sports">
            Instant Correction Keys
          </h4>
          <div class="flex flex-col my-4 gap-y-2 gap-x-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <RecordKeyInput
              label="Player 1 Correction"
              listening={listeningFor() === Listening.Player1CorrectionKey}
              onRecordKey={listenForPlayer1CorrectionKey}
              keyName={player1CorrectionKey()}
              testid="player1-correction-keybind-button"
            />
            <RecordKeyInput
              label="Player 2 Correction"
              listening={listeningFor() === Listening.Player2CorrectionKey}
              onRecordKey={listenForPlayer2CorrectionKey}
              keyName={player2CorrectionKey()}
              testid="player2-correction-keybind-button"
            />
          </div>
          <details>
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              If you have more keys available, you might want to bind keys to
              make corrections instantly with a single keybind instead of having
              to go to correction mode.
            </p>
          </details>
        </div>
        <div class="flex flex-col" data-testid="backlog-config">
          <h4 class="mb-2 text-2xl font-normal tracking-wider font-sports">
            Game Flow Backlog
          </h4>
          <div class="flex flex-col gap-2">
            <label
              for="backlogUrl"
              class="font-normal tracking-wider text-black font-sports"
            >
              Backlog URL
            </label>
            <div class="border-2 border-transparent focus-within:border-black">
              <input
                type="url"
                name="backlogUrl"
                value={props.config.backlogUrl || ""}
                data-testid="backlog-url-input"
                id="backlogUrl"
                placeholder="https://example.com/api/events"
                class="py-2 px-4 w-full font-mono bg-white border-2 border-black focus:outline-none"
              />
            </div>
          </div>
          <details class="mt-2">
            <summary class="font-bold font-mono cursor-pointer">
              More info
            </summary>
            <p class="font-mono">
              Enter a URL that returns game events in JSON format. The system will poll this URL every second for new events.
            </p>
          </details>
        </div>
      </section>
      <section class="flex justify-start flex-row-reverse mx-auto gap-x-4 mb-8">
        <button
          class="py-2 px-8 font-mono text-2xl font-bold text-black uppercase bg-green-600 border-t-0 border-l-0 border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 selectable"
          title="Exit setup menu"
          data-testid="setup-done-button"
          type="submit"
        >
          Done
        </button>
        <button
          class="py-2 px-8 font-mono text-2xl font-bold text-black uppercase bg-red-600 border-t-0 border-l-0 border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 selectable"
          title="Reset to Defaults"
          type="button"
          onClick={() => props.setMode(GameMode.Game)}
        >
          Cancel
        </button>
      </section>
      <ThankYou />
    </form>
  );
}

interface RecordKeyInputProps {
  listening: boolean;
  keyName: string;
  label: string;
  onRecordKey: Function;
  testid: string;
}

function RecordKeyInput(props: RecordKeyInputProps) {
  return (
    <div class="flex flex-col gap-y-2 items-center">
      <h6 class="tracking-wider text-left text-black font-sports">
        {props.label}
      </h6>
      <div class="w-32 text-center bg-gray-200 py-1 font-bold border-2 border-black">
        {props.listening ? "Recording..." : props.keyName}
      </div>
      <button
        class="py-2 px-4 font-mono font-bold text-black uppercase bg-white border-t-0 border-l-0 border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 selectable"
        data-testid={props.testid}
        type="button"
        onClick={() => props.onRecordKey()}
      >
        Record Key
      </button>
    </div>
  );
}

interface NumberInputWithButtonProps {
  default: number;
  min: number;
  step: number;
  name: string;
  increaseText: string;
  decreaseText: string;
  id: string;
  suffixText: string;
  testid: string;
}

function NumberInputWithButtons(props: NumberInputWithButtonProps) {
  let inputRef!: HTMLInputElement;
  const increase = () => {
    const next = parseInt(inputRef.value, 10) + props.step;
    if (isNaN(next)) {
      inputRef.value = `${props.default}`;
    } else {
      inputRef.value = `${next}`;
    }
  };
  const decrease = () => {
    const next = parseInt(inputRef.value, 10) - props.step;
    if (next < props.min) {
      inputRef.value = `${props.min}`;
    } else if (isNaN(next)) {
      inputRef.value = `${props.default}`;
    } else {
      inputRef.value = `${next}`;
    }
  };

  return (
    <div class="flex">
      <button
        class="py-2 px-4 mr-2 font-mono font-bold text-black uppercase bg-white border-t-0 border-l-0 border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 selectable"
        type="button"
        onClick={decrease}
      >
        {props.decreaseText}
      </button>
      <div class="border-2 border-transparent focus-within:border-black">
        <div class="py-2 px-4 bg-white border-2 border-black">
          <input
            type="number"
            id={props.id}
            name={props.name}
            class="w-12 font-mono uppercase focus:outline-none"
            data-testid={props.testid}
            step={props.step}
            min={props.min}
            value={props.default}
            ref={inputRef}
          />
          <span
            class="font-mono italic text-gray-800 uppercase"
            onClick={() => inputRef.focus()}
          >
            {props.suffixText}
          </span>
        </div>
      </div>
      <button
        class="py-2 px-4 ml-2 font-mono font-bold text-black bg-white border-t-0 border-l-0 border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 selectable"
        type="button"
        onClick={increase}
      >
        {props.increaseText}
      </button>
    </div>
  );
}
