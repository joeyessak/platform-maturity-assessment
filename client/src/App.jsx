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
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Platform Maturity Assessment
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }} className="max-w-xl mx-auto">
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
