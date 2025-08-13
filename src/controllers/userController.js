/**
 * Controller pour les utilisateurs
 * Gère les endpoints publics et utilisateur
 */

const { supabaseService } = require('../services/supabaseService');
const { authService } = require('../services/authService');

class UserController {
    /**
     * GET /api/users/public
     * Endpoint public de test
     */
    async getPublicInfo(req, res) {
        try {
            res.json({
                message: 'Endpoint public accessible',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        } catch (error) {
            console.error('Erreur getPublicInfo:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * GET /api/users/stats
     * Statistiques générales (nécessite auth)
     */
    async getStats(req, res) {
        try {
            // Compter les utilisateurs locaux (Prisma)
            const localUsersCount = await authService.getUsersCount();

            // Compter les utilisateurs Supabase
            const { data: { users }, error } = await supabaseService.listUsers();
            const supabaseUsersCount = error ? 0 : users.length;

            res.json({
                stats: {
                    localUsers: localUsersCount,
                    supabaseUsers: supabaseUsersCount,
                    totalUsers: localUsersCount + supabaseUsersCount
                },
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }
            });

        } catch (error) {
            console.error('Erreur getStats:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
        }
    }

    /**
     * GET /api/users/protected
     * Endpoint protégé simple
     */
    async getProtectedInfo(req, res) {
        try {
            res.json({
                message: 'Vous êtes connecté!',
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    authType: req.user.aud ? 'supabase' : 'local' // aud présent pour Supabase
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erreur getProtectedInfo:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * GET /api/users/moderator
     * Endpoint pour modérateurs et admins
     */
    async getModeratorInfo(req, res) {
        try {
            const userRole = req.user.role || req.user.user_metadata?.role;

            res.json({
                message: 'Accès modérateur accordé',
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: userRole
                },
                permissions: ['read', 'moderate'],
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erreur getModeratorInfo:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

// Instance singleton
const userController = new UserController();

module.exports = {
    userController,
    UserController
};
