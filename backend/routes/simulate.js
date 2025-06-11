// import express from 'express';
// import { simulateCareer } from '../controllers/simulateController.js';

// const router = express.Router();

// router.post('/', simulateCareer);

// export default router;


// new


import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import Simulation from '../models/Simulation.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.data.choices?.[0]?.message?.content || 'No response from OpenAI';

    console.log('✅ OpenAI response:', result);

    // Save simulation result
    const newSimulation = new Simulation({ name, careerPath, result });
    await newSimulation.save();

    res.json({ name, careerPath, result });
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

export default router;
