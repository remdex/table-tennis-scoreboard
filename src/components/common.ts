export enum GameMode {
  GameOver = 0,
  MatchOver = 1,
  Game = 2,
  Correction = 3,
  Setup = 4,
  SwitchingSides = 5,
}

// TODO: add config for showing swap ends reminder
// TODO: add config for auto-starting the next game

export type GameConfig = {
  matchLength: number;
  player1Key: string;
  player2Key: string;
  scoreCorrectionKey: string;
  winningScore: number;
  switchSides: boolean;
  player1CorrectionKey: string;
  player2CorrectionKey: string;
  autoRestart: boolean;
  backlogUrl?: string;
};

export type Player = {
  name: string;
  score: number;
  games: number;
};

export type GameResult = {
  winner: Player;
  player1Score: number;
  player2Score: number;
};

export type MatchState = {
  player1: Player;
  player2: Player;
  gameLog: GameResult[];
  swapped: boolean;
};

export enum BacklogEventType {
  Player1Scored = 1,
  Player2Scored = 2, 
  Player1Decrease = 3,
  Player2Decrease = 4,
  RestartGame = 5,
}

export type BacklogEvent = {
  type: BacklogEventType;
  timestamp: string;
};

export const defaultGameConfig: GameConfig = {
  matchLength: 5,
  winningScore: 11,
  switchSides: true,
  autoRestart: false,
  player1Key: "ArrowLeft",
  player2Key: "ArrowRight",
  scoreCorrectionKey: "Tab",
  player1CorrectionKey: "1",
  player2CorrectionKey: "2",
};
