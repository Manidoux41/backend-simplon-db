/**
 * Routes pour l'authentification Supabase
 */

const express = require('express');
const { supabaseAuthController } = require('../controllers/supabaseAuthController');
const { requireSupabaseAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/validation');
const { registerSchema, loginSchema, refreshSchema } = require('../utils/validation');

const router = express.Router();

/**
 * POST /supabase/register
 * Inscription avec Supabase
 */
router.post('/register', 
    authLimiter,
    registerSchema,
    supabaseAuthController.register.bind(supabaseAuthController)
);

/**
 * POST /supabase/login
 * Connexion avec Supabase
 */
router.post('/login', 
    authLimiter,
    loginSchema,
    supabaseAuthController.login.bind(supabaseAuthController)
);

/**
 * POST /supabase/refresh
 * Renouvellement du token
 */
router.post('/refresh', 
    refreshSchema,
    supabaseAuthController.refresh.bind(supabaseAuthController)
);

/**
 * POST /supabase/logout
 * Déconnexion
 */
router.post('/logout', 
    requireSupabaseAuth,
    supabaseAuthController.logout.bind(supabaseAuthController)
);

/**
 * GET /supabase/profile
 * Profil utilisateur Supabase
 */
router.get('/profile', 
    requireSupabaseAuth,
    supabaseAuthController.getProfile.bind(supabaseAuthController)
);

module.exports = router;
