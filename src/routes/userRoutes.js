/**
 * Routes pour les utilisateurs
 */

const express = require('express');
const { userController } = require('../controllers/userController');
const { requireSupabaseAuth, requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/users/public
 * Endpoint public de test
 */
router.get('/public', 
    userController.getPublicInfo.bind(userController)
);

/**
 * GET /api/users/protected
 * Endpoint protégé (auth locale ou Supabase)
 * Accepte les deux types d'authentification
 */
router.get('/protected', 
    (req, res, next) => {
        // Middleware flexible qui accepte auth locale OU Supabase
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token d\'authentification requis' });
        }

        // Essayer d'abord l'auth Supabase, puis locale en fallback
        requireSupabaseAuth(req, res, (error) => {
            if (error) {
                // Si Supabase échoue, essayer l'auth locale
                requireAuth(req, res, next);
            } else {
                next();
            }
        });
    },
    userController.getProtectedInfo.bind(userController)
);

/**
 * GET /api/users/stats
 * Statistiques (nécessite auth Supabase)
 */
router.get('/stats', 
    requireSupabaseAuth,
    userController.getStats.bind(userController)
);

/**
 * GET /api/users/moderator
 * Endpoint modérateur (nécessite auth Supabase + rôle MODERATOR/ADMIN)
 */
router.get('/moderator', 
    requireSupabaseAuth,
    requireRole('MODERATOR'),
    userController.getModeratorInfo.bind(userController)
);

module.exports = router;
