/**
 * Service d'authentification Prisma
 * Gère l'authentification locale avec base de données
 */

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {
        this.prisma = new PrismaClient();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }

    /**
     * Hasher un mot de passe avec Argon2
     */
    async hashPassword(password) {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            timeCost: 3,
            memoryCost: 19456,
            parallelism: 1,
            hashLength: 32
        });
    }

    /**
     * Vérifier un mot de passe
     */
    async verifyPassword(hashedPassword, plainPassword) {
        return await argon2.verify(hashedPassword, plainPassword);
    }

    /**
     * Générer un token JWT local
     */
    generateLocalJWT(user) {
        return jwt.sign(
            { 
                sub: user.id, 
                email: user.email,
                role: user.role 
            },
            this.jwtSecret,
            { 
                expiresIn: '24h',
                issuer: 'api-backend',
                audience: 'api-users'
            }
        );
    }

    /**
     * Vérifier un token JWT local
     */
    verifyLocalJWT(token) {
        return jwt.verify(token, this.jwtSecret);
    }

    /**
     * Créer un utilisateur
     */
    async createUser(email, password, role = 'USER') {
        const hashedPassword = await this.hashPassword(password);
        
        return await this.prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }

    /**
     * Authentifier un utilisateur
     */
    async authenticateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user || !await this.verifyPassword(user.passwordHash, password)) {
            throw new Error('Identifiants invalides');
        }

        const token = this.generateLocalJWT(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        };
    }

    /**
     * Récupérer tous les utilisateurs
     */
    async getAllUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }

    /**
     * Récupérer les statistiques
     */
    async getStats() {
        const [userCount, adminCount, moderatorCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'ADMIN' } }),
            this.prisma.user.count({ where: { role: 'MODERATOR' } })
        ]);

        return {
            userCount,
            adminCount,
            moderatorCount
        };
    }

    /**
     * Compter le nombre total d'utilisateurs
     */
    async getUsersCount() {
        return await this.prisma.user.count();
    }

    /**
     * Mettre à jour le mot de passe d'un utilisateur
     */
    async updatePassword(userId, newPassword) {
        const hashedPassword = await this.hashPassword(newPassword);
        
        return await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
            select: {
                id: true,
                email: true,
                role: true,
                updatedAt: true
            }
        });
    }

    /**
     * Trouver un utilisateur par numéro de permis
     */
    async findUserByLicenseNumber(licenseNumber) {
        return await this.prisma.user.findUnique({
            where: { licenseNumber }
        });
    }

    /**
     * Mettre à jour un utilisateur
     */
    async updateUser(userId, data) {
        return await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                licenseNumber: true,
                licenseExpiryDate: true,
                updatedAt: true
            }
        });
    }
}

// Instance singleton
const authService = new AuthService();

module.exports = {
    authService,
    AuthService
};
