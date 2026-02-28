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
    <div
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-h1 mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Platform Maturity Assessment
          </h1>
          <p
            className="text-body max-w-2xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Evaluate your organization's platform engineering maturity across key
            dimensions and receive AI-powered strategic recommendations for improvement.
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
