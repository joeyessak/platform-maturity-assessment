import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  Cog,
  Shield,
  Building2,
  Rocket,
  Share2,
  RotateCcw,
  Download,
  TrendingUp,
  AlertTriangle,
  Target
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
  },
  cloudGovernance: {
    Icon: Shield,
    description: 'Cost management, Access controls',
  },
  portfolioArchitecture: {
    Icon: Building2,
    description: 'Service standardization, Tech choices',
  },
  productExecution: {
    Icon: Rocket,
    description: 'Delivery visibility, AI readiness',
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

const INDUSTRY_BENCHMARK = 3.8;
const TARGET_STATE = 4.0;

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

function getLowestScoringLayer(layerScores) {
  const entries = Object.entries(layerScores);
  const lowest = entries.reduce((a, b) => a[1] < b[1] ? a : b);
  return { key: lowest[0], label: layerLabels[lowest[0]], score: lowest[1] };
}

function getHighestScoringLayer(layerScores) {
  const entries = Object.entries(layerScores);
  const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  return { key: highest[0], label: layerLabels[highest[0]], score: highest[1] };
}

// Ring Progress Component with Gradient
function RingProgress({ score, layerKey, label, config, analysis, delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 120;
  const strokeWidth = 10;
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
      className="flex flex-col p-6 rounded-xl"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
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
            <Icon size={20} style={{ color: colors.text }} strokeWidth={1.5} />
            <span className="text-xl font-bold mt-1" style={{ color: colors.text }}>
              {animatedScore.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{label}</div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colors.text, color: '#FFFFFF' }}
            >
              {getMaturityLabel(score)}
            </span>
          </div>
          {analysis && (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>Signal: </span>
                <span style={{ color: 'var(--muted-foreground)' }}>{analysis.signal}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: '#DC2626' }}>Risk: </span>
                <span style={{ color: 'var(--muted-foreground)' }}>{analysis.riskExposure}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: '#16A34A' }}>Impact: </span>
                <span style={{ color: 'var(--muted-foreground)' }}>{analysis.commercialImpact}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Overall Score Ring
function OverallScoreRing({ score, executiveInterpretation }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const size = 220;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (animatedScore / 5) * 100;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = getMaturityColors(score);
  const delta = TARGET_STATE - score;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setAnimatedScore(score), 200);
  }, [score]);

  return (
    <div className="flex flex-col items-center p-10 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
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
          <span className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
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

      {/* Executive Interpretation */}
      {executiveInterpretation && (
        <p
          className="mt-6 text-center text-base font-medium max-w-md"
          style={{ color: 'var(--foreground)' }}
        >
          {executiveInterpretation}
        </p>
      )}

      {/* Maturity Delta */}
      <div className="mt-8 pt-6 border-t w-full" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Current State</div>
            <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{score.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Target for AI Scale</div>
            <div className="text-xl font-bold" style={{ color: '#16A34A' }}>{TARGET_STATE.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Delta Required</div>
            <div className="text-xl font-bold" style={{ color: delta > 0 ? '#EA580C' : '#16A34A' }}>
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Commercial Readiness Section
function CommercialReadiness({ lowestLayer }) {
  return (
    <div className="p-8 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
      <h3 className="text-section-label mb-6">Commercial Readiness Assessment</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: '#DC2626' }} />
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>If Maturity Remains Unchanged</span>
          </div>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#DC2626' }}>•</span>
              AI initiatives scale unevenly across the portfolio
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#DC2626' }}>•</span>
              Governance gaps increase renewal and audit risk
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#DC2626' }}>•</span>
              Technical debt compounds, constraining feature velocity
            </li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: '#16A34A' }} />
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>If Maturity Advances to Target</span>
          </div>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#16A34A' }}>•</span>
              Predictable AI deployment and scaling patterns
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#16A34A' }}>•</span>
              Reduced compliance friction and audit exposure
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#16A34A' }}>•</span>
              Accelerated feature velocity and market responsiveness
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
        <Target size={18} style={{ color: 'var(--muted-foreground)' }} />
        <div className="text-sm">
          <span style={{ color: 'var(--muted-foreground)' }}>Primary Investment Domain: </span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{lowestLayer.label}</span>
          <span style={{ color: 'var(--muted-foreground)' }}> | Estimated Transformation Window: </span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>6-12 months</span>
        </div>
      </div>
    </div>
  );
}

