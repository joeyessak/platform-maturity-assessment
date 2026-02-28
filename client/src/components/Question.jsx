const maturityLevels = [
  { value: 1, label: 'Ad-hoc', description: 'No formal process or very limited' },
  { value: 2, label: 'Basic', description: 'Some processes in place, inconsistent' },
  { value: 3, label: 'Developing', description: 'Standardized processes, partial adoption' },
  { value: 4, label: 'Mature', description: 'Well-established, consistent across teams' },
  { value: 5, label: 'Optimized', description: 'Industry-leading, continuously improving' },
];

export default function Question({ question, layer, value, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <span
          className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-2"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)'
          }}
        >
          {layer}
        </span>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
          {question}
        </h2>
      </div>

      <div className="space-y-2">
        {maturityLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className="w-full text-left p-4 rounded-lg border-2 transition-all"
            style={{
              backgroundColor: value === level.value ? 'var(--accent)' : 'transparent',
              borderColor: value === level.value ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: value === level.value ? 'var(--primary)' : 'var(--muted)',
                  color: value === level.value ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {level.value}
              </span>
              <div>
                <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {level.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
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
