import express from 'express';
import { validateReport } from '../middleware/validationMiddleware.js';
import { validateReportData } from '../middleware/modelValidationMiddleware.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// Récupérer tous les signalements
router.get('/', reportController.getReports);

// Récupérer un signalement par ID
router.get('/:id', reportController.getReportById);

// Créer un nouveau signalement
router.post('/', validateReport, validateReportData, reportController.createReport);

// Mettre à jour un signalement
router.put('/:id', validateReport, validateReportData, reportController.updateReport);

// Supprimer un signalement
router.delete('/:id', reportController.deleteReport);

export default router;

