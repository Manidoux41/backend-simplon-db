/**
 * Application Express avec architecture MVC
 * Authentification double : Prisma (local) + Supabase (cloud)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Import des routes MVC
const authRoutes = require('./routes/authRoutes');
const supabaseRoutes = require('./routes/supabaseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const transportRoutes = require('./routes/transportRoutes');

// Import des middleware globaux
const { errorHandler, apiLimiter } = require('./middleware/validation');

const app = express();
const prisma = new PrismaClient();

// Configuration des middleware globaux
app.use(cors());
app.use(express.json());
app.use(apiLimiter); // Rate limiting global

// Routes de base
app.get('/health', (req, res) => {
    res.json({ 
        ok: true, 
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Test de connexion Prisma
app.get('/db-test', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ database: 'Prisma connected' });
    } catch (error) {
        res.status(500).json({ 
            database: 'Prisma connection failed',
            error: error.message 
        });
    }
});

// Configuration des routes MVC
app.use('/auth', authRoutes);           // Authentification locale (Prisma)
app.use('/supabase', supabaseRoutes);   // Authentification Supabase
app.use('/admin', adminRoutes);         // Administration (Supabase auth requis)
app.use('/api/users', userRoutes);      // Endpoints utilisateurs
app.use('/api/vehicles', vehicleRoutes); // Gestion des véhicules
app.use('/api/transports', transportRoutes); // Gestion des transports

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route non trouvée',
        method: req.method,
        path: req.originalUrl
    });
});

// Middleware de gestion d'erreurs global
app.use(errorHandler);

module.exports = { app, prisma };
