/**
 * Middleware de gestion des rôles utilisateur
 * Vérifie les permissions en fonction des rôles
 */

/**
 * Hiérarchie des rôles
 */
const ROLE_HIERARCHY = {
    'USER': 1,
    'MODERATOR': 2,
    'ADMIN': 3
};

/**
 * Middleware pour vérifier les rôles utilisateur
 */
function requireRole(requiredRole) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Non authentifié' });
            }

            // Récupérer le rôle depuis les métadonnées utilisateur
            const userRole = req.user.user_metadata?.role || 'USER';

            // Vérifier les permissions
            const userLevel = ROLE_HIERARCHY[userRole] || 1;
            const requiredLevel = ROLE_HIERARCHY[requiredRole] || 1;

            if (userLevel < requiredLevel) {
                return res.status(403).json({ 
                    error: 'Permissions insuffisantes',
                    userRole,
                    requiredRole
                });
            }

            req.userRole = userRole;
            next();
        } catch (error) {
            console.error('Erreur vérification rôle:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    };
}

/**
 * Middleware pour admin uniquement
 */
const requireAdmin = requireRole('ADMIN');

/**
 * Middleware pour modérateur et plus
 */
const requireModerator = requireRole('MODERATOR');

/**
 * Middleware pour utilisateur connecté (any role)
 */
const requireUser = requireRole('USER');

module.exports = {
    requireRole,
    requireAdmin,
    requireModerator,
    requireUser,
    ROLE_HIERARCHY
};
