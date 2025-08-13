/**
 * Controller d'authentification Supabase
 * Gère les endpoints d'authentification
 */

const { supabaseService } = require('../services/supabaseService');
const { z } = require('zod');

// Schémas de validation
const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)'),
    role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional().default('USER')
});

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis')
});

const refreshSchema = z.object({
    refresh_token: z.string().min(1, 'Refresh token requis')
});

class SupabaseAuthController {
    /**
     * POST /register
     * Inscription d'un nouvel utilisateur
     */
    async register(req, res) {
        try {
            const { email, password, role } = registerSchema.parse(req.body);

            const { data, error } = await supabaseService.createUser(email, password, role);

            if (error) {
                console.error('Erreur Supabase register:', error);
                return res.status(400).json({ 
                    error: error.message || 'Erreur lors de l\'inscription' 
                });
            }

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.user_metadata?.role || 'USER'
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ 
                    error: 'Données invalides', 
                    details: error.errors 
                });
            }
            
            console.error('Erreur register:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * POST /login
     * Connexion d'un utilisateur
     */
    async login(req, res) {
        try {
            const { email, password } = loginSchema.parse(req.body);

            const { data, error } = await supabaseService.signInUser(email, password);

            if (error) {
                console.error('Erreur Supabase login:', error);
                return res.status(401).json({ 
                    error: 'Identifiants invalides' 
                });
            }

            res.json({
                message: 'Connexion réussie',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.user_metadata?.role || 'USER'
                },
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ 
                    error: 'Données invalides', 
                    details: error.errors 
                });
            }
            
            console.error('Erreur login:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * POST /refresh
     * Renouvellement du token
     */
    async refresh(req, res) {
        try {
            const { refresh_token } = refreshSchema.parse(req.body);

            const { data, error } = await supabaseService.refreshSession(refresh_token);

            if (error) {
                return res.status(401).json({ error: 'Refresh token invalide' });
            }

            res.json({
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ 
                    error: 'Données invalides', 
                    details: error.errors 
                });
            }
            
            console.error('Erreur refresh:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * POST /logout
     * Déconnexion
     */
    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                await supabaseService.signOut(token);
            }

            res.json({ message: 'Déconnexion réussie' });

        } catch (error) {
            console.error('Erreur logout:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * GET /me
     * Profil utilisateur
     */
    async getProfile(req, res) {
        try {
            res.json({ 
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.user_metadata?.role || 'USER'
                }
            });
        } catch (error) {
            console.error('Erreur getProfile:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

// Instance singleton
const supabaseAuthController = new SupabaseAuthController();

module.exports = {
    supabaseAuthController,
    SupabaseAuthController
};
