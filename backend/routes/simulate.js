import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import Simulation from '../models/Simulation.js'; // ✅ import model

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  const { name, careerPath } = req.body;

  try {
    const prompt = `Simulate a 5-year career journey for ${name} as a ${careerPath}...`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.data.choices[0].message.content;

    // ✅ Save to DB
    const newSimulation = new Simulation({ name, careerPath, result });
    await newSimulation.save();

    res.json({ name, careerPath, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

export default router;
