/**
 * Routes pour la gestion des transports
 */

const express = require('express');
const { transportController } = require('../controllers/transportController');
const { requireSupabaseAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

// Middleware d'authentification pour toutes les routes transport
router.use(requireSupabaseAuth);

/**
 * GET /api/transports
 * Liste des transports avec filtres (tous utilisateurs)
 */
router.get('/', 
    transportController.getAllTransports.bind(transportController)
);

/**
 * GET /api/transports/:id
 * Détails d'un transport (tous utilisateurs)
 */
router.get('/:id', 
    transportController.getTransportById.bind(transportController)
);

/**
 * GET /api/transports/driver/:driverId
 * Transports d'un chauffeur spécifique
 */
router.get('/driver/:driverId', 
    transportController.getTransportsByDriver.bind(transportController)
);

/**
 * POST /api/transports
 * Créer un transport (admin uniquement)
 */
router.post('/', 
    requireRole('ADMIN'),
    transportController.createTransport.bind(transportController)
);

/**
 * PUT /api/transports/:id
 * Modifier un transport (admin uniquement)
 */
router.put('/:id', 
    requireRole('ADMIN'),
    transportController.updateTransport.bind(transportController)
);

/**
 * DELETE /api/transports/:id
 * Supprimer un transport (admin uniquement)
 */
router.delete('/:id', 
    requireRole('ADMIN'),
    transportController.deleteTransport.bind(transportController)
);

module.exports = router;
