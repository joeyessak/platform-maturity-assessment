import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a platform maturity assessment expert. Analyze the following questionnaire responses and provide a comprehensive assessment.

Each response is scored from 1-5, where:
1 = Ad-hoc/None
2 = Basic/Minimal
3 = Developing/Partial
4 = Mature/Established
5 = Optimized/Leading

Provide your response as valid JSON with this exact structure:
{
  "overallScore": <number 1-5 with one decimal>,
  "layerScores": {
    "platformServices": <number 1-5>,
    "cloudGovernance": <number 1-5>,
    "portfolioArchitecture": <number 1-5>,
    "productExecution": <number 1-5>
  },
  "recommendations": [
    {
      "title": "<short title>",
      "description": "<actionable recommendation>",
      "impact": "<commercial/business impact>"
    }
  ],
  "executiveSummary": "<2-3 sentence summary of the organization's platform maturity>"
}

Provide exactly 3 recommendations, prioritized by potential impact.`;

export async function analyzeAssessment(responses) {
  const userPrompt = `Here are the questionnaire responses:

1. CI/CD Standardization (Platform Services): ${responses.cicd}/5
   Question: "How standardized are your CI/CD pipelines across teams?"

2. Infrastructure as Code (Platform Services): ${responses.iac}/5
   Question: "What percentage of your infrastructure is managed as code?"

3. Cloud Cost Visibility (Cloud Governance): ${responses.cloudCost}/5
   Question: "How well do you track and attribute cloud costs?"

4. Access Control Maturity (Cloud Governance): ${responses.accessControl}/5
   Question: "How automated and policy-driven are your access controls?"

5. Service Standardization (Portfolio Architecture): ${responses.serviceStandard}/5
   Question: "How consistent are technology choices across your portfolio?"

6. Delivery Visibility (Product & Client Execution): ${responses.deliveryVisibility}/5
   Question: "How much visibility do executives have into delivery metrics?"

7. AI Readiness (Product & Client Execution): ${responses.aiReadiness}/5
   Question: "How prepared is your platform to support AI/ML workloads?"

Analyze these responses and provide a detailed maturity assessment.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  return JSON.parse(content);
}
