/**
 * Routes d'administration
 */

const express = require('express');
const { adminController } = require('../controllers/adminController');
const { requireSupabaseAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { updateRoleSchema } = require('../utils/validation');

const router = express.Router();

// Middleware global pour toutes les routes admin
router.use(requireSupabaseAuth);
router.use(requireRole('ADMIN'));

/**
 * GET /admin/users
 * Liste de tous les utilisateurs
 */
router.get('/users', 
    adminController.getAllUsers.bind(adminController)
);

/**
 * DELETE /admin/users/:id
 * Supprimer un utilisateur
 */
router.delete('/users/:id', 
    adminController.deleteUser.bind(adminController)
);

/**
 * PUT /admin/users/:id/role
 * Modifier le rôle d'un utilisateur
 */
router.put('/users/:id/role', 
    updateRoleSchema,
    adminController.updateUserRole.bind(adminController)
);

module.exports = router;
