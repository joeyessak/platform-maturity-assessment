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

// Layer configuration
const layerLabels = {
  platformServices: 'Platform Services',
  cloudGovernance: 'Cloud Governance',
  portfolioArchitecture: 'Portfolio Architecture',
  productExecution: 'Product & Client Execution',
};

const layerConfig = {
  platformServices: {
    Icon: Cog,
    description: 'CI/CD, Infrastructure as Code',
    commercialImpact: 'Delivery consistency and operational efficiency',
  },
  cloudGovernance: {
    Icon: Shield,
    description: 'Cost management, Access controls',
    commercialImpact: 'Cost optimization and compliance posture',
  },
  portfolioArchitecture: {
    Icon: Building2,
    description: 'Service standardization, Tech choices',
    commercialImpact: 'Technical debt and scalability readiness',
  },
  productExecution: {
    Icon: Rocket,
    description: 'Delivery visibility, AI readiness',
    commercialImpact: 'Market responsiveness and innovation capacity',
  },
};

// Maturity gradient colors
const maturityColors = {
  adhoc: { start: '#DC2626', end: '#EF4444', text: '#DC2626' },
  basic: { start: '#FB923C', end: '#FBBF24', text: '#EA580C' },
  developing: { start: '#FBBF24', end: '#FACC15', text: '#CA8A04' },
  mature: { start: '#4ADE80', end: '#22C55E', text: '#16A34A' },
  optimized: { start: '#22C55E', end: '#16A34A', text: '#15803D' },
};

function getMaturityLevel(score) {
  if (score >= 4.5) return 'optimized';
  if (score >= 3.5) return 'mature';
  if (score >= 2.5) return 'developing';
  if (score >= 1.5) return 'basic';
  return 'adhoc';
}

function getMaturityLabel(score) {
  if (score >= 4.5) return 'Optimized';
  if (score >= 3.5) return 'Mature';
  if (score >= 2.5) return 'Developing';
  if (score >= 1.5) return 'Basic';
  return 'Ad-hoc';
}

function getMaturityColors(score) {
  return maturityColors[getMaturityLevel(score)];
}

// Ring Progress Component with Gradient
function RingProgress({ score, layerKey, label, config, delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;
  const Icon = config.Icon;
  const colors = getMaturityColors(score);
  const gradientId = `gradient-${layerKey}`;

  useEffect(() => {
    const visibleTimer = setTimeout(() => setIsVisible(true), delay);
    const scoreTimer = setTimeout(() => setAnimatedScore(score), delay + 100);
    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(scoreTimer);
    };
  }, [score, delay]);

  return (
    <div
      className="flex flex-col items-center p-6 rounded-xl"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--ring-track)"
            strokeWidth={strokeWidth}
            fill="none"
          />
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
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={24} style={{ color: colors.text }} strokeWidth={1.5} />
          <span className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
            {animatedScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{label}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {config.description}
        </div>
        <div
          className="text-xs font-semibold mt-3 px-4 py-1.5 rounded-full inline-block"
          style={{ backgroundColor: colors.text, color: '#FFFFFF' }}
        >
          {getMaturityLabel(score)}
        </div>
      </div>
    </div>
  );
}

// Overall Score Ring
function OverallScoreRing({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 220;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = getMaturityColors(score);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setAnimatedScore(score), 200);
  }, [score]);

  return (
    <div className="flex flex-col items-center p-8 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="text-section-label mb-6">Overall Maturity Score</div>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="overall-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--ring-track)"
            strokeWidth={strokeWidth}
            fill="none"
          />
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
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-score" style={{ color: colors.text }}>
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-base mt-4" style={{ color: 'var(--muted-foreground)' }}>
            out of 5
          </span>
        </div>
      </div>
      <div
        className="mt-6 px-6 py-2 rounded-full text-sm font-semibold"
        style={{ backgroundColor: colors.text, color: '#FFFFFF' }}
      >
        {getMaturityLabel(score)}
      </div>
    </div>
  );
}

