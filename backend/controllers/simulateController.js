
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function simulateCareer(req, res) {
  const { name, careerPath } = req.body;

  if (!name || !careerPath) {
    return res.status(400).json({ error: 'Name and careerPath are required' });
  }

  try {
    // Example prompt to simulate career path over 5 years with AI
    const prompt = `
You are a career simulator for a person named ${name}.
Simulate the career path over 5 years as a ${careerPath}, 
including salary progression, work-life balance, promotions, layoffs, 
job changes, and tech stack updates.
Return the result as a JSON object with these keys:
- year
- salary
- jobTitle
- workLifeBalance (1-10)
- techStack
- event (promotion, layoff, transition, none)
`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    // Parse the AI text response to JSON (try/catch to avoid errors)
    let result;
    try {
      result = JSON.parse(completion.data.choices[0].text.trim());
    } catch {
      // If AI didn't return valid JSON, send raw text
      result = { simulation: completion.data.choices[0].text.trim() };
    }

    res.json(result);
  } catch (error) {
    console.error('Error in simulateCareer:', error);
    res.status(500).json({ error: 'Failed to simulate career path' });
  }
}
