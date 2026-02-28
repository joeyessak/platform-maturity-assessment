import { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import Report from './components/Report';

function App() {
  const [assessment, setAssessment] = useState(null);
  const [responses, setResponses] = useState(null);

  const handleComplete = (assessmentData, responseData) => {
    setAssessment(assessmentData);
    setResponses(responseData);
  };

  const handleRestart = () => {
    setAssessment(null);
    setResponses(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Maturity Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Evaluate your organization's platform engineering maturity across key
            dimensions and receive AI-powered recommendations for improvement.
          </p>
        </div>

        {/* Main Content */}
        {assessment ? (
          <Report assessment={assessment} onRestart={handleRestart} />
        ) : (
          <Questionnaire onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}

export default App;
