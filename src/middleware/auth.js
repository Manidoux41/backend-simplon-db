/**
 * Middleware d'authentification Supabase et JWT local
 * Gère la vérification des tokens JWT et l'authentification des utilisateurs
 */

const jwt = require('jsonwebtoken');
const { supabaseService } = require('../services/supabaseService');

/**
 * Middleware pour vérifier les tokens Supabase
 */
async function requireSupabaseAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];

        // Vérifier le token avec Supabase
        const { data: { user }, error } = await supabaseService.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token invalide' });
        }

        // Ajouter l'utilisateur au request
        req.user = user;
        req.supabase = supabaseService.getAdminClient();
        
        next();
    } catch (error) {
        console.error('Erreur auth Supabase:', error);
        res.status(401).json({ error: 'Erreur d\'authentification' });
    }
}

/**
 * Middleware optionnel d'authentification (n'échoue pas si pas de token)
 */
async function optionalSupabaseAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabaseService.getUser(token);
            
            if (!error && user) {
                req.user = user;
                req.supabase = supabaseService.getAdminClient();
            }
        }
        
        next();
    } catch (error) {
        // En cas d'erreur, on continue sans utilisateur
        next();
    }
}

/**
 * Middleware d'authentification pour JWT local (Prisma)
 */
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token d\'authentification requis' });
        }

        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expiré' });
            }
            return res.status(401).json({ error: 'Token invalide' });
        }
        
    } catch (error) {
        console.error('Erreur requireAuth:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {
    requireSupabaseAuth,
    optionalSupabaseAuth,
    requireAuth
};
