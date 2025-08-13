/**
 * Middleware de validation et utilitaires
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiting pour l'authentification
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives par IP
    message: { error: 'Trop de tentatives, réessayez plus tard' },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiting général pour l'API
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par IP
    message: { error: 'Trop de requêtes, réessayez plus tard' },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Middleware de gestion d'erreurs
 */
function errorHandler(err, req, res, next) {
    console.error('Erreur:', err);

    // Erreurs de validation Zod
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Données invalides',
            details: err.errors
        });
    }

    // Erreurs Prisma
    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            return res.status(409).json({
                error: 'Ressource déjà existante'
            });
        }
    }

    // Erreur par défaut
    res.status(500).json({
        error: 'Erreur serveur interne'
    });
}

/**
 * Middleware 404
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Endpoint non trouvé',
        path: req.path,
        method: req.method
    });
}

module.exports = {
    authLimiter,
    apiLimiter,
    errorHandler,
    notFoundHandler
};
