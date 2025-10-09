export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type TestMode = 'time' | 'words';

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeTaken: number;
}

export interface TestResult extends TypingStats {
  difficulty: Difficulty;
  testMode: TestMode;
  timestamp: number;
}

export interface CharStatus {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}
