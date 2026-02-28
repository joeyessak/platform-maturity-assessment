import { useState } from 'react';
import Question from './Question';
import ProgressBar from './ProgressBar';

const questions = [
  {
    id: 'cicd',
    question: 'How standardized are your CI/CD pipelines across teams?',
    layer: 'Platform Services',
  },
  {
    id: 'iac',
    question: 'What percentage of your infrastructure is managed as code?',
    layer: 'Platform Services',
  },
  {
    id: 'cloudCost',
    question: 'How well do you track and attribute cloud costs?',
    layer: 'Cloud Governance',
  },
  {
    id: 'accessControl',
    question: 'How automated and policy-driven are your access controls?',
    layer: 'Cloud Governance',
  },
  {
    id: 'serviceStandard',
    question: 'How consistent are technology choices across your portfolio?',
    layer: 'Portfolio Architecture',
  },
  {
    id: 'deliveryVisibility',
    question: 'How much visibility do executives have into delivery metrics?',
    layer: 'Product & Client Execution',
  },
  {
    id: 'aiReadiness',
    question: 'How prepared is your platform to support AI/ML workloads?',
    layer: 'Product & Client Execution',
  },
];

export default function Questionnaire({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;

  const handleAnswer = (value) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/assess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit assessment');
        }

        const assessment = await response.json();
        onComplete(assessment, responses);
      } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Failed to generate assessment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="mt-8">
          <Question
            question={currentQuestion.question}
            layer={currentQuestion.layer}
            value={responses[currentQuestion.id]}
            onChange={handleAnswer}
          />
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : isLastQuestion ? (
              'Get Assessment'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
