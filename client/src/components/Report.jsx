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

// Using chart colors from the design system (CSS variables)
const layerConfig = {
  platformServices: {
    colorVar: '--chart-1',
    Icon: Cog,
    description: 'CI/CD, Infrastructure as Code',
  },
  cloudGovernance: {
    colorVar: '--chart-2',
    Icon: Shield,
    description: 'Cost management, Access controls',
  },
  portfolioArchitecture: {
    colorVar: '--chart-3',
    Icon: Building2,
    description: 'Service standardization, Tech choices',
  },
  productExecution: {
    colorVar: '--chart-4',
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
  const Icon = config.Icon;
  const colorStyle = `var(${config.colorVar})`;

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
    <div
      className="flex flex-col items-center p-4 rounded-xl transition-colors"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorStyle}
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
            style={{ color: colorStyle }}
            strokeWidth={1.5}
          />
          <span
            className="text-xl font-bold mt-1"
            style={{ color: colorStyle }}
          >
            {animatedScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
          {label}
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {config.description}
        </div>
        <div
          className="text-xs font-medium mt-2 px-3 py-1 rounded-full inline-block"
          style={{
            backgroundColor: 'var(--accent)',
            color: colorStyle
          }}
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

  const getScoreLabel = (s) => {
    if (s >= 4.5) return 'Optimized';
    if (s >= 3.5) return 'Mature';
    if (s >= 2.5) return 'Developing';
    if (s >= 1.5) return 'Basic';
    return 'Ad-hoc';
  };

  return (
    <div
      className="flex flex-col items-center p-6 rounded-xl"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="text-sm font-medium mb-4" style={{ color: 'var(--muted-foreground)' }}>
        Overall Maturity Score
      </div>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--ring)"
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
          <span className="text-4xl font-bold" style={{ color: 'var(--ring)' }}>
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>out of 5</span>
        </div>
      </div>
      <div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: 'var(--accent)',
          color: 'var(--accent-foreground)'
        }}
      >
        {getScoreLabel(score)}
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
      pdf.setTextColor(255, 255, 255);
      pdf.text('Platform Maturity Assessment Report', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Overall Score
      pdf.setFontSize(14);
      pdf.setTextColor(180, 180, 180);
      pdf.text('Overall Maturity Score', pageWidth / 2, y, { align: 'center' });
      y += 10;

      pdf.setFontSize(36);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${assessment.overallScore.toFixed(1)}`, pageWidth / 2, y, { align: 'center' });
      y += 8;

      pdf.setFontSize(12);
      pdf.setTextColor(180, 180, 180);
      pdf.text(`out of 5 - ${getScoreLabel(assessment.overallScore)}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Executive Summary
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Executive Summary', 20, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, pageWidth - 40);
      pdf.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 10;

      // Layer Scores
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Maturity by Layer', 20, y);
      y += 10;

      const layers = [
        { key: 'platformServices', label: 'Platform Services', color: [200, 170, 80] },
        { key: 'cloudGovernance', label: 'Cloud Governance', color: [100, 120, 200] },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture', color: [180, 180, 180] },
        { key: 'productExecution', label: 'Product & Client Execution', color: [230, 230, 230] },
      ];

      layers.forEach((layer) => {
        const score = assessment.layerScores[layer.key];
        const barWidth = (score / 5) * 100;

        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.text(layer.label, 20, y);
        pdf.text(`${score.toFixed(1)}/5 - ${getScoreLabel(score)}`, pageWidth - 20, y, { align: 'right' });
        y += 5;

        // Background bar
        pdf.setFillColor(60, 60, 60);
        pdf.roundedRect(20, y, 100, 4, 2, 2, 'F');

        // Progress bar
        pdf.setFillColor(...layer.color);
        pdf.roundedRect(20, y, barWidth, 4, 2, 2, 'F');
        y += 12;
      });

      y += 5;

      // Recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Top Recommendations', 20, y);
      y += 10;

      assessment.recommendations.forEach((rec, index) => {
        // Check if we need a new page
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(200, 170, 80);
        pdf.text(`${index + 1}. ${rec.title}`, 20, y);
        y += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(180, 180, 180);
        const descLines = pdf.splitTextToSize(rec.description, pageWidth - 45);
        pdf.text(descLines, 25, y);
        y += descLines.length * 4 + 3;

        pdf.setTextColor(200, 170, 80);
        const impactLines = pdf.splitTextToSize(`Impact: ${rec.impact}`, pageWidth - 45);
        pdf.text(impactLines, 25, y);
        y += impactLines.length * 4 + 8;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
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
      <div
        className="rounded-xl shadow-lg p-8"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: 'var(--foreground)' }}
        >
          Platform Maturity Assessment Report
        </h1>

        <OverallScoreRing score={assessment.overallScore} />

        {/* Executive Summary */}
        <div
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <h2 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            Executive Summary
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>{assessment.executiveSummary}</p>
        </div>
      </div>

      {/* Layer Scores - Ring Charts */}
      <div
        className="rounded-xl shadow-lg p-8"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <h2
          className="text-xl font-bold mb-6 text-center"
          style={{ color: 'var(--foreground)' }}
        >
          Maturity by Layer
        </h2>
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
      <div
        className="rounded-xl shadow-lg p-8"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <h2
          className="text-xl font-bold mb-6"
          style={{ color: 'var(--foreground)' }}
        >
          Top Recommendations
        </h2>
        <div className="space-y-4">
          {assessment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--muted)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shadow-md"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {rec.title}
                  </h3>
                  <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {rec.description}
                  </p>
                  <p
                    className="text-sm mt-2 font-medium"
                    style={{ color: 'var(--ring)' }}
                  >
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
          className="px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 border"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--muted-foreground)'
          }}
        >
          <RotateCcw size={18} />
          Start New Assessment
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-6 py-2.5 rounded-lg transition-all font-medium shadow-md flex items-center gap-2 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)'
          }}
        >
          <Download size={18} />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 border"
          style={{
            borderColor: 'var(--ring)',
            color: 'var(--ring)'
          }}
        >
          <Share2 size={18} />
          Share Results
        </button>
      </div>
    </div>
  );
}
