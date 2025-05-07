export enum Team {
  YELLOW = 'yellow',
  RED = 'red'
}

export enum GameStatus {
  LOBBY = 'lobby',
  COUNTDOWN = 'countdown',
  QUESTION = 'question',
  VOTING = 'voting',
  SCOREBOARD = 'scoreboard',
  FINISHED = 'finished'
}

export interface Player {
  id: string;
  name: string;
  team: Team;
  score: number;
  isHost: boolean;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  isNumeric: boolean;
  correctAnswer?: string | number;
}

export interface Theme {
  id: string;
  name: string;
  questions: Question[];
}

export interface Vote {
  playerId: string;
  answer: string | number;
  timestamp: number;
}

export interface GameSession {
  id: string;
  status: GameStatus;
  currentQuestionIndex: number;
  players: { [key: string]: Player };
  votes: { [key: number]: { [key: string]: Vote } };
  scores: { [key: string]: number };
  countdown: number;
  currentTheme?: Theme;
} 