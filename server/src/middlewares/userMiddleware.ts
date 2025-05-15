const { body } = require('express-validator');

export const registerValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  body('role').equals('project_owner').withMessage('Seuls les project-owner peuvent s inscrire'),
];