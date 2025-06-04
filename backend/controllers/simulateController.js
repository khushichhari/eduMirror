import OpenAI from 'openai';
import Simulation from '../models/Simulation.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function simulateCareer(req, res) {
  const { name, careerPath } = req.body;

  if (!name || !careerPath) {
    return res.status(400).json({ error: "Name and careerPath are required" });
  }

  const prompt = `
Simulate a 5-year career journey for ${name} as a ${careerPath}.
Return ONLY a JSON array of 5 objects with the following keys:
- year (1 to 5)
- salary (number in USD)
- jobTitle
- workLifeBalance (1-10)
- techStack (array of strings)
- event (promotion, layoff, transition, none)

Don't include explanation or markdown. Return only valid JSON.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const text = completion.choices[0].message.content.trim();
    console.log('🎯 OpenAI Response:', text);

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (err) {
      console.error('❌ JSON Parse Error:', err.message);
      return res.status(500).json({ error: 'OpenAI returned invalid JSON', raw: text });
    }

    const saved = new Simulation({ name, careerPath, result: parsedResult });
    await saved.save();

    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('💥 simulateCareer Error:', error);
    res.status(500).json({ error: 'Failed to simulate career path' });
  }
}
