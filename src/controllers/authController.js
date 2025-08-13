/**
 * Controller pour l'authentification locale avec Prisma
 * Gère les endpoints d'auth traditionnelle (mot de passe hashé)
 */

const { authService } = require('../services/authService');
const jwt = require('jsonwebtoken');

class AuthController {
    /**
     * POST /auth/register
     * Inscription locale avec Prisma
     */
    async register(req, res) {
        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            const existingUser = await authService.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
            }

            // Créer l'utilisateur
            const user = await authService.createUser(email, password);

            // Générer le token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Erreur register local:', error);
            
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }
            
            res.status(500).json({ error: 'Erreur lors de la création du compte' });
        }
    }

    /**
     * POST /auth/login
     * Connexion locale avec Prisma
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Vérifier les identifiants
            const user = await authService.verifyCredentials(email, password);
            if (!user) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Erreur login local:', error);
            res.status(500).json({ error: 'Erreur lors de la connexion' });
        }
    }

    /**
     * GET /auth/profile
     * Profil utilisateur (nécessite auth locale)
     */
    async getProfile(req, res) {
        try {
            const user = await authService.findUserById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    licenseNumber: user.licenseNumber,
                    licenseExpiryDate: user.licenseExpiryDate,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });

        } catch (error) {
            console.error('Erreur getProfile local:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
        }
    }

    /**
     * PUT /auth/profile
     * Mise à jour du profil utilisateur
     */
    async updateProfile(req, res) {
        try {
            const { 
                email, 
                firstName, 
                lastName, 
                phoneNumber, 
                licenseNumber, 
                licenseExpiryDate 
            } = req.body;
            const userId = req.user.id;

            // Vérifier si le nouvel email n'est pas déjà pris
            if (email && email !== req.user.email) {
                const existingUser = await authService.findUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
                }
            }

            // Vérifier si le nouveau numéro de permis n'est pas déjà pris
            if (licenseNumber) {
                const existingLicense = await authService.findUserByLicenseNumber(licenseNumber);
                if (existingLicense && existingLicense.id !== userId) {
                    return res.status(400).json({ error: 'Ce numéro de permis est déjà utilisé' });
                }
            }

            const updateData = {};
            if (email !== undefined) updateData.email = email;
            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber;
            if (licenseExpiryDate !== undefined) updateData.licenseExpiryDate = licenseExpiryDate ? new Date(licenseExpiryDate) : null;

            const updatedUser = await authService.updateUser(userId, updateData);

            res.json({
                message: 'Profil mis à jour avec succès',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    phoneNumber: updatedUser.phoneNumber,
                    licenseNumber: updatedUser.licenseNumber,
                    licenseExpiryDate: updatedUser.licenseExpiryDate,
                    updatedAt: updatedUser.updatedAt
                }
            });

        } catch (error) {
            console.error('Erreur updateProfile local:', error);
            
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email ou numéro de permis déjà utilisé' });
            }
            
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    }

    /**
     * PUT /auth/password
     * Changement de mot de passe
     */
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Vérifier le mot de passe actuel
            const user = await authService.verifyCredentials(req.user.email, currentPassword);
            if (!user) {
                return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
            }

            // Mettre à jour le mot de passe
            await authService.updatePassword(userId, newPassword);

            res.json({ message: 'Mot de passe mis à jour avec succès' });

        } catch (error) {
            console.error('Erreur changePassword:', error);
            res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
        }
    }
}

// Instance singleton
const authController = new AuthController();

module.exports = {
    authController,
    AuthController
};
