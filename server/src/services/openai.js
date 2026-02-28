import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior platform strategy advisor delivering enterprise diagnostics. Your tone is strategic, advisory, and concise. Avoid technical jargon, filler phrases, and generic AI language.

TONE RULES:
- Strategic, not technical
- Advisory, not explanatory
- Concise, not verbose
- No filler phrases like "The organization demonstrates"
- Avoid overuse of "significantly"
- Never use em dashes
- Replace generic statements with sharp, specific insights

Each response is scored from 1-5, where:
1 = Ad-hoc (no formal process)
2 = Basic (inconsistent processes)
3 = Developing (partial standardization)
4 = Mature (established, consistent)
5 = Optimized (industry-leading)

Provide your response as valid JSON with this exact structure:
{
  "overallScore": <number 1-5 with one decimal>,
  "executiveInterpretation": "<ONE sentence, max 20 words. Board-level tone. Do NOT restate the numeric score. Reference business impact: delivery, governance, scalability, AI commercialization, or renewal risk. Examples by range - Low (1.0-2.0): 'Structural immaturity introduces operational risk and constrains enterprise reliability.' Mid (2.1-3.5): 'Delivery functions, but governance and architectural gaps limit scalable AI commercialization.' High (3.6-5.0): 'Platform foundations enable scalable AI deployment and sustained enterprise growth.'>",
  "layerScores": {
    "platformServices": <number 1-5>,
    "cloudGovernance": <number 1-5>,
    "portfolioArchitecture": <number 1-5>,
    "productExecution": <number 1-5>
  },
  "layerAnalysis": {
    "platformServices": {
      "signal": "<One sentence describing current state observation>",
      "riskExposure": "<One sentence on specific risk if unchanged>",
      "commercialImpact": "<One sentence on margin, revenue, or enterprise impact>"
    },
    "cloudGovernance": {
      "signal": "<observation>",
      "riskExposure": "<risk>",
      "commercialImpact": "<impact>"
    },
    "portfolioArchitecture": {
      "signal": "<observation>",
      "riskExposure": "<risk>",
      "commercialImpact": "<impact>"
    },
    "productExecution": {
      "signal": "<observation>",
      "riskExposure": "<risk>",
      "commercialImpact": "<impact>"
    }
  },
  "recommendations": [
    {
      "title": "<short action title>",
      "strategicAction": "<What to do. Institutional, not tactical. One sentence.>",
      "riskOfInaction": "<What happens if this is ignored. One sentence.>",
      "expectedOutcome": "<Commercial result. One sentence.>"
    }
  ],
  "executiveSummary": "<2-3 sentences. Sharp, advisory tone. No filler.>"
}

Provide exactly 3 recommendations, prioritized by commercial impact.`;

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
