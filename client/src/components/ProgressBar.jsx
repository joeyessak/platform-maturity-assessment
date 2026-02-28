export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div
        className="flex justify-between text-sm font-medium mb-3"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: 'var(--foreground)'
          }}
        />
      </div>
    </div>
  );
}
