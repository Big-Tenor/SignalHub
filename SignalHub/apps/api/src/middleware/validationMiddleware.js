import { check } from 'express-validator';

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
