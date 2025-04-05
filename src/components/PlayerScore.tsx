import { GameMode } from "./common";

interface PlayerScoreProps {
  mode: GameMode;
  showBorder: boolean;
  name: string;
  reverse: boolean;
  score: number;
  games: number;
  onScore: Function;
  onCorrection: Function;
  testid: string;
}

export default function PlayerScore(props: PlayerScoreProps) {
  return (
    <div
      classList={{
        "ltr flex flex-col font-sports tracking-wider mt-20": true,
        "border-r-2 border-black": props.showBorder,
      }}
    >
      <div class="mb-8 w-full text-3xl font-medium tracking-wider text-center md:text-5xl xl:text-7xl">
        <span
          class="px-8 pb-2 w-auto border-b-4 border-black"
          data-testid={`${props.testid}-name`}
        >
          {props.name}
        </span>
      </div>
      <div classList={{ "flex mx-4": true, "flex-row-reverse": props.reverse }}>
        <div class="flex-col items-center w-3/5 font-medium text-center">
          <div class="text-2xl md:text-5xl">Score</div>
          <div
            class="leading-none text-[15rem] font-seven md:text-[21rem]"
            data-testid={`${props.testid}-score`}
          >
            {props.score}
          </div>
        </div>
        <div class="flex-col items-center w-2/5 text-center">
          <div class="text-xl font-medium tracking-wider md:text-3xl">
            Games
          </div>
          <div
            class="text-5xl leading-none md:text-7xl font-seven"
            data-testid={`${props.testid}-games`}
          >
            {props.games}
          </div>
        </div>
      </div>
      {props.mode === GameMode.Game && (
        <div class="flex col-span-full col-start-1 justify-center mt-8 text-lg font-medium tracking-wider md:text-2xl">
          <button
            class="py-2 px-4 mx-4 text-black uppercase bg-white border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 font-sports border-t-1 border-l-1 selectable"
            onClick={() => props.onScore()}
            data-testid={`${props.testid}-button`}
          >
            {props.name} Scored
          </button>
        </div>
      )}
      {props.mode === GameMode.Correction && (
        <div class="flex col-span-full col-start-1 justify-center mt-8 text-2xl font-medium tracking-wider">
          <button
            class="py-2 px-4 mx-4 text-black uppercase bg-white border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 font-sports border-t-1 border-l-1 selectable"
            data-testid={`${props.testid}-correction-button`}
            onClick={() => props.onCorrection()}
          >
            Subtract point from {props.name}
          </button>
        </div>
      )}
    </div>
  );
}
