import { validationResult } from 'express-validator';
import reportService from '../services/reportService.js';

export const getReports = async (req, res, next) => {
  try {
    const reports = await reportService.getAllReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const report = await reportService.createReport(req.body, req.user.id);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const report = await reportService.updateReport(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(report);
  } catch (error) {
    if (error.message === 'Non autorisé à modifier ce signalement') {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    await reportService.deleteReport(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Non autorisé à supprimer ce signalement') {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};
