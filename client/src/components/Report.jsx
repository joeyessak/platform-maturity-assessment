import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  Cog,
  Shield,
  Building2,
  Rocket,
  Share2,
  RotateCcw,
  Download
} from 'lucide-react';

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
    Icon: Cog,
    description: 'CI/CD, Infrastructure as Code',
  },
  cloudGovernance: {
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    Icon: Shield,
    description: 'Cost management, Access controls',
  },
  portfolioArchitecture: {
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    Icon: Building2,
    description: 'Service standardization, Tech choices',
  },
  productExecution: {
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    Icon: Rocket,
    description: 'Delivery visibility, AI readiness',
  },
};

function RingProgress({ score, layerKey, label, config, delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `gradient-${layerKey}`;
  const Icon = config.Icon;

  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const scoreTimer = setTimeout(() => {
      setAnimatedScore(score);
    }, delay + 100);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(scoreTimer);
    };
  }, [score, delay]);

  const getScoreLabel = (s) => {
    if (s >= 4.5) return 'Optimized';
    if (s >= 3.5) return 'Mature';
    if (s >= 2.5) return 'Developing';
    if (s >= 1.5) return 'Basic';
    return 'Ad-hoc';
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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
            className="dark:stroke-gray-700"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? offset : circumference}
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon
            size={24}
            style={{ color: config.color }}
            strokeWidth={1.5}
          />
          <span
            className="text-xl font-bold mt-1"
            style={{ color: config.color }}
          >
            {animatedScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-semibold text-gray-900 dark:text-white text-sm">{label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{config.description}</div>
        <div
          className="text-xs font-medium mt-2 px-3 py-1 rounded-full inline-block"
          style={{ backgroundColor: `${config.color}15`, color: config.color }}
        >
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}

function OverallScoreRing({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const scoreTimer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(scoreTimer);
    };
  }, [score]);

  const getScoreColor = (s) => {
    if (s >= 4) return { main: '#10B981', light: '#D1FAE5', darkLight: '#064E3B' };
    if (s >= 3) return { main: '#F59E0B', light: '#FEF3C7', darkLight: '#78350F' };
    if (s >= 2) return { main: '#F97316', light: '#FFEDD5', darkLight: '#7C2D12' };
    return { main: '#EF4444', light: '#FEE2E2', darkLight: '#7F1D1D' };
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
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Overall Maturity Score</div>
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
            className="dark:stroke-gray-700"
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
            strokeDashoffset={isVisible ? offset : circumference}
            style={{
              transition: 'stroke-dashoffset 1.2s ease-out',
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">out of 5</span>
        </div>
      </div>
      <div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: colors.light, color: colors.main }}
      >
        <span className="dark:hidden">{getScoreLabel(score)}</span>
        <span className="hidden dark:inline" style={{ backgroundColor: colors.darkLight, color: colors.main }}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

function getScoreLabel(s) {
  if (s >= 4.5) return 'Optimized';
  if (s >= 3.5) return 'Mature';
  if (s >= 2.5) return 'Developing';
  if (s >= 1.5) return 'Basic';
  return 'Ad-hoc';
}

export default function Report({ assessment, onRestart }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = 20;

      // Title
      pdf.setFontSize(22);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Platform Maturity Assessment Report', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Overall Score
      pdf.setFontSize(14);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Overall Maturity Score', pageWidth / 2, y, { align: 'center' });
      y += 10;

      pdf.setFontSize(36);
      pdf.setTextColor(79, 70, 229);
      pdf.text(`${assessment.overallScore.toFixed(1)}`, pageWidth / 2, y, { align: 'center' });
      y += 8;

      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`out of 5 - ${getScoreLabel(assessment.overallScore)}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Executive Summary
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Executive Summary', 20, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, pageWidth - 40);
      pdf.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 10;

      // Layer Scores
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Maturity by Layer', 20, y);
      y += 10;

      const layers = [
        { key: 'platformServices', label: 'Platform Services', color: [59, 130, 246] },
        { key: 'cloudGovernance', label: 'Cloud Governance', color: [16, 185, 129] },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture', color: [139, 92, 246] },
        { key: 'productExecution', label: 'Product & Client Execution', color: [245, 158, 11] },
      ];

      layers.forEach((layer) => {
        const score = assessment.layerScores[layer.key];
        const barWidth = (score / 5) * 100;

        pdf.setFontSize(11);
        pdf.setTextColor(31, 41, 55);
        pdf.text(layer.label, 20, y);
        pdf.text(`${score.toFixed(1)}/5 - ${getScoreLabel(score)}`, pageWidth - 20, y, { align: 'right' });
        y += 5;

        // Background bar
        pdf.setFillColor(229, 231, 235);
        pdf.roundedRect(20, y, 100, 4, 2, 2, 'F');

        // Progress bar
        pdf.setFillColor(...layer.color);
        pdf.roundedRect(20, y, barWidth, 4, 2, 2, 'F');
        y += 12;
      });

      y += 5;

      // Recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Top Recommendations', 20, y);
      y += 10;

      assessment.recommendations.forEach((rec, index) => {
        // Check if we need a new page
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(79, 70, 229);
        pdf.text(`${index + 1}. ${rec.title}`, 20, y);
        y += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const descLines = pdf.splitTextToSize(rec.description, pageWidth - 45);
        pdf.text(descLines, 25, y);
        y += descLines.length * 4 + 3;

        pdf.setTextColor(79, 70, 229);
        const impactLines = pdf.splitTextToSize(`Impact: ${rec.impact}`, pageWidth - 45);
        pdf.text(impactLines, 25, y);
        y += impactLines.length * 4 + 8;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Generated by Platform Maturity Assessment Tool', pageWidth / 2, 285, { align: 'center' });

      pdf.save('platform-maturity-assessment.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Platform Maturity Assessment Report
        </h1>

        <OverallScoreRing score={assessment.overallScore} />

        {/* Executive Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Executive Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">{assessment.executiveSummary}</p>
        </div>
      </div>

      {/* Layer Scores - Ring Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Maturity by Layer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(assessment.layerScores).map(([key, score], index) => (
            <RingProgress
              key={key}
              layerKey={key}
              score={score}
              label={layerLabels[key]}
              config={layerConfig[key]}
              delay={300 + index * 200}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Top Recommendations
        </h2>
        <div className="space-y-4">
          {assessment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md dark:hover:shadow-indigo-900/20 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                    Impact: {rec.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 pb-8">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Start New Assessment
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={18} />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-2.5 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors font-medium flex items-center gap-2"
        >
          <Share2 size={18} />
          Share Results
        </button>
      </div>
    </div>
  );
}
