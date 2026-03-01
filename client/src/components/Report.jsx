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

      // ===== LAYOUT ENGINE =====
      const PAGE = {
        width: pdf.internal.pageSize.getWidth(),   // 215.9mm
        height: pdf.internal.pageSize.getHeight(), // 279.4mm
      };

      const MARGIN = { top: 20, bottom: 20, left: 20, right: 20 };
      const FOOTER_HEIGHT = 10;
      const SAFE_BOTTOM = PAGE.height - MARGIN.bottom - FOOTER_HEIGHT;
      const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

      const COL = {
        width: (CONTENT_WIDTH - 6) / 2,
        gutter: 6,
      };

      const SPACE = { section: 10, subsection: 6, paragraph: 4, cardPad: 5 };
      const FONT = { h2: 14, h3: 10, body: 9, small: 8, label: 7 };
      const LINE_HEIGHT = { body: 3.8, small: 3.2, label: 2.8 };

      let y = MARGIN.top;

      // ===== REUSABLE LAYOUT HELPERS =====
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
      };

      // Wrap text into lines that fit within maxWidth
      const wrapLines = (text, maxWidth) => {
        if (!text) return [];
        return pdf.splitTextToSize(String(text), maxWidth);
      };

      // Measure height of wrapped lines
      const measureWrappedHeight = (lines, lineHeight) => {
        return lines.length * lineHeight;
      };

      // Draw wrapped text line by line, returns final Y position
      const drawWrappedText = (lines, x, startY, lineHeight, maxLines = null) => {
        const linesToDraw = maxLines ? lines.slice(0, maxLines) : lines;
        linesToDraw.forEach((line, i) => {
          pdf.text(line, x, startY + i * lineHeight);
        });
        return startY + linesToDraw.length * lineHeight;
      };

      const addFooter = () => {
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(130, 130, 130);
        pdf.text('Prepared by Joey Essak', MARGIN.left, PAGE.height - MARGIN.bottom + 4);
        pdf.text('joey.essak@gmail.com', PAGE.width - MARGIN.right, PAGE.height - MARGIN.bottom + 4, { align: 'right' });
      };

      const ensureSpace = (requiredHeight) => {
        if (y + requiredHeight > SAFE_BOTTOM) {
          addFooter();
          pdf.addPage();
          y = MARGIN.top;
          return true;
        }
        return false;
      };

      // Draw ring (donut chart)
      const drawRing = (cx, cy, radius, score, stroke = 3) => {
        const colors = getMaturityColors(score);
        const pct = score / 5;

        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(stroke);
        pdf.circle(cx, cy, radius, 'S');

        pdf.setDrawColor(...hexToRgb(colors.start));
        const segments = Math.max(Math.floor(pct * 40), 1);
        for (let i = 0; i < segments; i++) {
          const a1 = (-90 + (i / segments) * pct * 360) * Math.PI / 180;
          const a2 = (-90 + ((i + 1) / segments) * pct * 360) * Math.PI / 180;
          pdf.line(cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
                   cx + radius * Math.cos(a2), cy + radius * Math.sin(a2));
        }
        return colors;
      };

      const drawCard = (x, yPos, w, h) => {
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(x, yPos, w, h, 2, 2, 'F');
      };

      const drawChip = (x, yPos, label, colors) => {
        pdf.setFontSize(6);
        const w = pdf.getTextWidth(label) + 4;
        pdf.setFillColor(...hexToRgb(colors.text));
        pdf.roundedRect(x, yPos, w, 4, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text(label, x + w / 2, yPos + 2.8, { align: 'center' });
        return w;
      };

      // ===== PAGE 1: COVER =====
      y = 90;
      pdf.setFontSize(26);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Platform Maturity', PAGE.width / 2, y, { align: 'center' });
      pdf.text('Executive Review', PAGE.width / 2, y + 10, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Enterprise Advisory Diagnostic', PAGE.width / 2, y + 28, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Prepared by', PAGE.width / 2, y + 55, { align: 'center' });
      pdf.setFontSize(13);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Joey Essak', PAGE.width / 2, y + 63, { align: 'center' });
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Platform & AI Strategy', PAGE.width / 2, y + 70, { align: 'center' });
      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 130);
      pdf.text('joey.essak@gmail.com  |  linkedin.com/in/joeyessak', PAGE.width / 2, y + 80, { align: 'center' });

      // ===== PAGE 2: EXECUTIVE SNAPSHOT =====
      pdf.addPage();
      y = MARGIN.top;

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Executive Snapshot', MARGIN.left, y);
      y += SPACE.section;

      const overallColors = getMaturityColors(assessment.overallScore);
      const delta = TARGET_STATE - assessment.overallScore;

      // Score card - compute height dynamically from wrapped interpretation
      const interpTextWidth = CONTENT_WIDTH - 55;
      pdf.setFontSize(FONT.body);
      const interpLines = wrapLines(assessment.executiveInterpretation || '', interpTextWidth);
      const interpHeight = measureWrappedHeight(interpLines, LINE_HEIGHT.body);
      const scoreCardHeight = Math.max(52, SPACE.cardPad + 8 + interpHeight + 20);

      ensureSpace(scoreCardHeight);
      drawCard(MARGIN.left, y, CONTENT_WIDTH, scoreCardHeight);

      // Ring
      const ringX = MARGIN.left + 22;
      const ringY = y + scoreCardHeight / 2;
      drawRing(ringX, ringY, 14, assessment.overallScore, 3.5);
      pdf.setFontSize(15);
      pdf.setTextColor(...hexToRgb(overallColors.text));
      pdf.text(assessment.overallScore.toFixed(1), ringX, ringY + 2, { align: 'center' });
      pdf.setFontSize(6);
      pdf.setTextColor(100, 116, 139);
      pdf.text('of 5', ringX, ringY + 7, { align: 'center' });

      // Content right of ring
      const textX = MARGIN.left + 45;
      let innerY = y + SPACE.cardPad;
      drawChip(textX, innerY, getMaturityLabel(assessment.overallScore), overallColors);
      innerY += 8;

      // Executive Interpretation - fully wrapped, no truncation
      pdf.setFontSize(FONT.body);
      pdf.setTextColor(15, 23, 42);
      innerY = drawWrappedText(interpLines, textX, innerY, LINE_HEIGHT.body);

      // Delta row at bottom of card
      const deltaY = y + scoreCardHeight - 10;
      pdf.setFontSize(FONT.label);
      const deltaItems = [
        { label: 'Current', value: assessment.overallScore.toFixed(1), color: [15, 23, 42] },
        { label: 'Target', value: TARGET_STATE.toFixed(1), color: [22, 163, 74] },
        { label: 'Delta', value: `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`, color: hexToRgb(delta > 0 ? '#EA580C' : '#16A34A') },
        { label: 'Benchmark', value: INDUSTRY_BENCHMARK.toString(), color: [100, 116, 139] },
      ];
      deltaItems.forEach((item, i) => {
        const dx = textX + i * 30;
        pdf.setTextColor(100, 116, 139);
        pdf.text(item.label, dx, deltaY);
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(...item.color);
        pdf.text(item.value, dx, deltaY + 4);
        pdf.setFontSize(FONT.label);
      });

      y += scoreCardHeight + SPACE.section;

      // Executive Summary - fully wrapped, no truncation
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXECUTIVE SUMMARY', MARGIN.left, y);
      y += SPACE.subsection;

      pdf.setFontSize(FONT.body);
      const summaryLines = wrapLines(assessment.executiveSummary || '', CONTENT_WIDTH);
      const summaryHeight = measureWrappedHeight(summaryLines, LINE_HEIGHT.body);
      ensureSpace(summaryHeight + SPACE.section);
      pdf.setTextColor(51, 65, 85);
      y = drawWrappedText(summaryLines, MARGIN.left, y, LINE_HEIGHT.body);
      y += SPACE.section;

      // Commercial Readiness
      const bulletHeight = 22;
      ensureSpace(bulletHeight);
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('COMMERCIAL READINESS', MARGIN.left, y);
      y += SPACE.subsection;

      const colL = MARGIN.left;
      const colR = MARGIN.left + COL.width + COL.gutter;

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(220, 38, 38);
      pdf.text('If unchanged:', colL, y);
      pdf.setTextColor(22, 163, 74);
      pdf.text('If advances:', colR, y);

      const bullets = [
        ['AI scales unevenly', 'Predictable AI deployment'],
        ['Governance gaps persist', 'Reduced audit exposure'],
        ['Tech debt compounds', 'Faster feature velocity'],
      ];
      let bulletY = y + 4;
      pdf.setTextColor(71, 85, 105);
      bullets.forEach(([left, right]) => {
        pdf.text(`•  ${left}`, colL + 2, bulletY);
        pdf.text(`•  ${right}`, colR + 2, bulletY);
        bulletY += LINE_HEIGHT.small;
      });

      addFooter();

      // ===== PAGE 3: MATURITY BY LAYER =====
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

      const cellW = COL.width;
      const cellGap = 5;
      const labelAreaWidth = cellW - 32; // space after ring for text

      // Pre-compute card heights based on WRAPPED content
      const computeLayerCardHeight = (layerKey) => {
        const analysis = assessment.layerAnalysis?.[layerKey];
        const headerHeight = 24; // ring area + title + chip
        if (!analysis) return headerHeight + SPACE.cardPad * 2;

        pdf.setFontSize(FONT.label);
        const signalLines = wrapLines(analysis.signal || '', labelAreaWidth - 14);
        const riskLines = wrapLines(analysis.riskExposure || '', labelAreaWidth - 12);
        const impactLines = wrapLines(analysis.commercialImpact || '', labelAreaWidth - 15);

        const textHeight =
          measureWrappedHeight(signalLines.slice(0, 2), LINE_HEIGHT.label) +
          measureWrappedHeight(riskLines.slice(0, 2), LINE_HEIGHT.label) +
          measureWrappedHeight(impactLines.slice(0, 2), LINE_HEIGHT.label) +
          6; // spacing between sections

        return headerHeight + textHeight + SPACE.cardPad * 2;
      };

      const layerHeights = layers.map(l => computeLayerCardHeight(l.key));
      const row1Height = Math.max(layerHeights[0], layerHeights[1]);
      const row2Height = Math.max(layerHeights[2], layerHeights[3]);
      const totalGridHeight = row1Height + row2Height + cellGap;

      // Check if 2x2 grid fits; if not, render 1 column
      const use2x2 = (y + totalGridHeight) <= SAFE_BOTTOM;

      layers.forEach((layer, idx) => {
        const score = assessment.layerScores[layer.key];
        const colors = getMaturityColors(score);
        const analysis = assessment.layerAnalysis?.[layer.key];

        let cellX, cellY, cellH;

        if (use2x2) {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          cellH = row === 0 ? row1Height : row2Height;
          cellX = MARGIN.left + col * (cellW + cellGap);
          cellY = y + row * (cellH + cellGap);
        } else {
          // 1 column layout
          cellH = layerHeights[idx];
          cellX = MARGIN.left;
          ensureSpace(cellH + cellGap);
          cellY = y;
          y += cellH + cellGap;
        }

        drawCard(cellX, cellY, cellW, cellH);

        // Mini ring
        const ringCX = cellX + 14;
        const ringCY = cellY + 14;
        drawRing(ringCX, ringCY, 9, score, 2.5);
        pdf.setFontSize(9);
        pdf.setTextColor(...hexToRgb(colors.text));
        pdf.text(score.toFixed(1), ringCX, ringCY + 1.5, { align: 'center' });

        // Label + chip
        const lblX = cellX + 28;
        let lblY = cellY + 8;
        pdf.setFontSize(FONT.h3);
        pdf.setTextColor(15, 23, 42);
        pdf.text(layer.label, lblX, lblY);
        lblY += 5;
        drawChip(lblX, lblY, getMaturityLabel(score), colors);
        lblY += 8;

        // Signal / Risk / Impact - wrapped with maxLines=2
        if (analysis) {
          pdf.setFontSize(FONT.label);

          // Signal
          const signalLines = wrapLines(analysis.signal || '', labelAreaWidth - 14);
          pdf.setTextColor(100, 116, 139);
          pdf.text('Signal:', lblX, lblY);
          pdf.setTextColor(71, 85, 105);
          lblY = drawWrappedText(signalLines, lblX + 13, lblY, LINE_HEIGHT.label, 2);
          lblY += 1;

          // Risk
          const riskLines = wrapLines(analysis.riskExposure || '', labelAreaWidth - 12);
          pdf.setTextColor(220, 38, 38);
          pdf.text('Risk:', lblX, lblY);
          pdf.setTextColor(71, 85, 105);
          lblY = drawWrappedText(riskLines, lblX + 10, lblY, LINE_HEIGHT.label, 2);
          lblY += 1;

          // Impact
          const impactLines = wrapLines(analysis.commercialImpact || '', labelAreaWidth - 15);
          pdf.setTextColor(22, 163, 74);
          pdf.text('Impact:', lblX, lblY);
          pdf.setTextColor(71, 85, 105);
          drawWrappedText(impactLines, lblX + 14, lblY, LINE_HEIGHT.label, 2);
        }
      });

      if (use2x2) {
        y += totalGridHeight;
      }
      addFooter();

      // ===== PAGE 4: PRIORITIES + ROADMAP =====
      pdf.addPage();
      y = MARGIN.top;

      // Strategic Priorities - stacked vertically for more space
      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Strategic Priorities', MARGIN.left, y);
      y += SPACE.section;

      const recs = assessment.recommendations.slice(0, 3);

      // Compute each priority card height based on wrapped content
      const computePriorityHeight = (rec) => {
        pdf.setFontSize(FONT.label);
        const actionLines = wrapLines(rec.strategicAction || rec.description || '', CONTENT_WIDTH - 20);
        const riskLines = wrapLines(rec.riskOfInaction || '', CONTENT_WIDTH - 20);
        const outcomeLines = wrapLines(rec.expectedOutcome || rec.impact || '', CONTENT_WIDTH - 20);

        const actionH = measureWrappedHeight(actionLines.slice(0, 3), LINE_HEIGHT.label);
        const riskH = measureWrappedHeight(riskLines.slice(0, 2), LINE_HEIGHT.label);
        const outcomeH = measureWrappedHeight(outcomeLines.slice(0, 2), LINE_HEIGHT.label);

        return 12 + actionH + 4 + riskH + 4 + outcomeH + SPACE.cardPad * 2;
      };

      recs.forEach((rec, i) => {
        const cardH = computePriorityHeight(rec);
        ensureSpace(cardH + 4);

        drawCard(MARGIN.left, y, CONTENT_WIDTH, cardH);

        let iy = y + SPACE.cardPad;

        // Number pill + Title
        pdf.setFillColor(15, 23, 42);
        pdf.roundedRect(MARGIN.left + 5, iy - 1, 6, 4, 2, 2, 'F');
        pdf.setFontSize(6);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${i + 1}`, MARGIN.left + 8, iy + 1.5, { align: 'center' });

        pdf.setFontSize(FONT.small);
        pdf.setTextColor(15, 23, 42);
        const titleLines = wrapLines(rec.title || '', CONTENT_WIDTH - 25);
        pdf.text(titleLines[0] || '', MARGIN.left + 14, iy + 1);
        iy += 7;

        // Action - wrapped
        pdf.setFontSize(FONT.label);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Action:', MARGIN.left + 5, iy);
        pdf.setTextColor(51, 65, 85);
        const actionLines = wrapLines(rec.strategicAction || rec.description || '', CONTENT_WIDTH - 30);
        iy = drawWrappedText(actionLines, MARGIN.left + 18, iy, LINE_HEIGHT.label, 3);
        iy += 2;

        // Risk - wrapped
        pdf.setTextColor(220, 38, 38);
        pdf.text('Risk:', MARGIN.left + 5, iy);
        pdf.setTextColor(71, 85, 105);
        const riskLines = wrapLines(rec.riskOfInaction || '', CONTENT_WIDTH - 30);
        iy = drawWrappedText(riskLines, MARGIN.left + 15, iy, LINE_HEIGHT.label, 2);
        iy += 2;

        // Outcome - wrapped
        pdf.setTextColor(22, 163, 74);
        pdf.text('Outcome:', MARGIN.left + 5, iy);
        pdf.setTextColor(71, 85, 105);
        const outcomeLines = wrapLines(rec.expectedOutcome || rec.impact || '', CONTENT_WIDTH - 30);
        drawWrappedText(outcomeLines, MARGIN.left + 20, iy, LINE_HEIGHT.label, 2);

        y += cardH + 4;
      });

      y += SPACE.section;

      // Transformation Roadmap
      const roadmapHeight = 50;
      ensureSpace(roadmapHeight);

      pdf.setFontSize(FONT.h2);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Transformation Roadmap', MARGIN.left, y);
      y += SPACE.section;

      // Visual timeline bar
      const timelineH = 5;
      pdf.setFillColor(229, 231, 235);
      pdf.roundedRect(MARGIN.left, y, CONTENT_WIDTH, timelineH, 2, 2, 'F');

      // Phase markers
      const phaseColors = [[220, 38, 38], [251, 191, 36], [34, 197, 94]];
      const phaseLabels = ['0-3 months', '3-6 months', '6-12 months'];
      const phaseW = CONTENT_WIDTH / 3;

      phaseLabels.forEach((label, i) => {
        const px = MARGIN.left + i * phaseW;
        pdf.setFillColor(...phaseColors[i]);
        pdf.roundedRect(px + 1, y, phaseW - 2, timelineH, 2, 2, 'F');
        pdf.setFontSize(6);
        pdf.setTextColor(255, 255, 255);
        pdf.text(label, px + phaseW / 2, y + 3.2, { align: 'center' });
      });

      y += timelineH + 5;

      // Phase cards
      const phases = [
        { title: 'Foundation', items: ['Governance framework', 'Access controls', 'Cost attribution'] },
        { title: 'Integration', items: ['Architecture policy', 'CI/CD convergence', 'Observability'] },
        { title: 'Scale', items: ['AI enablement', 'Platform expansion', 'Enterprise integration'] },
      ];
      const phaseCardW = (CONTENT_WIDTH - 8) / 3;
      const phaseCardH = 28;

      phases.forEach((phase, i) => {
        const px = MARGIN.left + i * (phaseCardW + 4);
        drawCard(px, y, phaseCardW, phaseCardH);

        let py = y + 4;
        pdf.setFontSize(FONT.small);
        pdf.setTextColor(15, 23, 42);
        pdf.text(phase.title, px + 4, py);
        py += 4;

        pdf.setFontSize(FONT.label);
        pdf.setTextColor(71, 85, 105);
        phase.items.forEach(item => {
          pdf.text(`•  ${item}`, px + 4, py);
          py += LINE_HEIGHT.label;
        });
      });

      y += phaseCardH + SPACE.subsection;

      // Key metrics + investment domain
      ensureSpace(12);
      pdf.setFontSize(FONT.label);
      pdf.setTextColor(100, 116, 139);
      pdf.text('KEY METRICS', MARGIN.left, y);
      pdf.text('PRIMARY INVESTMENT DOMAIN', MARGIN.left + 95, y);
      y += 4;

      pdf.setFontSize(FONT.small);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Deployment frequency • MTTR • AI scalability • Compliance rate', MARGIN.left, y);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${lowestLayer.label} (${lowestLayer.score.toFixed(1)})`, MARGIN.left + 95, y);

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
