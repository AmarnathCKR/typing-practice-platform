import { useState, useEffect } from 'react';
import { Difficulty, TestMode, TestResult } from './types';
import { generateText } from './data/words';
import { useTypingTest } from './hooks/useTypingTest';
import { TypingArea } from './components/TypingArea';
import { StatsPanel } from './components/StatsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultsScreen } from './components/ResultsScreen';
import { Keyboard } from 'lucide-react';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [timeLimit, setTimeLimit] = useState(60);
  const [wordCount, setWordCount] = useState(50);
  const [text, setText] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    generateNewText();
  }, [difficulty, testMode, wordCount]);

  const generateNewText = () => {
    const count = testMode === 'words' ? wordCount : 200;
    setText(generateText(difficulty, count));
  };

  const handleTestComplete = (stats: any) => {
    const result: TestResult = {
      ...stats,
      difficulty,
      testMode,
      timestamp: Date.now()
    };
    setTestResult(result);
  };

  const {
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
  } = useTypingTest({
    text,
    difficulty,
    testMode,
    timeLimit,
    onComplete: handleTestComplete
  });

  const handleRestart = () => {
    setTestResult(null);
    restart();
  };

  const handleNewTest = () => {
    setTestResult(null);
    generateNewText();
    restart();
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    handleNewTest();
  };

  const handleTestModeChange = (newMode: TestMode) => {
    setTestMode(newMode);
    handleNewTest();
  };

  const handleTimeLimitChange = (time: number) => {
    setTimeLimit(time);
    handleNewTest();
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
    handleNewTest();
  };

  if (testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Keyboard className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-800">TypeSpeed</h1>
            </div>
            <p className="text-gray-600 text-lg">Master Your Typing Skills</p>
          </header>

          <ResultsScreen
            result={testResult}
            onRestart={handleRestart}
            onNewTest={handleNewTest}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Keyboard className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">TypeSpeed</h1>
          </div>
          <p className="text-gray-600 text-lg">Master Your Typing Skills</p>
        </header>

        <SettingsPanel
          difficulty={difficulty}
          testMode={testMode}
          timeLimit={timeLimit}
          wordCount={wordCount}
          onDifficultyChange={handleDifficultyChange}
          onTestModeChange={handleTestModeChange}
          onTimeLimitChange={handleTimeLimitChange}
          onWordCountChange={handleWordCountChange}
          onRestart={handleNewTest}
          disabled={started && !finished}
        />

        <StatsPanel
          stats={currentStats}
          timeElapsed={timeElapsed}
          timeLimit={timeLimit}
          testMode={testMode}
        />

        <TypingArea
          charStatuses={charStatuses}
          input={input}
          onInputChange={handleInput}
          onKeyPress={handleKeyPress}
          disabled={finished}
          currentWordIndex={currentWordIndex}
        />

        {!started && (
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg">
              Start typing to begin the test
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