export default function Report({ assessment, onRestart }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleShare = () => {
    const text = `Platform Maturity Assessment Results:\n\nOverall Score: ${assessment.overallScore}/5 - ${getMaturityLabel(assessment.overallScore)}\n\n${assessment.executiveSummary}\n\nPrepared by Joey Essak`;
    if (navigator.share) {
      navigator.share({ title: 'Platform Maturity Assessment', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Summary copied to clipboard!');
    }
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      const contentWidth = pageWidth - margin * 2;

      // Helper functions
      const addFooter = (pageNum) => {
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        pdf.text('Prepared by Joey Essak', margin, pageHeight - 15);
        pdf.text('joey.essak@gmail.com | linkedin.com/in/joeyessak', pageWidth - margin, pageHeight - 15, { align: 'right' });
      };

      const drawGradientBar = (x, y, width, height, colors) => {
        pdf.setFillColor(...hexToRgb(colors.start));
        pdf.roundedRect(x, y, width, height, 2, 2, 'F');
      };

      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
      };

      // ===== PAGE 1: COVER PAGE =====
      let y = 80;
      pdf.setFontSize(32);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Platform Maturity', pageWidth / 2, y, { align: 'center' });
      y += 14;
      pdf.text('Executive Review', pageWidth / 2, y, { align: 'center' });

      y += 30;
      pdf.setFontSize(14);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Platform Engineering & AI Readiness Assessment', pageWidth / 2, y, { align: 'center' });

      y += 60;
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Prepared by', pageWidth / 2, y, { align: 'center' });
      y += 12;
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Joey Essak', pageWidth / 2, y, { align: 'center' });
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Platform & AI Strategy', pageWidth / 2, y, { align: 'center' });

      y += 20;
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text('joey.essak@gmail.com', pageWidth / 2, y, { align: 'center' });
      y += 6;
      pdf.text('linkedin.com/in/joeyessak', pageWidth / 2, y, { align: 'center' });

      // ===== PAGE 2: EXECUTIVE SNAPSHOT =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Executive Snapshot', margin, y);
      y += 20;

      // Overall Score Section
      const overallColors = getMaturityColors(assessment.overallScore);
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('OVERALL MATURITY SCORE', margin, y);
      y += 15;

      pdf.setFontSize(48);
      pdf.setTextColor(...hexToRgb(overallColors.text));
      pdf.text(assessment.overallScore.toFixed(1), margin, y);

      pdf.setFontSize(14);
      pdf.setTextColor(100, 116, 139);
      pdf.text('out of 5', margin + 45, y - 5);
      y += 10;

      // Status badge
      pdf.setFillColor(...hexToRgb(overallColors.text));
      pdf.roundedRect(margin, y, 35, 8, 4, 4, 'F');
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text(getMaturityLabel(assessment.overallScore), margin + 17.5, y + 5.5, { align: 'center' });
      y += 25;

      // Executive Summary
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXECUTIVE SUMMARY', margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(51, 65, 85);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, contentWidth);
      pdf.text(summaryLines, margin, y);
      y += summaryLines.length * 6 + 20;

      // Strategic Insights
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('STRATEGIC INSIGHTS', margin, y);
      y += 12;

      // Find highest and lowest scores
      const scores = Object.entries(assessment.layerScores);
      const highest = scores.reduce((a, b) => a[1] > b[1] ? a : b);
      const lowest = scores.reduce((a, b) => a[1] < b[1] ? a : b);

      const insights = [
        { label: 'Primary Strength', value: layerLabels[highest[0]], score: highest[1] },
        { label: 'Primary Risk', value: layerLabels[lowest[0]], score: lowest[1] },
        { label: 'Strategic Focus', value: 'AI commercialization and platform modernization', score: null },
      ];

      insights.forEach((insight) => {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(insight.label, margin, y);
        y += 6;
        pdf.setFontSize(12);
        pdf.setTextColor(15, 23, 42);
        const text = insight.score ? `${insight.value} (${insight.score.toFixed(1)})` : insight.value;
        pdf.text(text, margin, y);
        y += 12;
      });

      addFooter(2);

      // ===== PAGE 3: LAYER BREAKDOWN =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Layer Breakdown', margin, y);
      y += 25;

      const layers = [
        { key: 'platformServices', label: 'Platform Services' },
        { key: 'cloudGovernance', label: 'Cloud Governance' },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture' },
        { key: 'productExecution', label: 'Product & Client Execution' },
      ];

      layers.forEach((layer) => {
        const score = assessment.layerScores[layer.key];
        const colors = getMaturityColors(score);
        const config = layerConfig[layer.key];

        // Layer header with score
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text(layer.label, margin, y);

        pdf.setFontSize(14);
        pdf.setTextColor(...hexToRgb(colors.text));
        pdf.text(`${score.toFixed(1)} — ${getMaturityLabel(score)}`, pageWidth - margin, y, { align: 'right' });
        y += 8;

        // Progress bar
        pdf.setFillColor(229, 231, 235);
        pdf.roundedRect(margin, y, contentWidth, 6, 3, 3, 'F');

        const barWidth = (score / 5) * contentWidth;
        drawGradientBar(margin, y, barWidth, 6, colors);
        y += 14;

        // Commercial impact
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Commercial Impact: ${config.commercialImpact}`, margin, y);
        y += 20;
      });

      addFooter(3);

      // ===== PAGE 4: STRATEGIC RECOMMENDATIONS =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Strategic Recommendations', margin, y);
      y += 25;

      assessment.recommendations.forEach((rec, index) => {
        if (y > pageHeight - 60) {
          pdf.addPage();
          y = margin;
          addFooter(pdf.internal.getNumberOfPages());
        }

        // Recommendation number
        pdf.setFillColor(15, 23, 42);
        pdf.circle(margin + 4, y + 4, 4, 'F');
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(String(index + 1), margin + 4, y + 5.5, { align: 'center' });

        // Title
        pdf.setFontSize(13);
        pdf.setTextColor(15, 23, 42);
        pdf.text(rec.title, margin + 14, y + 5);
        y += 14;

        // Description
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        const descLines = pdf.splitTextToSize(rec.description, contentWidth - 14);
        pdf.text(descLines, margin + 14, y);
        y += descLines.length * 5 + 6;

        // Impact
        pdf.setFontSize(10);
        pdf.setTextColor(22, 163, 74);
        const impactLines = pdf.splitTextToSize(`Business Impact: ${rec.impact}`, contentWidth - 14);
        pdf.text(impactLines, margin + 14, y);
        y += impactLines.length * 5 + 15;
      });

      addFooter(4);

      pdf.save('platform-maturity-executive-review.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header Card */}
      <div className="card-executive p-10">
        <h1 className="text-h1 text-center mb-10" style={{ color: 'var(--foreground)' }}>
          Platform Maturity Assessment Report
        </h1>

        <OverallScoreRing score={assessment.overallScore} />

        {/* Executive Summary */}
        <div className="mt-10 p-6 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
          <h2 className="text-section-label mb-4">Executive Summary</h2>
          <p className="text-body" style={{ color: 'var(--card-foreground)' }}>
            {assessment.executiveSummary}
          </p>
        </div>
      </div>

      {/* Layer Scores */}
      <div className="card-executive p-10">
        <h2 className="text-h2 text-center mb-10" style={{ color: 'var(--foreground)' }}>
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
              delay={300 + index * 150}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card-executive p-10">
        <h2 className="text-h2 mb-8" style={{ color: 'var(--foreground)' }}>
          Strategic Recommendations
        </h2>
        <div className="space-y-6">
          {assessment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                    {rec.title}
                  </h3>
                  <p className="mt-2 text-body" style={{ color: 'var(--muted-foreground)' }}>
                    {rec.description}
                  </p>
                  <p className="mt-3 text-sm font-medium" style={{ color: '#16A34A' }}>
                    Impact: {rec.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 pb-12">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <RotateCcw size={18} />
          New Assessment
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
        >
          <Download size={18} />
          {isGeneratingPDF ? 'Generating...' : 'Download Executive Report'}
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <Share2 size={18} />
          Share Results
        </button>
      </div>
    </div>
  );
}
