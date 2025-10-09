import { TestResult } from '../types';
import { Trophy, Zap, Target, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface ResultsScreenProps {
  result: TestResult;
  onRestart: () => void;
  onNewTest: () => void;
}

export function ResultsScreen({ result, onRestart, onNewTest }: ResultsScreenProps) {
  const getPerformanceRating = (wpm: number, accuracy: number) => {
    if (wpm >= 80 && accuracy >= 95) return { text: 'Outstanding!', color: 'text-yellow-500' };
    if (wpm >= 60 && accuracy >= 90) return { text: 'Excellent!', color: 'text-green-500' };
    if (wpm >= 40 && accuracy >= 85) return { text: 'Good!', color: 'text-blue-500' };
    if (wpm >= 25 && accuracy >= 80) return { text: 'Keep Practicing!', color: 'text-orange-500' };
    return { text: 'Keep Going!', color: 'text-gray-500' };
  };

  const rating = getPerformanceRating(result.wpm, result.accuracy);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${rating.color}`} />
          <h2 className={`text-4xl font-bold mb-2 ${rating.color}`}>{rating.text}</h2>
          <p className="text-gray-600 text-lg">Test Completed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            icon={<Zap className="w-8 h-8" />}
            label="Words Per Minute"
            value={result.wpm}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />

          <ResultCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Raw WPM"
            value={result.rawWpm}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />

          <ResultCard
            icon={<Target className="w-8 h-8" />}
            label="Accuracy"
            value={`${result.accuracy}%`}
            color="text-green-600"
            bgColor="bg-green-50"
          />

          <ResultCard
            icon={<AlertCircle className="w-8 h-8" />}
            label="Errors"
            value={result.errors}
            color="text-red-600"
            bgColor="bg-red-50"
          />

          <ResultCard
            icon={<Clock className="w-8 h-8" />}
            label="Time Taken"
            value={`${result.timeTaken}s`}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />

          <ResultCard
            icon={<Target className="w-8 h-8" />}
            label="Characters"
            value={`${result.correctChars}/${result.totalChars}`}
            color="text-gray-600"
            bgColor="bg-gray-50"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Difficulty:</span>
              <span className="ml-2 font-semibold capitalize">{result.difficulty}</span>
            </div>
            <div>
              <span className="text-gray-600">Mode:</span>
              <span className="ml-2 font-semibold capitalize">{result.testMode}</span>
            </div>
            <div>
              <span className="text-gray-600">Correct Characters:</span>
              <span className="ml-2 font-semibold text-green-600">{result.correctChars}</span>
            </div>
            <div>
              <span className="text-gray-600">Incorrect Characters:</span>
              <span className="ml-2 font-semibold text-red-600">{result.incorrectChars}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            New Test
          </button>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function ResultCard({ icon, label, value, color, bgColor }: ResultCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className={`flex items-center gap-3 mb-3 ${color}`}>
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-4xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  );
}
