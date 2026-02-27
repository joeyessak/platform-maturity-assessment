const layerLabels = {
  platformServices: 'Platform Services',
  cloudGovernance: 'Cloud Governance',
  portfolioArchitecture: 'Portfolio Architecture',
  productExecution: 'Product & Client Execution',
};

const layerColors = {
  platformServices: 'bg-blue-500',
  cloudGovernance: 'bg-green-500',
  portfolioArchitecture: 'bg-purple-500',
  productExecution: 'bg-orange-500',
};

function ScoreBar({ label, score, colorClass }) {
  const percentage = (score / 5) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{score}/5</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function OverallScore({ score }) {
  const getScoreColor = (s) => {
    if (s >= 4) return 'text-green-600';
    if (s >= 3) return 'text-yellow-600';
    if (s >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (s) => {
    if (s >= 4.5) return 'Optimized';
    if (s >= 3.5) return 'Mature';
    if (s >= 2.5) return 'Developing';
    if (s >= 1.5) return 'Basic';
    return 'Ad-hoc';
  };

  return (
    <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
      <div className="text-sm font-medium text-gray-600 mb-1">Overall Maturity Score</div>
      <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
        {score.toFixed(1)}
      </div>
      <div className="text-lg font-medium text-gray-700 mt-1">{getScoreLabel(score)}</div>
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Platform Maturity Assessment Report
        </h1>

        <OverallScore score={assessment.overallScore} />

        {/* Executive Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">Executive Summary</h2>
          <p className="text-gray-700">{assessment.executiveSummary}</p>
        </div>
      </div>

      {/* Layer Scores */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Maturity by Layer</h2>
        <div className="space-y-4">
          {Object.entries(assessment.layerScores).map(([key, score]) => (
            <ScoreBar
              key={key}
              label={layerLabels[key]}
              score={score}
              colorClass={layerColors[key]}
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
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <p className="text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-sm text-indigo-600 mt-2 font-medium">
                    Impact: {rec.impact}
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
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start New Assessment
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Share Results
        </button>
      </div>
    </div>
  );
}
