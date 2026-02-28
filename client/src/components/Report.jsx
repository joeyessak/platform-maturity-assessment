import { useEffect, useState } from 'react';

const layerLabels = {
  platformServices: 'Platform Services',
  cloudGovernance: 'Cloud Governance',
  portfolioArchitecture: 'Portfolio Architecture',
  productExecution: 'Product & Client Execution',
};

const layerConfig = {
  platformServices: {
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    icon: '⚙️',
    description: 'CI/CD, Infrastructure as Code',
  },
  cloudGovernance: {
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    icon: '🛡️',
    description: 'Cost management, Access controls',
  },
  portfolioArchitecture: {
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    icon: '🏗️',
    description: 'Service standardization, Tech choices',
  },
  productExecution: {
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    icon: '🚀',
    description: 'Delivery visibility, AI readiness',
  },
};

function RingProgress({ score, label, config, delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const getScoreLabel = (s) => {
    if (s >= 4.5) return 'Optimized';
    if (s >= 3.5) return 'Mature';
    if (s >= 2.5) return 'Developing';
    if (s >= 1.5) return 'Basic';
    return 'Ad-hoc';
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{config.icon}</span>
          <span className="text-xl font-bold" style={{ color: config.color }}>
            {animatedScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-semibold text-gray-900 text-sm">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{config.description}</div>
        <div
          className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
        >
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}

function OverallScoreRing({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s) => {
    if (s >= 4) return { main: '#10B981', light: '#D1FAE5' };
    if (s >= 3) return { main: '#F59E0B', light: '#FEF3C7' };
    if (s >= 2) return { main: '#F97316', light: '#FFEDD5' };
    return { main: '#EF4444', light: '#FEE2E2' };
  };

  const getScoreLabel = (s) => {
    if (s >= 4.5) return 'Optimized';
    if (s >= 3.5) return 'Mature';
    if (s >= 2.5) return 'Developing';
    if (s >= 1.5) return 'Basic';
    return 'Ad-hoc';
  };

  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
      <div className="text-sm font-medium text-gray-600 mb-4">Overall Maturity Score</div>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="overall-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#overall-gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-indigo-600">
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">out of 5</span>
        </div>
      </div>
      <div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: colors.light, color: colors.main }}
      >
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

export default function Report({ assessment, onRestart }) {
  const handleShare = () => {
    const text = `Platform Maturity Assessment Results:\n\nOverall Score: ${assessment.overallScore}/5\n\n${assessment.executiveSummary}\n\nPowered by Platform Maturity Assessment Tool`;

    if (navigator.share) {
      navigator.share({
        title: 'Platform Maturity Assessment',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Platform Maturity Assessment Report
        </h1>

        <OverallScoreRing score={assessment.overallScore} />

        {/* Executive Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">Executive Summary</h2>
          <p className="text-gray-700">{assessment.executiveSummary}</p>
        </div>
      </div>

      {/* Layer Scores - Ring Charts */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Maturity by Layer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(assessment.layerScores).map(([key, score], index) => (
            <RingProgress
              key={key}
              score={score}
              label={layerLabels[key]}
              config={layerConfig[key]}
              delay={200 + index * 150}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Top Recommendations
        </h2>
        <div className="space-y-4">
          {assessment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <p className="text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-sm text-indigo-600 mt-2 font-medium flex items-center gap-1">
                    <span>📈</span> Impact: {rec.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pb-8">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Start New Assessment
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
        >
          Share Results
        </button>
      </div>
    </div>
  );
}
