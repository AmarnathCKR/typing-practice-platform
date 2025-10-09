import { TypingStats } from '../types';
import { Clock, Zap, Target, AlertCircle } from 'lucide-react';

interface StatsPanelProps {
  stats: TypingStats;
  timeElapsed: number;
  timeLimit?: number;
  testMode: 'time' | 'words';
}

export function StatsPanel({ stats, timeElapsed, timeLimit, testMode }: StatsPanelProps) {
  const timeRemaining = testMode === 'time' && timeLimit ? Math.max(0, timeLimit - timeElapsed) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="WPM"
          value={stats.wpm}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Accuracy"
          value={`${stats.accuracy}%`}
          color="text-green-600"
          bgColor="bg-green-50"
        />

        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Errors"
          value={stats.errors}
          color="text-red-600"
          bgColor="bg-red-50"
        />

        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label={testMode === 'time' ? 'Time Left' : 'Time'}
          value={testMode === 'time' ? `${Math.ceil(timeRemaining)}s` : `${Math.floor(timeElapsed)}s`}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md transition-transform hover:scale-105`}>
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  );
}
