import { check } from 'express-validator';

export const validateReport = [
  check('type')
    .notEmpty()
    .isIn(['road', 'electricity', 'waste', 'water', 'other'])
    .withMessage('Type de signalement invalide'),
  check('description')
    .notEmpty()
    .trim()
    .withMessage('Description requise'),
  check('latitude')
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude invalide'),
  check('longitude')
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude invalide'),
  check('photo_url')
    .optional()
    .isURL()
    .withMessage('URL de photo invalide'),
  check('status')
    .optional()
    .isIn(['new', 'in_progress', 'resolved'])
    .withMessage('Statut invalide'),
];
