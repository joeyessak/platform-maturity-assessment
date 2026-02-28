const maturityLevels = [
  { value: 1, label: 'Ad-hoc', description: 'No formal process or very limited' },
  { value: 2, label: 'Basic', description: 'Some processes in place, inconsistent' },
  { value: 3, label: 'Developing', description: 'Standardized processes, partial adoption' },
  { value: 4, label: 'Mature', description: 'Well-established, consistent across teams' },
  { value: 5, label: 'Optimized', description: 'Industry-leading, continuously improving' },
];

export default function Question({ question, layer, value, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <span
          className="text-section-label inline-block mb-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {layer}
        </span>
        <h2
          className="text-h2"
          style={{ color: 'var(--foreground)' }}
        >
          {question}
        </h2>
      </div>

      <div className="space-y-3">
        {maturityLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className="w-full text-left p-4 rounded-xl border transition-all duration-200"
            style={{
              backgroundColor: value === level.value ? 'var(--accent)' : 'transparent',
              borderColor: value === level.value ? 'var(--foreground)' : 'var(--border)',
              borderWidth: value === level.value ? '2px' : '1px',
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                style={{
                  backgroundColor: value === level.value ? 'var(--foreground)' : 'var(--muted)',
                  color: value === level.value ? 'var(--background)' : 'var(--muted-foreground)',
                }}
              >
                {level.value}
              </span>
              <div>
                <div
                  className="font-semibold text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  {level.label}
                </div>
                <div
                  className="text-sm mt-0.5"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {level.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
