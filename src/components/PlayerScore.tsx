import { GameMode } from "./common";
import { createSignal, createEffect } from "solid-js";

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
  redNumber: boolean;
  isServing: boolean;
  matchHasNotStarted: boolean;
  onChooseInitialServer?: Function;
  isChosenAsInitialServer: boolean;
}

export default function PlayerScore(props: PlayerScoreProps) {
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [previousScore, setPreviousScore] = createSignal(props.score);
  const [scoreChange, setScoreChange] = createSignal<'increase' | 'decrease' | 'none'>('none');
  const [buttonPressed, setButtonPressed] = createSignal(false);
  const [gamesAnimating, setGamesAnimating] = createSignal(false);
  const [previousGames, setPreviousGames] = createSignal(props.games);

  // Watch for score changes to trigger animations
  createEffect(() => {
    const currentScore = props.score;
    const prevScore = previousScore();
    
    if (currentScore !== prevScore) {
      setIsAnimating(true);
      
      // Determine the type of score change
      if (currentScore > prevScore) {
        setScoreChange('increase');
      } else if (currentScore < prevScore) {
        setScoreChange('decrease');
      }
      
      setPreviousScore(currentScore);
      
      // Reset animation after duration
      setTimeout(() => {
        setIsAnimating(false);
        setScoreChange('none');
      }, 400);
    }
  });

  // Watch for games changes to trigger animations
  createEffect(() => {
    const currentGames = props.games;
    if (currentGames !== previousGames()) {
      setGamesAnimating(true);
      setPreviousGames(currentGames);
      setTimeout(() => setGamesAnimating(false), 600);
    }
  });

  const handleScoreClick = () => {
    setButtonPressed(true);
    props.onScore();
    setTimeout(() => setButtonPressed(false), 200);
  };

  const handleCorrectionClick = () => {
    setButtonPressed(true);
    props.onCorrection();
    setTimeout(() => setButtonPressed(false), 200);
  };

  return (
    <div
      classList={{
        "ltr flex flex-col font-sports tracking-wider mt-20": true,
        "border-r-2 border-black": props.showBorder,
      }}
    >
      <div class="mb-8 w-full text-3xl font-medium tracking-wider text-center md:text-5xl xl:text-7xl">
        <span
          class="px-8 pb-2 w-auto border-b-4 border-black relative"
          data-testid={`${props.testid}-name`}
        >
          {props.name}
          
        </span>
      </div>
      <div classList={{ "flex mx-4": true, "flex-row-reverse": props.reverse }}>
        <div class="flex-col items-center w-3/5 font-medium text-center">
          <div class="text-2xl md:text-5xl">Score</div>
          <div
            class="leading-none text-[15rem] font-seven md:text-[28rem] transition-all duration-200 ease-out"
            classList={{
              "score-bounce": isAnimating(),
            }}
            data-testid={`${props.testid}-score`}
          >
            <span
              class="transition-all duration-300 ease-out"
              classList={{
                "text-rose-400 score-glow-correction": props.redNumber,
                "text-white": !props.redNumber && !isAnimating(),
                "text-green-400 score-glow-increase": !props.redNumber && isAnimating() && scoreChange() === 'increase',
                "text-yellow-400 score-glow-decrease": !props.redNumber && isAnimating() && scoreChange() === 'decrease',
              }}
            >
              {props.score}
            </span>

          </div>
        </div>
        <div class="flex-col items-center w-2/5 text-center">
          <div class="text-xl font-medium tracking-wider md:text-3xl">
            Games
          </div>
          <div
            class="text-9xl leading-none md:text-[16rem] font-seven transition-all duration-300 ease-out"
            classList={{
              "scale-125 text-green-400 games-glow": gamesAnimating(),
              "scale-100 text-white": !gamesAnimating(),
            }}
            data-testid={`${props.testid}-games`}
          >
            {props.games}
          </div>

          {props.isServing && (
            <div class="bg-yellow-400 text-black text-sm px-2 py-1 rounded-full font-bold">
              SERVE
            </div>
          )}

          {props.mode === GameMode.Game && props.matchHasNotStarted && (
            <div class="flex justify-center mt-2">
              <button
                class="py-1 px-2 text-black uppercase text-xs border-r-2 border-b-2 active:border-r-0 active:border-b-0 active:border-t-2 active:border-l-2 font-sports border-t border-l selectable transition-transform duration-150 ease-out"
                classList={{
                  "scale-95": buttonPressed(),
                  "scale-100": !buttonPressed(),
                  "bg-green-400 border-green-600": props.isChosenAsInitialServer,
                  "bg-gray-300 border-gray-500": !props.isChosenAsInitialServer,
                }}
                onClick={() => props.onChooseInitialServer?.()}
                data-testid={`${props.testid}-serve-button`}
              >
                {props.isChosenAsInitialServer ? `${props.name} Will Serve` : `${props.name} Serves`}
              </button>
            </div>
          )}

        </div>
      </div>
      {props.mode === GameMode.Game && (
        <div class="flex col-span-full col-start-1 justify-center mt-8 text-lg font-medium tracking-wider md:text-2xl">
          <button
            class="py-2 px-4 mx-4 text-black uppercase bg-white border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 font-sports border-t border-l selectable transition-transform duration-150 ease-out"
            classList={{
              "scale-95": buttonPressed(),
              "scale-100": !buttonPressed(),
            }}
            onClick={handleScoreClick}
            data-testid={`${props.testid}-button`}
          >
            {props.name} Scored
          </button>
        </div>
      )}
      {props.mode === GameMode.Correction && (
        <div class="flex col-span-full col-start-1 justify-center mt-8 text-2xl font-medium tracking-wider">
          <button
            class="py-2 px-4 mx-4 text-black uppercase bg-white border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t border-l font-sports selectable transition-transform duration-150 ease-out"
            classList={{
              "scale-95": buttonPressed(),
              "scale-100": !buttonPressed(),
            }}
            data-testid={`${props.testid}-correction-button`}
            onClick={handleCorrectionClick}
          >
            Subtract point from {props.name}
          </button>
        </div>
      )}
    </div>
  );
}
