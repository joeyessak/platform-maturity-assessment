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
        <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200 rounded-full mb-2">
          {layer}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{question}</h2>
      </div>

      <div className="space-y-2">
        {maturityLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              value === level.value
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  value === level.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
                }`}
              >
                {level.value}
              </span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{level.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{level.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
