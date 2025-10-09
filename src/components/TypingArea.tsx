import { useEffect, useRef } from 'react';
import { CharStatus } from '../types';

interface TypingAreaProps {
  charStatuses: CharStatus[];
  input: string;
  onInputChange: (value: string) => void;
  onKeyPress: (key: string) => void;
  disabled: boolean;
  currentWordIndex: number;
}

export function TypingArea({
  charStatuses,
  input,
  onInputChange,
  onKeyPress,
  disabled,
  currentWordIndex
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        e.preventDefault();
        onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, onKeyPress]);

  useEffect(() => {
    if (containerRef.current && !disabled) {
      containerRef.current.focus();
    }
  }, [disabled]);

  const words = charStatuses.map(c => c.char).join('').split(' ');
  let charIndex = 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="w-full max-w-4xl mx-auto outline-none"
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-2xl leading-relaxed font-mono relative select-none">
          {words.map((word, wordIndex) => {
            const wordChars = [];
            const wordLength = word.length;

            for (let i = 0; i < wordLength; i++) {
              const currentCharIndex = charIndex;
              const status = charStatuses[currentCharIndex];

              let className = 'transition-colors duration-75';

              if (status.status === 'correct') {
                className += ' text-green-600';
              } else if (status.status === 'incorrect') {
                className += ' text-red-600 bg-red-100 rounded px-0.5';
              } else if (currentCharIndex === input.length) {
                className += ' text-gray-800 border-b-2 border-blue-500 animate-pulse';
              } else {
                className += ' text-gray-400';
              }

              wordChars.push(
                <span key={currentCharIndex} className={className}>
                  {status.char}
                </span>
              );

              charIndex++;
            }

            const spaceIndex = charIndex;
            const spaceStatus = input.length > spaceIndex
              ? (input[spaceIndex] === ' ' ? 'correct' : 'incorrect')
              : input.length === spaceIndex ? 'cursor' : 'pending';

            charIndex++;

            const isCurrentWord = wordIndex === currentWordIndex;

            return (
              <span key={wordIndex} className="inline-block">
                <span
                  className={`inline-block ${
                    isCurrentWord ? 'bg-gray-100 px-1 rounded' : ''
                  }`}
                >
                  {wordChars}
                </span>
                <span
                  className={`inline-block w-2 ${
                    spaceStatus === 'cursor' ? 'border-b-2 border-blue-500 animate-pulse' : ''
                  } ${
                    spaceStatus === 'incorrect' ? 'bg-red-100' : ''
                  }`}
                >
                  {' '}
                </span>
              </span>
            );
          })}

          {charStatuses.length < input.length && (
            <span className="text-red-600 bg-red-100 rounded px-1">
              {input.slice(charStatuses.length)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