// Benchmark Comparison
function BenchmarkComparison({ score }) {
  const diff = score - INDUSTRY_BENCHMARK;
  const isAbove = diff >= 0;

  return (
    <div className="flex items-center justify-center gap-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="text-center">
        <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Industry Benchmark</div>
        <div className="text-lg font-bold" style={{ color: 'var(--muted-foreground)' }}>{INDUSTRY_BENCHMARK}</div>
      </div>
      <div className="h-8 w-px" style={{ backgroundColor: 'var(--border)' }} />
      <div className="text-center">
        <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Your Organization</div>
        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{score.toFixed(1)}</div>
      </div>
      <div className="h-8 w-px" style={{ backgroundColor: 'var(--border)' }} />
      <div className="text-center">
        <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Variance</div>
        <div className="text-lg font-bold" style={{ color: isAbove ? '#16A34A' : '#DC2626' }}>
          {isAbove ? '+' : ''}{diff.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

export default function Report({ assessment, onRestart }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const lowestLayer = getLowestScoringLayer(assessment.layerScores);
  const highestLayer = getHighestScoringLayer(assessment.layerScores);

  const handleShare = () => {
    const text = `Platform Maturity Assessment Results:\n\nOverall Score: ${assessment.overallScore}/5 - ${getMaturityLabel(assessment.overallScore)}\n\n${assessment.executiveInterpretation || assessment.executiveSummary}\n\nPrepared by Joey Essak`;
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
      const addFooter = () => {
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        pdf.text('Prepared by Joey Essak', margin, pageHeight - 15);
        pdf.text('joey.essak@gmail.com | linkedin.com/in/joeyessak', pageWidth - margin, pageHeight - 15, { align: 'right' });
      };

      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
      };

      const drawGradientBar = (x, y, width, height, colors) => {
        pdf.setFillColor(...hexToRgb(colors.start));
        pdf.roundedRect(x, y, width, height, 2, 2, 'F');
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
      pdf.text('Enterprise Advisory Diagnostic', pageWidth / 2, y, { align: 'center' });

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
      y += 25;

      // Overall Score Section
      const overallColors = getMaturityColors(assessment.overallScore);
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('OVERALL MATURITY SCORE', margin, y);
      y += 18;

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
      y += 18;

      // Executive Interpretation
      if (assessment.executiveInterpretation) {
        pdf.setFontSize(12);
        pdf.setTextColor(15, 23, 42);
        const interpLines = pdf.splitTextToSize(assessment.executiveInterpretation, contentWidth);
        pdf.text(interpLines, margin, y);
        y += interpLines.length * 6 + 12;
      }

      // Maturity Delta Box
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
      y += 8;

      const delta = TARGET_STATE - assessment.overallScore;
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Current: ${assessment.overallScore.toFixed(1)}`, margin + 10, y + 4);
      pdf.text(`Target for AI Scale: ${TARGET_STATE.toFixed(1)}`, margin + 55, y + 4);
      pdf.setTextColor(...hexToRgb(delta > 0 ? '#EA580C' : '#16A34A'));
      pdf.text(`Delta: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}`, margin + 115, y + 4);
      y += 30;

      // Industry Benchmark
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Industry Benchmark: ${INDUSTRY_BENCHMARK} | Your Organization: ${assessment.overallScore.toFixed(1)}`, margin, y);
      y += 18;

      // Executive Summary
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXECUTIVE SUMMARY', margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(51, 65, 85);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, contentWidth);
      pdf.text(summaryLines, margin, y);
      y += summaryLines.length * 6 + 18;

      // Commercial Readiness Assessment
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('COMMERCIAL READINESS ASSESSMENT', margin, y);
      y += 12;

      pdf.setFontSize(10);
      pdf.setTextColor(220, 38, 38);
      pdf.text('If maturity remains unchanged:', margin, y);
      y += 6;
      pdf.setTextColor(71, 85, 105);
      pdf.text('• AI initiatives scale unevenly', margin + 5, y);
      y += 5;
      pdf.text('• Governance gaps increase renewal risk', margin + 5, y);
      y += 5;
      pdf.text('• Technical debt compounds across portfolio', margin + 5, y);
      y += 10;

      pdf.setTextColor(22, 163, 74);
      pdf.text('If maturity advances to target state:', margin, y);
      y += 6;
      pdf.setTextColor(71, 85, 105);
      pdf.text('• Predictable AI deployment', margin + 5, y);
      y += 5;
      pdf.text('• Reduced audit exposure', margin + 5, y);
      y += 5;
      pdf.text('• Accelerated feature velocity', margin + 5, y);

      addFooter();

      // ===== PAGE 3: LAYER BREAKDOWN =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Layer Breakdown', margin, y);
      y += 28;

      const layers = [
        { key: 'platformServices', label: 'Platform Services' },
        { key: 'cloudGovernance', label: 'Cloud Governance' },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture' },
        { key: 'productExecution', label: 'Product & Client Execution' },
      ];

      layers.forEach((layer) => {
        const score = assessment.layerScores[layer.key];
        const colors = getMaturityColors(score);
        const analysis = assessment.layerAnalysis?.[layer.key];

        // Layer header with score
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text(layer.label, margin, y);

        pdf.setFontSize(14);
        pdf.setTextColor(...hexToRgb(colors.text));
        pdf.text(`${score.toFixed(1)} (${getMaturityLabel(score)})`, pageWidth - margin, y, { align: 'right' });
        y += 10;

        // Progress bar
        pdf.setFillColor(209, 213, 219);
        pdf.roundedRect(margin, y, contentWidth, 6, 3, 3, 'F');

        const barWidth = (score / 5) * contentWidth;
        drawGradientBar(margin, y, barWidth, 6, colors);
        y += 14;

        // Signal, Risk, Impact
        if (analysis) {
          pdf.setFontSize(10);
          pdf.setTextColor(71, 85, 105);

          pdf.setTextColor(15, 23, 42);
          pdf.text('Signal: ', margin, y);
          pdf.setTextColor(71, 85, 105);
          const signalLines = pdf.splitTextToSize(analysis.signal, contentWidth - 15);
          pdf.text(signalLines, margin + 15, y);
          y += signalLines.length * 5 + 4;

          pdf.setTextColor(220, 38, 38);
          pdf.text('Risk: ', margin, y);
          pdf.setTextColor(71, 85, 105);
          const riskLines = pdf.splitTextToSize(analysis.riskExposure, contentWidth - 12);
          pdf.text(riskLines, margin + 12, y);
          y += riskLines.length * 5 + 4;

          pdf.setTextColor(22, 163, 74);
          pdf.text('Impact: ', margin, y);
          pdf.setTextColor(71, 85, 105);
          const impactLines = pdf.splitTextToSize(analysis.commercialImpact, contentWidth - 17);
          pdf.text(impactLines, margin + 17, y);
          y += impactLines.length * 5 + 12;
        } else {
          y += 8;
        }
      });

      addFooter();

      // ===== PAGE 4: STRATEGIC RECOMMENDATIONS =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Strategic Recommendations', margin, y);
      y += 28;

      assessment.recommendations.forEach((rec, index) => {
        if (y > pageHeight - 80) {
          pdf.addPage();
          y = margin;
          addFooter();
        }

        // Recommendation number circle
        pdf.setFillColor(15, 23, 42);
        pdf.circle(margin + 5, y + 5, 5, 'F');
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.text(String(index + 1), margin + 5, y + 6.5, { align: 'center' });

        // Title
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text(rec.title, margin + 16, y + 6);
        y += 18;

        // Strategic Action
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Strategic Action', margin, y);
        y += 6;
        pdf.setTextColor(51, 65, 85);
        const actionText = rec.strategicAction || rec.description;
        const actionLines = pdf.splitTextToSize(actionText, contentWidth);
        pdf.text(actionLines, margin, y);
        y += actionLines.length * 5 + 8;

        // Risk of Inaction
        pdf.setFontSize(10);
        pdf.setTextColor(220, 38, 38);
        pdf.text('Risk of Inaction', margin, y);
        y += 6;
        pdf.setTextColor(51, 65, 85);
        const riskText = rec.riskOfInaction || 'Continued operational friction and missed optimization opportunities.';
        const riskLines = pdf.splitTextToSize(riskText, contentWidth);
        pdf.text(riskLines, margin, y);
        y += riskLines.length * 5 + 8;

        // Expected Outcome
        pdf.setFontSize(10);
        pdf.setTextColor(22, 163, 74);
        pdf.text('Expected Commercial Outcome', margin, y);
        y += 6;
        pdf.setTextColor(51, 65, 85);
        const outcomeText = rec.expectedOutcome || rec.impact;
        const outcomeLines = pdf.splitTextToSize(outcomeText, contentWidth);
        pdf.text(outcomeLines, margin, y);
        y += outcomeLines.length * 5 + 18;
      });

      addFooter();

      // ===== PAGE 5: IMPLEMENTATION ROADMAP =====
      pdf.addPage();
      y = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Implementation Roadmap Overview', margin, y);
      y += 28;

      const phases = [
        {
          title: 'Phase 1 (0-3 Months)',
          items: ['Governance foundation establishment', 'Access control standardization', 'Cost attribution framework']
        },
        {
          title: 'Phase 2 (3-6 Months)',
          items: ['Architecture policy institutionalization', 'CI/CD convergence across teams', 'Observability baseline deployment']
        },
        {
          title: 'Phase 3 (6-12 Months)',
          items: ['AI workload scaling enablement', 'Platform observability expansion', 'Enterprise integration maturation']
        }
      ];

      phases.forEach((phase) => {
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text(phase.title, margin, y);
        y += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        phase.items.forEach((item) => {
          pdf.text(`• ${item}`, margin + 5, y);
          y += 6;
        });
        y += 12;
      });

      // Primary Investment Domain
      y += 10;
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');
      y += 12;
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Primary Investment Domain: ${lowestLayer.label}`, margin + 10, y);
      pdf.text('Transformation Window: 6-12 months', pageWidth - margin - 10, y, { align: 'right' });
      y += 25;

      // Closing statement
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      const closingLines = pdf.splitTextToSize('Platform maturity is not a tooling initiative. It is an operating model transformation.', contentWidth);
      pdf.text(closingLines, pageWidth / 2, y, { align: 'center' });

      addFooter();

      pdf.save('platform-maturity-executive-review.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-14">
      {/* Header Card */}
      <div className="card-executive p-12">
        <h1 className="text-h1 text-center mb-12" style={{ color: 'var(--foreground)' }}>
          Platform Maturity Assessment Report
        </h1>

        <OverallScoreRing
          score={assessment.overallScore}
          executiveInterpretation={assessment.executiveInterpretation}
        />

        {/* Industry Benchmark */}
        <div className="mt-10">
          <BenchmarkComparison score={assessment.overallScore} />
        </div>

        {/* Executive Summary */}
        <div className="mt-10 p-8 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
          <h2 className="text-section-label mb-4">Executive Summary</h2>
          <p className="text-body" style={{ color: 'var(--card-foreground)' }}>
            {assessment.executiveSummary}
          </p>
        </div>

        {/* Commercial Readiness */}
        <div className="mt-10">
          <CommercialReadiness lowestLayer={lowestLayer} />
        </div>
      </div>

      {/* Layer Scores */}
      <div className="card-executive p-12">
        <h2 className="text-h2 text-center mb-10" style={{ color: 'var(--foreground)' }}>
          Maturity by Layer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(assessment.layerScores).map(([key, score], index) => (
            <RingProgress
              key={key}
              layerKey={key}
              score={score}
              label={layerLabels[key]}
              config={layerConfig[key]}
              analysis={assessment.layerAnalysis?.[key]}
              delay={300 + index * 150}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card-executive p-12">
        <h2 className="text-h2 mb-10" style={{ color: 'var(--foreground)' }}>
          Strategic Recommendations
        </h2>
        <div className="space-y-8">
          {assessment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border"
              style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-5">
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--foreground)' }}>
                    {rec.title}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        Strategic Action
                      </div>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                        {rec.strategicAction || rec.description}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: '#DC2626' }}>
                        Risk of Inaction
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {rec.riskOfInaction || 'Continued operational friction and missed optimization opportunities.'}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: '#16A34A' }}>
                        Expected Commercial Outcome
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {rec.expectedOutcome || rec.impact}
                      </p>
                    </div>
                  </div>
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
