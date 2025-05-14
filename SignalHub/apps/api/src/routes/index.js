import express from 'express';
import reportRoutes from './reportRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/reports', reportRoutes);
router.use('/users', userRoutes);

export default router;
