export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  highScore: number;
  isPaused: boolean;
}
