import express from 'express';
import { simulateCareer } from '../controllers/simulateController.js';

const router = express.Router();

router.post('/', simulateCareer);

export default router;
