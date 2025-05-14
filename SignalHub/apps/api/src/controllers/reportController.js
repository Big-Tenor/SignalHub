import { validationResult } from 'express-validator';
import reportService from '../services/reportService.js';

export const getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, lat, lng, radius } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      location: lat && lng ? {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        radius: parseFloat(radius || 10)
      } : null
    };

    const { reports, total } = await reportService.getAllReports(options);
    
    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Page', page);
    res.setHeader('X-Limit', limit);
    
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
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation échouée',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
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

    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire du signalement ou admin
    if (report.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé à modifier ce signalement' });
    }

    const updatedReport = await reportService.updateReport(req.params.id, req.user.id, req.body);
    res.json(updatedReport);
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire du signalement ou admin
    if (report.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé à supprimer ce signalement' });
    }

    await reportService.deleteReport(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getUserReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      userId: req.user.id
    };

    const { reports, total } = await reportService.getUserReports(options);
    
    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Page', page);
    res.setHeader('X-Limit', limit);
    
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
