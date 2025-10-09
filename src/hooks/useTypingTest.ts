import { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, TestMode, TypingStats, CharStatus } from '../types';

interface UseTypingTestProps {
  text: string;
  difficulty: Difficulty;
  testMode: TestMode;
  timeLimit?: number;
  onComplete: (stats: TypingStats) => void;
}

export function useTypingTest({
  text,
  difficulty,
  testMode,
  timeLimit = 60,
  onComplete
}: UseTypingTestProps) {
  const [input, setInput] = useState('');
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCharStatuses(text.split('').map(char => ({ char, status: 'pending' })));
  }, [text]);

  useEffect(() => {
    if (started && !finished) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setTimeElapsed(elapsed);

          if (testMode === 'time' && elapsed >= timeLimit) {
            finishTest();
          }
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [started, finished, testMode, timeLimit]);

  const calculateStats = useCallback((): TypingStats => {
    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;

    charStatuses.forEach((status, index) => {
      if (index < input.length) {
        if (status.status === 'correct') correctChars++;
        else if (status.status === 'incorrect') incorrectChars++;
      }
    });

    if (input.length > text.length) {
      extraChars = input.length - text.length;
      incorrectChars += extraChars;
    }

    const totalChars = input.length;
    const errors = incorrectChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    const timeInMinutes = timeElapsed / 60;
    const rawWpm = timeInMinutes > 0 ? (totalChars / 5) / timeInMinutes : 0;
    const wpm = timeInMinutes > 0 ? (correctChars / 5) / timeInMinutes : 0;

    return {
      wpm: Math.round(wpm),
      rawWpm: Math.round(rawWpm),
      accuracy: Math.round(accuracy * 100) / 100,
      errors,
      correctChars,
      incorrectChars,
      totalChars: text.length,
      timeTaken: Math.round(timeElapsed)
    };
  }, [charStatuses, input, text, timeElapsed]);

  const finishTest = useCallback(() => {
    if (!finished) {
      setFinished(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const stats = calculateStats();
      onComplete(stats);
    }
  }, [finished, calculateStats, onComplete]);

  const handleKeyPress = useCallback((key: string) => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    let newValue = input;

    if (key === 'Backspace') {
      newValue = input.slice(0, -1);
    } else if (key.length === 1) {
      newValue = input + key;
    }

    setInput(newValue);

    const newStatuses = text.split('').map((char, i) => {
      if (i < newValue.length) {
        return {
          char,
          status: newValue[i] === text[i] ? 'correct' : 'incorrect'
        } as CharStatus;
      }
      return { char, status: 'pending' } as CharStatus;
    });

    if (newValue.length > text.length) {
      for (let i = text.length; i < newValue.length; i++) {
        newStatuses.push({ char: newValue[i], status: 'extra' });
      }
    }

    setCharStatuses(newStatuses);

    const words = text.split(' ');
    let charCount = 0;
    let wordIndex = 0;
    for (let i = 0; i < words.length; i++) {
      charCount += words[i].length + 1;
      if (newValue.length < charCount) {
        wordIndex = i;
        break;
      }
    }
    setCurrentWordIndex(wordIndex);

    if (newValue.length >= text.length && testMode === 'words') {
      finishTest();
    }
  }, [started, finished, text, input, testMode, finishTest]);

  const handleInput = useCallback((value: string) => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    setInput(value);

    const newStatuses = text.split('').map((char, i) => {
      if (i < value.length) {
        return {
          char,
          status: value[i] === text[i] ? 'correct' : 'incorrect'
        } as CharStatus;
      }
      return { char, status: 'pending' } as CharStatus;
    });

    if (value.length > text.length) {
      for (let i = text.length; i < value.length; i++) {
        newStatuses.push({ char: value[i], status: 'extra' });
      }
    }

    setCharStatuses(newStatuses);

    const words = text.split(' ');
    let charCount = 0;
    let wordIndex = 0;
    for (let i = 0; i < words.length; i++) {
      charCount += words[i].length + 1;
      if (value.length < charCount) {
        wordIndex = i;
        break;
      }
    }
    setCurrentWordIndex(wordIndex);

    if (value.length >= text.length && testMode === 'words') {
      finishTest();
    }
  }, [started, finished, text, testMode, finishTest]);

  const restart = useCallback(() => {
    setInput('');
    setStarted(false);
    setFinished(false);
    setTimeElapsed(0);
    setCurrentWordIndex(0);
    startTimeRef.current = null;
    setCharStatuses(text.split('').map(char => ({ char, status: 'pending' })));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [text]);

  const currentStats = calculateStats();

  return {
    input,
    charStatuses,
    started,
    finished,
    timeElapsed,
    currentWordIndex,
    currentStats,
    handleInput,
    handleKeyPress,
    restart
  };
}
