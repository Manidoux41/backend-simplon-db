/**
 * Routes pour l'authentification locale (Prisma)
 */

const express = require('express');
const { authController } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/validation');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../utils/validation');

const router = express.Router();

/**
 * POST /auth/register
 * Inscription locale
 */
router.post('/register', 
    authLimiter,
    registerSchema,
    authController.register.bind(authController)
);

/**
 * POST /auth/login
 * Connexion locale
 */
router.post('/login', 
    authLimiter,
    loginSchema,
    authController.login.bind(authController)
);

/**
 * GET /auth/profile
 * Profil utilisateur (auth locale requise)
 */
router.get('/profile', 
    requireAuth,
    authController.getProfile.bind(authController)
);

/**
 * PUT /auth/profile
 * Mise à jour du profil
 */
router.put('/profile', 
    requireAuth,
    updateProfileSchema,
    authController.updateProfile.bind(authController)
);

/**
 * PUT /auth/password
 * Changement de mot de passe
 */
router.put('/password', 
    requireAuth,
    changePasswordSchema,
    authController.changePassword.bind(authController)
);

module.exports = router;
