import OpenAI from "openai";

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if preferred
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();

    // Try parsing JSON from response
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { simulation: text };
    }

    res.json(result);
  } catch (error) {
    console.error("Error in simulateCareer:", error);
    res.status(500).json({ error: "Failed to simulate career path" });
  }
}
