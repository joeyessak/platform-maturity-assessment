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
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

      // ===== LAYOUT SYSTEM - 4-Page Executive Format =====
      const PAGE = {
        width: pdf.internal.pageSize.getWidth(),   // 215.9mm
        height: pdf.internal.pageSize.getHeight(), // 279.4mm
      };

      // 0.75" margins (19mm)
      const MARGIN = {
        top: 19,
        bottom: 19,
        left: 19,
        right: 19,
      };

      const CONTENT = {
        width: PAGE.width - MARGIN.left - MARGIN.right,  // ~178mm
        height: PAGE.height - MARGIN.top - MARGIN.bottom,
      };

      // Two-column layout
      const COL = {
        width: (CONTENT.width - 6) / 2,  // 6mm gutter
        gutter: 6,
      };

      // Spacing tokens
      const SPACE = {
        section: 10,
        subsection: 6,
        paragraph: 3,
        line: 4,
      };

      // Typography scale (SF Pro / Inter style)
      const FONT = {
        h1: 22,
        h2: 14,
        h3: 10,
        body: 9,
        small: 8,
        label: 7,
      };

      let y = MARGIN.top;

      // ===== HELPER FUNCTIONS =====
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
      };

      const truncateText = (text, maxChars) => {
        if (!text || text.length <= maxChars) return text;
        return text.substring(0, maxChars - 3) + '...';
      };

      const addFooter = () => {
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(130, 130, 130);
        pdf.text('Prepared by Joey Essak', MARGIN.left, PAGE.height - MARGIN.bottom + 6);
        pdf.text('joey.essak@gmail.com', PAGE.width - MARGIN.right, PAGE.height - MARGIN.bottom + 6, { align: 'right' });
      };

      // Draw circular score ring
      const drawRing = (centerX, centerY, radius, score, strokeWidth = 3) => {
        const colors = getMaturityColors(score);
        const percentage = (score / 5);

        // Draw track (background circle)
        pdf.setDrawColor(209, 213, 219); // --ring-track
        pdf.setLineWidth(strokeWidth);
        pdf.circle(centerX, centerY, radius, 'S');

        // Draw score arc
        // jsPDF doesn't have arc, so we simulate with many small line segments
        pdf.setDrawColor(...hexToRgb(colors.start));
        pdf.setLineWidth(strokeWidth);

        const startAngle = -90; // Start from top
        const endAngle = startAngle + (percentage * 360);
        const segments = Math.max(Math.floor(percentage * 36), 1);

        for (let i = 0; i < segments; i++) {
          const angle1 = (startAngle + (i / segments) * (endAngle - startAngle)) * (Math.PI / 180);
          const angle2 = (startAngle + ((i + 1) / segments) * (endAngle - startAngle)) * (Math.PI / 180);

          const x1 = centerX + radius * Math.cos(angle1);
          const y1 = centerY + radius * Math.sin(angle1);
          const x2 = centerX + radius * Math.cos(angle2);
          const y2 = centerY + radius * Math.sin(angle2);

          pdf.line(x1, y1, x2, y2);
        }

        return colors;
      };

      // Draw card background
      const drawCard = (x, y, width, height, radiusPx = 3) => {
        pdf.setFillColor(248, 250, 252); // Light gray
        pdf.roundedRect(x, y, width, height, radiusPx, radiusPx, 'F');
      };

      // Draw maturity chip/badge
      const drawChip = (x, y, label, colors) => {
        const chipWidth = pdf.getTextWidth(label) + 4;
        pdf.setFillColor(...hexToRgb(colors.text));
        pdf.roundedRect(x, y, chipWidth, 4.5, 2, 2, 'F');
        pdf.setFontSize(6);
        pdf.setTextColor(255, 255, 255);
        pdf.text(label, x + chipWidth / 2, y + 3.2, { align: 'center' });
        return chipWidth;
      };

      // ===== PAGE 1: COVER (Minimal, No Footer) =====
      y = 85;

      pdf.setFontSize(26);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Platform Maturity', PAGE.width / 2, y, { align: 'center' });
      y += 9;
      pdf.text('Executive Review', PAGE.width / 2, y, { align: 'center' });
      y += 18;

      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Enterprise Advisory Diagnostic', PAGE.width / 2, y, { align: 'center' });
      y += 40;

      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Prepared by', PAGE.width / 2, y, { align: 'center' });
      y += 7;

      pdf.setFontSize(13);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Joey Essak', PAGE.width / 2, y, { align: 'center' });
      y += 5;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Platform & AI Strategy', PAGE.width / 2, y, { align: 'center' });
      y += 10;

      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 130);
      pdf.text('joey.essak@gmail.com  |  linkedin.com/in/joeyessak', PAGE.width / 2, y, { align: 'center' });

      // ===== PAGE 2: EXECUTIVE SNAPSHOT =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Executive Snapshot', MARGIN.left, y);
      y += SPACE.section;

      // Main card with ring
      const snapshotCardHeight = 65;
      drawCard(MARGIN.left, y, CONTENT.width, snapshotCardHeight);

      const overallColors = getMaturityColors(assessment.overallScore);
      const delta = TARGET_STATE - assessment.overallScore;

      // Draw large ring on left side
      const ringCenterX = MARGIN.left + 30;
      const ringCenterY = y + snapshotCardHeight / 2;
      const ringRadius = 18;
      drawRing(ringCenterX, ringCenterY, ringRadius, assessment.overallScore, 4);

      // Score inside ring
      pdf.setFontSize(18);
      pdf.setTextColor(...hexToRgb(overallColors.text));
      pdf.text(assessment.overallScore.toFixed(1), ringCenterX, ringCenterY + 2, { align: 'center' });
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text('of 5', ringCenterX, ringCenterY + 7, { align: 'center' });

      // Content to the right of ring
      const contentX = MARGIN.left + 62;
      let cardY = y + 10;

      // Maturity label chip
      drawChip(contentX, cardY, getMaturityLabel(assessment.overallScore), overallColors);
      cardY += 10;

      // Executive Interpretation
      if (assessment.executiveInterpretation) {
        pdf.setFontSize(FONT.body);
        pdf.setTextColor(15, 23, 42);
        const interpLines = pdf.splitTextToSize(assessment.executiveInterpretation, CONTENT.width - 70);
        pdf.text(interpLines.slice(0, 2), contentX, cardY);
        cardY += interpLines.slice(0, 2).length * 4;
      }

      // Delta row at bottom of card
      const deltaRowY = y + snapshotCardHeight - 14;
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);

      // Current
      pdf.text('Current', contentX, deltaRowY);
      pdf.setFontSize(FONT.h3);
      pdf.setTextColor(15, 23, 42);
      pdf.text(assessment.overallScore.toFixed(1), contentX, deltaRowY + 5);

      // Target
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Target', contentX + 35, deltaRowY);
      pdf.setFontSize(FONT.h3);
      pdf.setTextColor(22, 163, 74);
      pdf.text(TARGET_STATE.toFixed(1), contentX + 35, deltaRowY + 5);

      // Delta
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Delta', contentX + 70, deltaRowY);
      pdf.setFontSize(FONT.h3);
      pdf.setTextColor(...hexToRgb(delta > 0 ? '#EA580C' : '#16A34A'));
      pdf.text(`${delta > 0 ? '+' : ''}${delta.toFixed(1)}`, contentX + 70, deltaRowY + 5);

      // Benchmark
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Benchmark', contentX + 105, deltaRowY);
      pdf.setFontSize(FONT.h3);
      pdf.setTextColor(100, 116, 139);
      pdf.text(INDUSTRY_BENCHMARK.toString(), contentX + 105, deltaRowY + 5);

      y += snapshotCardHeight + SPACE.section;

      // Executive Summary card
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXECUTIVE SUMMARY', MARGIN.left, y);
      y += SPACE.subsection;

      pdf.setFontSize(FONT.body);
      pdf.setTextColor(51, 65, 85);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, CONTENT.width);
      pdf.text(summaryLines, MARGIN.left, y);
      y += summaryLines.length * SPACE.line + SPACE.section;

      // Commercial Readiness (Two columns)
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('COMMERCIAL READINESS', MARGIN.left, y);
      y += SPACE.subsection;

      const colLeftX = MARGIN.left;
      const colRightX = MARGIN.left + COL.width + COL.gutter;

      // If unchanged
      pdf.setFontSize(FONT.small);
      pdf.setTextColor(220, 38, 38);
      pdf.text('If unchanged:', colLeftX, y);
      pdf.setTextColor(71, 85, 105);
      let leftItemY = y + 5;
      ['AI scales unevenly', 'Governance gaps persist', 'Tech debt compounds'].forEach(item => {
        pdf.text(`•  ${item}`, colLeftX + 2, leftItemY);
        leftItemY += SPACE.paragraph + 1;
      });

      // If advances
      pdf.setTextColor(22, 163, 74);
      pdf.text('If advances:', colRightX, y);
      pdf.setTextColor(71, 85, 105);
      let rightItemY = y + 5;
      ['Predictable AI deployment', 'Reduced audit exposure', 'Faster feature velocity'].forEach(item => {
        pdf.text(`•  ${item}`, colRightX + 2, rightItemY);
        rightItemY += SPACE.paragraph + 1;
      });

      addFooter();

      // ===== PAGE 3: MATURITY BY LAYER (2x2 Grid with Rings) =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Maturity by Layer', MARGIN.left, y);
      y += SPACE.section;

      const layers = [
        { key: 'platformServices', label: 'Platform Services' },
        { key: 'cloudGovernance', label: 'Cloud Governance' },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture' },
        { key: 'productExecution', label: 'Product Execution' },
      ];

      const gridCellWidth = COL.width;
      const gridCellHeight = 55;
      const gridGap = 5;

      layers.forEach((layer, index) => {
        const score = assessment.layerScores[layer.key];
        const colors = getMaturityColors(score);
        const analysis = assessment.layerAnalysis?.[layer.key];

        // Grid position (2x2)
        const col = index % 2;
        const row = Math.floor(index / 2);
        const cellX = MARGIN.left + col * (gridCellWidth + gridGap);
        const cellY = y + row * (gridCellHeight + gridGap);

        // Card background
        drawCard(cellX, cellY, gridCellWidth, gridCellHeight);

        // Mini ring on left
        const miniRingX = cellX + 14;
        const miniRingY = cellY + 16;
        const miniRadius = 10;
        drawRing(miniRingX, miniRingY, miniRadius, score, 2.5);

        // Score inside mini ring
        pdf.setFontSize(10);
        pdf.setTextColor(...hexToRgb(colors.text));
        pdf.text(score.toFixed(1), miniRingX, miniRingY + 1.5, { align: 'center' });

        // Layer name and chip
        const textX = cellX + 30;
        let textY = cellY + 8;

        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(layer.label, textX, textY);
        textY += 6;

        drawChip(textX, textY, getMaturityLabel(score), colors);
        textY += 10;

        // Signal, Risk, Impact (truncated to 110 chars)
        if (analysis) {
          pdf.setFontSize(FONT.label);
          const textWidth = gridCellWidth - 35;

          // Signal
          pdf.setTextColor(100, 116, 139);
          pdf.text('Signal:', textX, textY);
          pdf.setTextColor(71, 85, 105);
          const signalText = truncateText(analysis.signal, 55);
          const signalLines = pdf.splitTextToSize(signalText, textWidth);
          pdf.text(signalLines[0] || '', textX + 12, textY);
          textY += SPACE.paragraph + 1.5;

          // Risk
          pdf.setTextColor(220, 38, 38);
          pdf.text('Risk:', textX, textY);
          pdf.setTextColor(71, 85, 105);
          const riskText = truncateText(analysis.riskExposure, 55);
          const riskLines = pdf.splitTextToSize(riskText, textWidth);
          pdf.text(riskLines[0] || '', textX + 10, textY);
          textY += SPACE.paragraph + 1.5;

          // Impact
          pdf.setTextColor(22, 163, 74);
          pdf.text('Impact:', textX, textY);
          pdf.setTextColor(71, 85, 105);
          const impactText = truncateText(analysis.commercialImpact, 55);
          const impactLines = pdf.splitTextToSize(impactText, textWidth);
          pdf.text(impactLines[0] || '', textX + 13, textY);
        }
      });

      addFooter();

      // ===== PAGE 4: PRIORITIES + ROADMAP (Combined) =====
      pdf.addPage();
      y = MARGIN.top;

      // STRATEGIC PRIORITIES SECTION (Top half)
      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Strategic Priorities', MARGIN.left, y);
      y += SPACE.section;

      const recs = assessment.recommendations;
      const priorityCardWidth = (CONTENT.width - 2 * 4) / 3; // 3 columns with 4mm gaps
      const priorityCardHeight = 52;

      // Three priority cards in a row
      recs.slice(0, 3).forEach((rec, index) => {
        const cardX = MARGIN.left + index * (priorityCardWidth + 4);
        drawCard(cardX, y, priorityCardWidth, priorityCardHeight);

        let innerY = y + 6;

        // Priority number badge
        pdf.setFillColor(15, 23, 42);
        pdf.circle(cardX + 6, innerY, 3, 'F');
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${index + 1}`, cardX + 6, innerY + 1, { align: 'center' });

        // Title
        pdf.setFontSize(FONT.small);
        pdf.setTextColor(15, 23, 42);
        const titleLines = pdf.splitTextToSize(rec.title, priorityCardWidth - 18);
        pdf.text(titleLines[0] || rec.title, cardX + 12, innerY + 1);
        innerY += 9;

        // Strategic Action
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Action', cardX + 5, innerY);
        innerY += 3.5;
        pdf.setTextColor(51, 65, 85);
        const actionText = truncateText(rec.strategicAction || rec.description, 80);
        const actionLines = pdf.splitTextToSize(actionText, priorityCardWidth - 10);
        pdf.text(actionLines.slice(0, 2), cardX + 5, innerY);
        innerY += Math.min(actionLines.length, 2) * 3 + 3;

        // Risk
        pdf.setTextColor(220, 38, 38);
        pdf.text('Risk', cardX + 5, innerY);
        innerY += 3.5;
        pdf.setTextColor(71, 85, 105);
        const riskText = truncateText(rec.riskOfInaction || 'Operational friction.', 60);
        pdf.text(riskText, cardX + 5, innerY);
        innerY += 5;

        // Outcome
        pdf.setTextColor(22, 163, 74);
        pdf.text('Outcome', cardX + 5, innerY);
        innerY += 3.5;
        pdf.setTextColor(71, 85, 105);
        const outcomeText = truncateText(rec.expectedOutcome || rec.impact, 60);
        pdf.text(outcomeText, cardX + 5, innerY);
      });

      y += priorityCardHeight + SPACE.section + 4;

      // TRANSFORMATION ROADMAP SECTION (Bottom half)
      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Transformation Roadmap', MARGIN.left, y);
      y += SPACE.section;

      // Three phase columns
      const phaseWidth = (CONTENT.width - 2 * 4) / 3;
      const phases = [
        { title: 'Phase 1: Foundation', time: '0-3 months', items: ['Governance framework', 'Access controls', 'Cost attribution'] },
        { title: 'Phase 2: Integration', time: '3-6 months', items: ['Architecture policy', 'CI/CD convergence', 'Observability'] },
        { title: 'Phase 3: Scale', time: '6-12 months', items: ['AI enablement', 'Platform expansion', 'Enterprise integration'] },
      ];

      const phaseCardHeight = 40;
      phases.forEach((phase, index) => {
        const cardX = MARGIN.left + index * (phaseWidth + 4);
        drawCard(cardX, y, phaseWidth, phaseCardHeight);

        let innerY = y + 6;

        // Phase title
        pdf.setFontSize(FONT.small);
        pdf.setTextColor(15, 23, 42);
        pdf.text(phase.title, cardX + 5, innerY);
        innerY += 4;

        // Time
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text(phase.time, cardX + 5, innerY);
        innerY += 5;

        // Items
        pdf.setTextColor(71, 85, 105);
        phase.items.forEach(item => {
          pdf.text(`•  ${item}`, cardX + 5, innerY);
          innerY += 3.5;
        });
      });

      y += phaseCardHeight + SPACE.section;

      // Key Metrics row
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('KEY METRICS', MARGIN.left, y);
      y += SPACE.subsection;

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(71, 85, 105);
      const metricsText = 'Deployment frequency  •  Mean time to recovery  •  AI scalability index  •  Compliance rate';
      pdf.text(metricsText, MARGIN.left, y);
      y += SPACE.section;

      // Investment domain
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PRIMARY INVESTMENT DOMAIN', MARGIN.left, y);
      y += SPACE.subsection - 1;

      pdf.setFontSize(FONT.body);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${lowestLayer.label} (${lowestLayer.score.toFixed(1)})  •  Transformation window: 6-12 months`, MARGIN.left, y);

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
