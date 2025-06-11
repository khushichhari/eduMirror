import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // ✅ fixed import
import Simulation from '../models/Simulation.js';

dotenv.config();

const router = express.Router();

// ✅ New OpenAI SDK initialization for v5+
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { name, careerPath } = req.body;

  if (!name || !careerPath) {
    return res.status(400).json({ error: 'Name and careerPath are required' });
  }

  try {
    const prompt = `
You are simulating the 5-year career journey of ${name} as a ${careerPath}.
For each year, include:
- year
- jobTitle
- salary
- workLifeBalance (1-10)
- techStack used
- event (promotion, layoff, transition, or none)
Return this as readable text.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.choices?.[0]?.message?.content || 'No response from OpenAI';

    console.log('✅ OpenAI response:', result);

    const newSimulation = new Simulation({ name, careerPath, result });
    await newSimulation.save();

    res.json({ name, careerPath, result });
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

export default router;
