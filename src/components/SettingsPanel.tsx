import { Difficulty, TestMode } from '../types';
import { Settings, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  difficulty: Difficulty;
  testMode: TestMode;
  timeLimit: number;
  wordCount: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTestModeChange: (mode: TestMode) => void;
  onTimeLimitChange: (time: number) => void;
  onWordCountChange: (count: number) => void;
  onRestart: () => void;
  disabled: boolean;
}

export function SettingsPanel({
  difficulty,
  testMode,
  timeLimit,
  wordCount,
  onDifficultyChange,
  onTestModeChange,
  onTimeLimitChange,
  onWordCountChange,
  onRestart,
  disabled
}: SettingsPanelProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const timeLimits = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">Test Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  disabled={disabled}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    difficulty === diff
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onTestModeChange('time')}
                disabled={disabled}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  testMode === 'time'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Time
              </button>
              <button
                onClick={() => onTestModeChange('words')}
                disabled={disabled}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  testMode === 'words'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Words
              </button>
            </div>
          </div>

          {testMode === 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <div className="flex gap-2">
                {timeLimits.map((time) => (
                  <button
                    key={time}
                    onClick={() => onTimeLimitChange(time)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      timeLimit === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {testMode === 'words' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Count
              </label>
              <div className="flex gap-2">
                {wordCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => onWordCountChange(count)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      wordCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={onRestart}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
