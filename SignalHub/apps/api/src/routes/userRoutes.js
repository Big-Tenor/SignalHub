import express from 'express';
import * as userController from '../controllers/userController.js';
import { validateUserData } from '../middleware/modelValidationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes utilisateur nécessitent une authentification
router.use(authMiddleware);

// Obtenir l'utilisateur actuel
router.get('/me', userController.getCurrentUser);

// Mettre à jour l'utilisateur
router.put('/me', validateUserData, userController.updateUser);

// Supprimer l'utilisateur
router.delete('/me', userController.deleteUser);

export default router;
