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

      // ===== LAYOUT SYSTEM - Executive Briefing Format =====
      const PAGE = {
        width: pdf.internal.pageSize.getWidth(),   // 215.9mm
        height: pdf.internal.pageSize.getHeight(), // 279.4mm
      };

      // Strict 1-inch margins (25.4mm)
      const MARGIN = {
        top: 25.4,
        bottom: 25.4,
        left: 25.4,
        right: 25.4,
      };

      const CONTENT = {
        width: PAGE.width - MARGIN.left - MARGIN.right,  // ~165mm
        height: PAGE.height - MARGIN.top - MARGIN.bottom,
        maxY: PAGE.height - MARGIN.bottom - 10,
      };

      // Two-column layout
      const COL = {
        width: (CONTENT.width - 8) / 2,  // 8mm gutter
        gutter: 8,
      };

      // Compact spacing tokens
      const SPACE = {
        section: 8,
        subsection: 5,
        paragraph: 3,
        line: 3.5,
      };

      // Typography scale
      const FONT = {
        h1: 24,
        h2: 16,
        h3: 11,
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

      const addFooter = () => {
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(130, 130, 130);
        pdf.text('Prepared by Joey Essak', MARGIN.left, PAGE.height - MARGIN.bottom + 8);
        pdf.text('joey.essak@gmail.com', PAGE.width - MARGIN.right, PAGE.height - MARGIN.bottom + 8, { align: 'right' });
      };

      const drawProgressBar = (x, yPos, width, score, colors) => {
        pdf.setFillColor(220, 220, 220);
        pdf.roundedRect(x, yPos, width, 3, 1.5, 1.5, 'F');
        const barWidth = (score / 5) * width;
        pdf.setFillColor(...hexToRgb(colors.start));
        pdf.roundedRect(x, yPos, barWidth, 3, 1.5, 1.5, 'F');
      };

      // ===== PAGE 1: COVER (Minimal, No Footer) =====
      y = 90;

      pdf.setFontSize(28);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Platform Maturity', PAGE.width / 2, y, { align: 'center' });
      y += 10;
      pdf.text('Executive Review', PAGE.width / 2, y, { align: 'center' });
      y += 20;

      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Enterprise Advisory Diagnostic', PAGE.width / 2, y, { align: 'center' });
      y += 45;

      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Prepared by', PAGE.width / 2, y, { align: 'center' });
      y += 8;

      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Joey Essak', PAGE.width / 2, y, { align: 'center' });
      y += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Platform & AI Strategy', PAGE.width / 2, y, { align: 'center' });
      y += 12;

      pdf.setFontSize(9);
      pdf.setTextColor(130, 130, 130);
      pdf.text('joey.essak@gmail.com  |  linkedin.com/in/joeyessak', PAGE.width / 2, y, { align: 'center' });

      // ===== PAGE 2: EXECUTIVE OVERVIEW (Single Dense Page) =====
      pdf.addPage();
      y = MARGIN.top;

      // Page title
      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Executive Overview', MARGIN.left, y);
      y += SPACE.section + 4;

      // TOP SECTION: Score + Delta (side by side)
      const overallColors = getMaturityColors(assessment.overallScore);
      const delta = TARGET_STATE - assessment.overallScore;

      // Score block (left)
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('OVERALL MATURITY', MARGIN.left, y);

      // Delta block (right aligned)
      pdf.text('DELTA TO TARGET', MARGIN.left + COL.width + COL.gutter, y);
      y += SPACE.subsection;

      // Large score
      pdf.setFontSize(36);
      pdf.setTextColor(...hexToRgb(overallColors.text));
      pdf.text(assessment.overallScore.toFixed(1), MARGIN.left, y);

      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('/ 5', MARGIN.left + 28, y - 2);

      // Status badge inline
      pdf.setFillColor(...hexToRgb(overallColors.text));
      pdf.roundedRect(MARGIN.left + 42, y - 10, 24, 6, 3, 3, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(255, 255, 255);
      pdf.text(getMaturityLabel(assessment.overallScore), MARGIN.left + 54, y - 6, { align: 'center' });

      // Delta display
      const deltaX = MARGIN.left + COL.width + COL.gutter;
      pdf.setFontSize(24);
      pdf.setTextColor(...hexToRgb(delta > 0 ? '#EA580C' : '#16A34A'));
      pdf.text(`${delta > 0 ? '+' : ''}${delta.toFixed(1)}`, deltaX, y);

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`to reach ${TARGET_STATE.toFixed(1)} target`, deltaX + 22, y - 2);

      y += 6;

      // Industry Benchmark (subtle)
      pdf.setFontSize(FONT.small);
      pdf.setTextColor(130, 130, 130);
      pdf.text(`Industry Benchmark: ${INDUSTRY_BENCHMARK}`, MARGIN.left, y);
      y += SPACE.section;

      // Executive Interpretation
      if (assessment.executiveInterpretation) {
        pdf.setFontSize(FONT.body + 1);
        pdf.setTextColor(15, 23, 42);
        const interpLines = pdf.splitTextToSize(assessment.executiveInterpretation, CONTENT.width * 0.9);
        pdf.text(interpLines, MARGIN.left, y);
        y += interpLines.length * 4 + SPACE.section;
      }

      // MIDDLE SECTION: Executive Summary
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXECUTIVE SUMMARY', MARGIN.left, y);
      y += SPACE.subsection;

      pdf.setFontSize(FONT.body);
      pdf.setTextColor(51, 65, 85);
      const summaryLines = pdf.splitTextToSize(assessment.executiveSummary, CONTENT.width * 0.85);
      pdf.text(summaryLines, MARGIN.left, y);
      y += summaryLines.length * 3.5 + SPACE.section;

      // BOTTOM SECTION: Commercial Readiness (Two Columns)
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('COMMERCIAL READINESS ASSESSMENT', MARGIN.left, y);
      y += SPACE.subsection + 2;

      const colLeftX = MARGIN.left;
      const colRightX = MARGIN.left + COL.width + COL.gutter;
      const commercialY = y;

      // Left column: If unchanged
      pdf.setFontSize(FONT.small);
      pdf.setTextColor(220, 38, 38);
      pdf.text('If maturity remains unchanged:', colLeftX, commercialY);

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(71, 85, 105);
      const unchangedItems = [
        'AI initiatives scale unevenly',
        'Governance gaps increase renewal risk',
        'Technical debt compounds'
      ];
      let leftY = commercialY + 5;
      unchangedItems.forEach(item => {
        pdf.text(`•  ${item}`, colLeftX + 2, leftY);
        leftY += SPACE.paragraph + 1;
      });

      // Right column: If advances
      pdf.setFontSize(FONT.small);
      pdf.setTextColor(22, 163, 74);
      pdf.text('If maturity advances to target:', colRightX, commercialY);

      pdf.setTextColor(71, 85, 105);
      const advancesItems = [
        'Predictable AI deployment',
        'Reduced audit exposure',
        'Accelerated feature velocity'
      ];
      let rightY = commercialY + 5;
      advancesItems.forEach(item => {
        pdf.text(`•  ${item}`, colRightX + 2, rightY);
        rightY += SPACE.paragraph + 1;
      });

      addFooter();

      // ===== PAGE 3: MATURITY BY LAYER (2x2 Grid) =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Maturity by Layer', MARGIN.left, y);
      y += SPACE.section + 6;

      const layers = [
        { key: 'platformServices', label: 'Platform Services' },
        { key: 'cloudGovernance', label: 'Cloud Governance' },
        { key: 'portfolioArchitecture', label: 'Portfolio Architecture' },
        { key: 'productExecution', label: 'Product & Client Execution' },
      ];

      const gridCellWidth = COL.width;
      const gridCellHeight = 52;
      const gridGap = 6;

      layers.forEach((layer, index) => {
        const score = assessment.layerScores[layer.key];
        const colors = getMaturityColors(score);
        const analysis = assessment.layerAnalysis?.[layer.key];

        // Calculate grid position (2x2)
        const col = index % 2;
        const row = Math.floor(index / 2);
        const cellX = MARGIN.left + col * (gridCellWidth + gridGap);
        const cellY = y + row * (gridCellHeight + gridGap);

        // Cell background
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(cellX, cellY, gridCellWidth, gridCellHeight, 2, 2, 'F');

        let innerY = cellY + 6;

        // Layer name and score on same line
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(layer.label, cellX + 5, innerY);

        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(...hexToRgb(colors.text));
        pdf.text(score.toFixed(1), cellX + gridCellWidth - 5, innerY, { align: 'right' });
        innerY += 5;

        // Status badge
        pdf.setFillColor(...hexToRgb(colors.text));
        pdf.roundedRect(cellX + 5, innerY, 20, 4, 2, 2, 'F');
        pdf.setFontSize(6);
        pdf.setTextColor(255, 255, 255);
        pdf.text(getMaturityLabel(score), cellX + 15, innerY + 3, { align: 'center' });

        // Progress bar
        drawProgressBar(cellX + 28, innerY + 0.5, gridCellWidth - 38, score, colors);
        innerY += 8;

        // Signal, Risk, Impact (compact)
        if (analysis) {
          pdf.setFontSize(FONT.label);
          const textWidth = gridCellWidth - 10;

          // Signal
          pdf.setTextColor(100, 116, 139);
          pdf.text('Signal:', cellX + 5, innerY);
          pdf.setTextColor(71, 85, 105);
          const signalText = pdf.splitTextToSize(analysis.signal, textWidth - 15)[0];
          pdf.text(signalText, cellX + 20, innerY);
          innerY += SPACE.paragraph + 1;

          // Risk
          pdf.setTextColor(220, 38, 38);
          pdf.text('Risk:', cellX + 5, innerY);
          pdf.setTextColor(71, 85, 105);
          const riskText = pdf.splitTextToSize(analysis.riskExposure, textWidth - 12)[0];
          pdf.text(riskText, cellX + 17, innerY);
          innerY += SPACE.paragraph + 1;

          // Impact
          pdf.setTextColor(22, 163, 74);
          pdf.text('Impact:', cellX + 5, innerY);
          pdf.setTextColor(71, 85, 105);
          const impactText = pdf.splitTextToSize(analysis.commercialImpact, textWidth - 18)[0];
          pdf.text(impactText, cellX + 22, innerY);
        }
      });

      addFooter();

      // ===== PAGE 4: STRATEGIC PRIORITIES (Two-Column) =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Strategic Priorities', MARGIN.left, y);
      y += SPACE.section + 6;

      const priorityHeight = 70;
      const recs = assessment.recommendations;

      // Left column: Priority 01 and 02
      let leftPriorityY = y;
      [0, 1].forEach((index) => {
        if (!recs[index]) return;
        const rec = recs[index];
        const actionText = rec.strategicAction || rec.description;
        const riskText = rec.riskOfInaction || 'Operational friction persists.';
        const outcomeText = rec.expectedOutcome || rec.impact;

        // Priority number (small inline)
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`0${index + 1}`, MARGIN.left, leftPriorityY);

        // Title
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(rec.title, MARGIN.left + 8, leftPriorityY);
        leftPriorityY += SPACE.subsection;

        // Strategic Action
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Strategic Action', MARGIN.left, leftPriorityY);
        leftPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const actionLines = pdf.splitTextToSize(actionText, COL.width - 5);
        pdf.text(actionLines.slice(0, 2), MARGIN.left, leftPriorityY);
        leftPriorityY += Math.min(actionLines.length, 2) * 3.5 + SPACE.paragraph;

        // Risk of Inaction
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(220, 38, 38);
        pdf.text('Risk of Inaction', MARGIN.left, leftPriorityY);
        leftPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const riskLine = pdf.splitTextToSize(riskText, COL.width - 5)[0];
        pdf.text(riskLine, MARGIN.left, leftPriorityY);
        leftPriorityY += SPACE.paragraph + 2;

        // Commercial Outcome
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(22, 163, 74);
        pdf.text('Commercial Outcome', MARGIN.left, leftPriorityY);
        leftPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const outcomeLine = pdf.splitTextToSize(outcomeText, COL.width - 5)[0];
        pdf.text(outcomeLine, MARGIN.left, leftPriorityY);
        leftPriorityY += SPACE.section + 8;
      });

      // Right column: Priority 03
      if (recs[2]) {
        const rec = recs[2];
        const actionText = rec.strategicAction || rec.description;
        const riskText = rec.riskOfInaction || 'Operational friction persists.';
        const outcomeText = rec.expectedOutcome || rec.impact;
        let rightPriorityY = y;
        const rightX = MARGIN.left + COL.width + COL.gutter;

        // Priority number
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text('03', rightX, rightPriorityY);

        // Title
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(rec.title, rightX + 8, rightPriorityY);
        rightPriorityY += SPACE.subsection;

        // Strategic Action
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Strategic Action', rightX, rightPriorityY);
        rightPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const actionLines = pdf.splitTextToSize(actionText, COL.width - 5);
        pdf.text(actionLines.slice(0, 2), rightX, rightPriorityY);
        rightPriorityY += Math.min(actionLines.length, 2) * 3.5 + SPACE.paragraph;

        // Risk of Inaction
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(220, 38, 38);
        pdf.text('Risk of Inaction', rightX, rightPriorityY);
        rightPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const riskLine = pdf.splitTextToSize(riskText, COL.width - 5)[0];
        pdf.text(riskLine, rightX, rightPriorityY);
        rightPriorityY += SPACE.paragraph + 2;

        // Commercial Outcome
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(22, 163, 74);
        pdf.text('Commercial Outcome', rightX, rightPriorityY);
        rightPriorityY += SPACE.paragraph;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(51, 65, 85);
        const outcomeLine = pdf.splitTextToSize(outcomeText, COL.width - 5)[0];
        pdf.text(outcomeLine, rightX, rightPriorityY);
      }

      addFooter();

      // ===== PAGE 5: TRANSFORMATION ROADMAP (Two-Column) =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Transformation Roadmap', MARGIN.left, y);
      y += SPACE.section + 6;

      const phases = [
        {
          title: 'Phase 1: Foundation (0-3 mo)',
          items: ['Governance framework', 'Access control standardization', 'Cost attribution model']
        },
        {
          title: 'Phase 2: Integration (3-6 mo)',
          items: ['Architecture policy rollout', 'CI/CD convergence', 'Observability baseline']
        },
        {
          title: 'Phase 3: Scale (6-12 mo)',
          items: ['AI workload enablement', 'Platform expansion', 'Enterprise integration']
        }
      ];

      // Left column: Phases
      let phaseY = y;
      phases.forEach((phase) => {
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(phase.title, MARGIN.left, phaseY);
        phaseY += SPACE.subsection;

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(71, 85, 105);
        phase.items.forEach((item) => {
          pdf.text(`•  ${item}`, MARGIN.left + 3, phaseY);
          phaseY += SPACE.paragraph + 1;
        });
        phaseY += SPACE.section;
      });

      // Right column: Key metrics and statement
      const rightX = MARGIN.left + COL.width + COL.gutter;
      let rightY = y;

      // Primary Investment Domain
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PRIMARY INVESTMENT DOMAIN', rightX, rightY);
      rightY += SPACE.subsection;

      pdf.setFontSize(FONT.body);
      pdf.setTextColor(15, 23, 42);
      pdf.text(lowestLayer.label, rightX, rightY);
      rightY += SPACE.section;

      // Transformation Window
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('TRANSFORMATION WINDOW', rightX, rightY);
      rightY += SPACE.subsection;

      pdf.setFontSize(FONT.body);
      pdf.setTextColor(15, 23, 42);
      pdf.text('6-12 months', rightX, rightY);
      rightY += SPACE.section;

      // Key Outcome Metrics
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('KEY OUTCOME METRICS', rightX, rightY);
      rightY += SPACE.subsection;

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(71, 85, 105);
      const metrics = [
        'Platform deployment frequency',
        'Mean time to recovery',
        'AI workload scalability index',
        'Governance compliance rate'
      ];
      metrics.forEach(metric => {
        pdf.text(`•  ${metric}`, rightX + 2, rightY);
        rightY += SPACE.paragraph + 1;
      });
      rightY += SPACE.section;

      // Operating Model Statement (integrated, not isolated)
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('OPERATING MODEL PERSPECTIVE', rightX, rightY);
      rightY += SPACE.subsection;

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(51, 65, 85);
      const statementLines = pdf.splitTextToSize(
        'Platform maturity is not a tooling initiative. It is an operating model transformation that enables sustainable enterprise scale.',
        COL.width - 5
      );
      pdf.text(statementLines, rightX, rightY);

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
