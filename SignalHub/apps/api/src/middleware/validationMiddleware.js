import { check, param, query } from 'express-validator';

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Numéro de page invalide'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite par page invalide'),
];

export const validateLocationFilter = [
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude invalide'),
  
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude invalide'),
  
  query('radius')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Rayon de recherche invalide (0-100km)'),
];

export const validateReportUpdate = [
  param('id')
    .isUUID()
    .withMessage('ID de signalement invalide'),
  
  check('type')
    .optional()
    .isIn(['road', 'electricity', 'waste', 'water', 'other'])
    .withMessage('Type de signalement invalide'),
  
  check('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La description doit contenir entre 10 et 500 caractères'),
  
  check('status')
    .optional()
    .isIn(['new', 'in_progress', 'resolved'])
    .withMessage('Statut invalide'),
];

export const validateReport = [
  check('type')
    .notEmpty()
    .withMessage('Le type de signalement est requis')
    .isIn(['road', 'electricity', 'waste', 'water', 'other'])
    .withMessage('Type de signalement invalide (road, electricity, waste, water, other)'),
  
  check('description')
    .notEmpty()
    .withMessage('La description est requise')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La description doit contenir entre 10 et 500 caractères'),
  
  check('latitude')
    .notEmpty()
    .withMessage('La latitude est requise')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude invalide (doit être entre -90 et 90)'),
  
  check('longitude')
    .notEmpty()
    .withMessage('La longitude est requise')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude invalide (doit être entre -180 et 180)'),
  
  check('photo_url')
    .optional()
    .isURL()
    .withMessage('L\'URL de la photo est invalide')
    .custom((value) => {
      if (value && !value.match(/\.(jpg|jpeg|png|webp)$/i)) {
        throw new Error('L\'URL de la photo doit pointer vers une image (jpg, jpeg, png, webp)');
      }
      return true;
    }),
  
  check('status')
    .optional()
    .isIn(['new', 'in_progress', 'resolved'])
    .withMessage('Statut invalide (new, in_progress, resolved)'),
];
