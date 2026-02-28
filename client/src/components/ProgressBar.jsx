export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
