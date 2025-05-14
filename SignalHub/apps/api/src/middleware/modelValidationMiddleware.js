import { Report, User } from '@repo/shared';

export const validateReportData = (req, res, next) => {
  try {
    const reportData = {
      ...req.body,
      user_id: req.user.id,
      status: req.body.status || 'new'
    };
    
    const report = new Report(reportData);
    const validation = report.validate();

    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation du modèle échouée',
        errors: validation.errors
      });
      return res.status(400).json({
        error: 'Données de signalement invalides',
        details: validation.errors
      });
    }

    // Stocker l'objet Report validé pour le prochain middleware
    req.validatedReport = report;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserData = (req, res, next) => {
  try {
    const userData = { ...req.body };
    const user = new User(userData);
    const validation = user.validate();

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Données utilisateur invalides',
        details: validation.errors
      });
    }

    // Stocker l'objet User validé pour le prochain middleware
    req.validatedUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
