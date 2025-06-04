// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function simulateCareer(req, res) {
//   const { name, careerPath } = req.body;

//   if (!name || !careerPath) {
//     return res.status(400).json({ error: "Name and careerPath are required" });
//   }

//   try {
//     const prompt = `
// You are a career simulator for a person named ${name}.
// Simulate the career path over 5 years as a ${careerPath}, 
// including salary progression, work-life balance, promotions, layoffs, 
// job changes, and tech stack updates.
// Return the result as a JSON object with these keys:
// - year
// - salary
// - jobTitle
// - workLifeBalance (1-10)
// - techStack
// - event (promotion, layoff, transition, none)
// `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // or "gpt-3.5-turbo" if preferred
//       messages: [
//         { role: "user", content: prompt }
//       ],
//       max_tokens: 500,
//       temperature: 0.7,
//     });

//     const text = completion.choices[0].message.content.trim();

//     // Try parsing JSON from response
//     let result;
//     try {
//       result = JSON.parse(text);
//     } catch {
//       result = { simulation: text };
//     }

//     res.json(result);
//   } catch (error) {
//     console.error("Error in simulateCareer:", error);
//     res.status(500).json({ error: "Failed to simulate career path" });
//   }
// }





import OpenAI from "openai";
import Simulation from "../models/Simulation.js";

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
Simulate the career path over 5 years as a ${careerPath}, including:
- salary progression
- work-life balance (1-10)
- promotions
- layoffs
- job changes
- tech stack updates

Return ONLY a valid JSON array with 5 objects (1 per year). Each object must have:
{
  "year": number,
  "salary": string,
  "jobTitle": string,
  "workLifeBalance": number,
  "techStack": [string],
  "event": "promotion" | "layoff" | "transition" | "none"
}
No explanation or text, only JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content.trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (err) {
      console.warn("⚠️ JSON parse failed, fallback to raw text.");
      parsedResult = { simulationText: rawContent };
    }

    const newSimulation = new Simulation({
      name,
      careerPath,
      result: parsedResult,
    });

    await newSimulation.save();

    res.status(200).json({ name, careerPath, result: parsedResult });
  } catch (error) {
    console.error("❌ Error in simulateCareer:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to simulate career path" });
  }
}
