/**
 * Routes pour la gestion des véhicules
 */

const express = require('express');
const { vehicleController } = require('../controllers/vehicleController');
const { requireSupabaseAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

// Middleware d'authentification pour toutes les routes véhicules
router.use(requireSupabaseAuth);

/**
 * GET /api/vehicles
 * Liste des véhicules (accessible aux chauffeurs et admins)
 */
router.get('/', 
    vehicleController.getAllVehicles.bind(vehicleController)
);

/**
 * GET /api/vehicles/:id
 * Détails d'un véhicule (accessible aux chauffeurs et admins)
 */
router.get('/:id', 
    vehicleController.getVehicleById.bind(vehicleController)
);

/**
 * POST /api/vehicles
 * Créer un véhicule (admin uniquement)
 */
router.post('/', 
    requireRole('ADMIN'),
    vehicleController.createVehicle.bind(vehicleController)
);

/**
 * PUT /api/vehicles/:id
 * Modifier un véhicule (admin uniquement)
 */
router.put('/:id', 
    requireRole('ADMIN'),
    vehicleController.updateVehicle.bind(vehicleController)
);

/**
 * DELETE /api/vehicles/:id
 * Supprimer un véhicule (admin uniquement)
 */
router.delete('/:id', 
    requireRole('ADMIN'),
    vehicleController.deleteVehicle.bind(vehicleController)
);

module.exports = router;
