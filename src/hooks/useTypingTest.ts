/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
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
  const [currentStats, setCurrentStats] = useState<TypingStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    errors: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: text.length,
    timeTaken: 0
  });

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const statsRef = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef(input);
  const statusesRef = useRef(charStatuses);
  const elapsedRef = useRef(timeElapsed);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);
  useEffect(() => {
    statusesRef.current = charStatuses;
  }, [charStatuses]);
  useEffect(() => {
    elapsedRef.current = timeElapsed;
  }, [timeElapsed]);

  useEffect(() => {
    setCharStatuses(text.split('').map(char => ({ char, status: 'pending' })));
  }, [text]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, testMode, timeLimit]);

  const calculateStats = (): TypingStats => {
    const chars = statusesRef.current;
    const typed = inputRef.current;
    const elapsed = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : elapsedRef.current;

    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;

    chars.forEach((status, index) => {
      if (index < typed.length) {
        if (status.status === 'correct') correctChars++;
        else if (status.status === 'incorrect') incorrectChars++;
      }
    });

    if (typed.length > text.length) {
      extraChars = typed.length - text.length;
      incorrectChars += extraChars;
    }

    const totalChars = typed.length;
    const errors = incorrectChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

    const safeElapsed = elapsed > 0.1 ? elapsed : 1;
    const timeInMinutes = safeElapsed / 60;
    const rawWpm = (totalChars / 5) / timeInMinutes;
    const wpm = (correctChars / 5) / timeInMinutes;

    return {
      wpm: Math.round(wpm),
      rawWpm: Math.round(rawWpm),
      accuracy: Math.round(accuracy * 100) / 100,
      errors,
      correctChars,
      incorrectChars,
      totalChars: text.length,
      timeTaken: Math.round(elapsed)
    };
  };

  useEffect(() => {
    if (started && !finished) {
      if (statsRef.current) clearInterval(statsRef.current);
      statsRef.current = setInterval(() => {
        setCurrentStats(calculateStats());
      }, 800);
    }

    return () => {
      if (statsRef.current) clearInterval(statsRef.current);
    };
  }, [started, finished]);

  const finishTest = () => {
    if (!finished) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (statsRef.current) clearInterval(statsRef.current);
      const stats = calculateStats();
      setCurrentStats(stats);
      onComplete(stats);
    }
  };

  const handleKeyPress = (key: string) => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    let newValue = input;
    if (key === 'Backspace') newValue = input.slice(0, -1);
    else if (key.length === 1) newValue = input + key;

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
  };

  const handleInput = (value: string) => {
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
  };

  const restart = () => {
    setInput('');
    setStarted(false);
    setFinished(false);
    setTimeElapsed(0);
    setCurrentWordIndex(0);
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    if (statsRef.current) clearInterval(statsRef.current);
    setCharStatuses(text.split('').map(char => ({ char, status: 'pending' })));
    setCurrentStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      errors: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: text.length,
      timeTaken: 0
    });
  };

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
