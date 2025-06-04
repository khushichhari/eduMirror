import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function simulateCareer(req, res) {
  const { name, careerPath } = req.body;

  if (!name || !careerPath) {
    return res.status(400).json({ error: "Name and careerPath are required" });
  }

  try {
    const prompt = `
You are a career simulator for a person named ${name}.
Simulate a 5-year career path as a ${careerPath} including:
- salary progression
- work-life balance (scale 1-10)
- promotions, layoffs, job changes
- tech stack updates each year

Return ONLY a JSON array with 5 objects (one per year), each with keys:
year (1-5),
salary (number, annual in USD),
jobTitle (string),
workLifeBalance (1-10 number),
techStack (array of strings),
event (promotion, layoff, transition, none)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();

    // Try to parse JSON response
    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      // If parsing fails, return raw text as fallback
      return res.status(500).json({ error: "OpenAI response JSON parse error", rawResponse: text });
    }

    res.json({ name, careerPath, result });
  } catch (error) {
    console.error("simulateCareer error:", error);
    res.status(500).json({ error: "Failed to simulate career path" });
  }
}
