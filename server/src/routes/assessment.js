import express from 'express';
import { analyzeAssessment } from '../services/openai.js';

const router = express.Router();

router.post('/assess', async (req, res) => {
  try {
    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({ error: 'Responses are required' });
    }

    // Validate all required fields
    const requiredFields = [
      'cicd',
      'iac',
      'cloudCost',
      'accessControl',
      'serviceStandard',
      'deliveryVisibility',
      'aiReadiness',
    ];

    for (const field of requiredFields) {
      if (responses[field] === undefined || responses[field] < 1 || responses[field] > 5) {
        return res.status(400).json({
          error: `Invalid or missing value for ${field}. Must be between 1 and 5.`,
        });
      }
    }

    const assessment = await analyzeAssessment(responses);
    res.json(assessment);
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Failed to generate assessment' });
  }
});

export default router;
