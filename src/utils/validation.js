/**
 * Schémas de validation Zod
 */

const { z } = require('zod');

// Schémas de base
const emailSchema = z.string().email('Email invalide');
const passwordSchema = z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères');
const roleSchema = z.enum(['USER', 'MODERATOR', 'ADMIN'], {
    errorMap: () => ({ message: 'Rôle invalide' })
});

// Schémas pour les informations personnelles
const phoneNumberSchema = z.string()
    .regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone français invalide (ex: +33123456789 ou 0123456789)')
    .optional();

const licenseNumberSchema = z.string()
    .min(1, 'Numéro de permis requis')
    .optional();

const licenseExpiryDateSchema = z.string()
    .datetime('Date d\'expiration invalide')
    .optional();

// Schémas pour l'authentification
const registerSchema = (req, res, next) => {
    const schema = z.object({
        email: emailSchema,
        password: passwordSchema
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Données invalides',
            details: error.errors
        });
    }
};

const loginSchema = (req, res, next) => {
    const schema = z.object({
        email: emailSchema,
        password: z.string().min(1, 'Mot de passe requis')
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Données invalides',
            details: error.errors
        });
    }
};

const refreshSchema = (req, res, next) => {
    const schema = z.object({
        refresh_token: z.string().min(1, 'Refresh token requis')
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Refresh token invalide',
            details: error.errors
        });
    }
};

const updateProfileSchema = (req, res, next) => {
    const schema = z.object({
        email: emailSchema.optional(),
        firstName: z.string().min(1, 'Prénom requis').optional(),
        lastName: z.string().min(1, 'Nom de famille requis').optional(),
        phoneNumber: phoneNumberSchema,
        licenseNumber: licenseNumberSchema,
        licenseExpiryDate: licenseExpiryDateSchema
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Données invalides',
            details: error.errors
        });
    }
};

const changePasswordSchema = (req, res, next) => {
    const schema = z.object({
        currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
        newPassword: passwordSchema
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Données invalides',
            details: error.errors
        });
    }
};

const updateRoleSchema = (req, res, next) => {
    const schema = z.object({
        role: roleSchema
    });

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Rôle invalide',
            details: error.errors
        });
    }
};

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema,
    updateProfileSchema,
    changePasswordSchema,
    updateRoleSchema,
    emailSchema,
    passwordSchema,
    roleSchema,
    phoneNumberSchema,
    licenseNumberSchema,
    licenseExpiryDateSchema
};
