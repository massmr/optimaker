const { body } = require('express-validator');

export const registerValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  body('role').isIn(['project_owner', 'superuser']).withMessage('Seuls les project-owner ou superuser peuvent s inscrire'),
];