/**
 * Controller d'administration
 * Gère les endpoints d'administration avec Supabase
 */

const { supabaseService } = require('../services/supabaseService');

class AdminController {
    /**
     * GET /admin/users
     * Liste tous les utilisateurs (admin uniquement)
     */
    async getAllUsers(req, res) {
        try {
            const { data: { users }, error } = await supabaseService.listUsers();
            
            if (error) {
                return res.status(500).json({ 
                    error: 'Erreur lors de la récupération des utilisateurs' 
                });
            }

            const formattedUsers = users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.user_metadata?.role || 'USER',
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                email_confirmed_at: user.email_confirmed_at
            }));

            res.json({ users: formattedUsers });

        } catch (error) {
            console.error('Erreur admin getAllUsers:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * DELETE /admin/users/:id
     * Supprimer un utilisateur (admin uniquement)
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Empêcher l'auto-suppression
            if (id === req.user.id) {
                return res.status(400).json({ 
                    error: 'Impossible de supprimer votre propre compte' 
                });
            }

            const { error } = await supabaseService.deleteUser(id);

            if (error) {
                return res.status(500).json({ 
                    error: 'Erreur lors de la suppression de l\'utilisateur' 
                });
            }

            res.json({ message: 'Utilisateur supprimé avec succès' });

        } catch (error) {
            console.error('Erreur admin deleteUser:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    /**
     * PUT /admin/users/:id/role
     * Modifier le rôle d'un utilisateur
     */
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
                return res.status(400).json({ error: 'Rôle invalide' });
            }

            // Empêcher l'auto-modification de rôle
            if (id === req.user.id) {
                return res.status(400).json({ 
                    error: 'Impossible de modifier votre propre rôle' 
                });
            }

            const { data, error } = await supabaseService.updateUserMetadata(id, { role });

            if (error) {
                return res.status(500).json({ 
                    error: 'Erreur lors de la modification du rôle' 
                });
            }

            res.json({ 
                message: 'Rôle mis à jour avec succès',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.user_metadata?.role
                }
            });

        } catch (error) {
            console.error('Erreur admin updateUserRole:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

// Instance singleton
const adminController = new AdminController();

module.exports = {
    adminController,
    AdminController
};
