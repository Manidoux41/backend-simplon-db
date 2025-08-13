/**
 * Controller pour la gestion des véhicules
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class VehicleController {
    /**
     * GET /api/vehicles
     * Liste tous les véhicules
     */
    async getAllVehicles(req, res) {
        try {
            const { active } = req.query;
            
            const where = {};
            if (active !== undefined) {
                where.isActive = active === 'true';
            }

            const vehicles = await prisma.vehicle.findMany({
                where,
                orderBy: { parkNumber: 'asc' },
                include: {
                    _count: {
                        select: { transports: true }
                    }
                }
            });

            res.json({ vehicles });

        } catch (error) {
            console.error('Erreur getAllVehicles:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
        }
    }

    /**
     * GET /api/vehicles/:id
     * Récupérer un véhicule par ID
     */
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;

            const vehicle = await prisma.vehicle.findUnique({
                where: { id },
                include: {
                    transports: {
                        include: {
                            driver: { select: { firstName: true, lastName: true, email: true } },
                            customer: { select: { name: true } },
                            departureLocation: { select: { name: true, city: true } },
                            arrivalLocation: { select: { name: true, city: true } }
                        },
                        orderBy: { departureDateTime: 'desc' },
                        take: 10
                    }
                }
            });

            if (!vehicle) {
                return res.status(404).json({ error: 'Véhicule non trouvé' });
            }

            res.json({ vehicle });

        } catch (error) {
            console.error('Erreur getVehicleById:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du véhicule' });
        }
    }

    /**
     * POST /api/vehicles
     * Créer un nouveau véhicule (admin uniquement)
     */
    async createVehicle(req, res) {
        try {
            const {
                parkNumber,
                licensePlate,
                brand,
                model,
                year,
                capacity,
                notes
            } = req.body;

            const vehicle = await prisma.vehicle.create({
                data: {
                    parkNumber,
                    licensePlate,
                    brand,
                    model,
                    year: year ? parseInt(year) : null,
                    capacity: parseInt(capacity),
                    notes
                }
            });

            res.status(201).json({ 
                message: 'Véhicule créé avec succès',
                vehicle 
            });

        } catch (error) {
            console.error('Erreur createVehicle:', error);
            
            if (error.code === 'P2002') {
                return res.status(400).json({ 
                    error: 'Ce numéro de parc ou cette plaque d\'immatriculation existe déjà' 
                });
            }
            
            res.status(500).json({ error: 'Erreur lors de la création du véhicule' });
        }
    }

    /**
     * PUT /api/vehicles/:id
     * Mettre à jour un véhicule (admin uniquement)
     */
    async updateVehicle(req, res) {
        try {
            const { id } = req.params;
            const {
                parkNumber,
                licensePlate,
                brand,
                model,
                year,
                capacity,
                isActive,
                notes
            } = req.body;

            const updateData = {};
            if (parkNumber !== undefined) updateData.parkNumber = parkNumber;
            if (licensePlate !== undefined) updateData.licensePlate = licensePlate;
            if (brand !== undefined) updateData.brand = brand;
            if (model !== undefined) updateData.model = model;
            if (year !== undefined) updateData.year = year ? parseInt(year) : null;
            if (capacity !== undefined) updateData.capacity = parseInt(capacity);
            if (isActive !== undefined) updateData.isActive = isActive;
            if (notes !== undefined) updateData.notes = notes;

            const vehicle = await prisma.vehicle.update({
                where: { id },
                data: updateData
            });

            res.json({ 
                message: 'Véhicule mis à jour avec succès',
                vehicle 
            });

        } catch (error) {
            console.error('Erreur updateVehicle:', error);
            
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Véhicule non trouvé' });
            }
            
            if (error.code === 'P2002') {
                return res.status(400).json({ 
                    error: 'Ce numéro de parc ou cette plaque d\'immatriculation existe déjà' 
                });
            }
            
            res.status(500).json({ error: 'Erreur lors de la mise à jour du véhicule' });
        }
    }

    /**
     * DELETE /api/vehicles/:id
     * Supprimer un véhicule (admin uniquement)
     */
    async deleteVehicle(req, res) {
        try {
            const { id } = req.params;

            // Vérifier s'il y a des transports associés
            const transportsCount = await prisma.transport.count({
                where: { vehicleId: id }
            });

            if (transportsCount > 0) {
                return res.status(400).json({ 
                    error: 'Impossible de supprimer ce véhicule car il a des transports associés' 
                });
            }

            await prisma.vehicle.delete({
                where: { id }
            });

            res.json({ message: 'Véhicule supprimé avec succès' });

        } catch (error) {
            console.error('Erreur deleteVehicle:', error);
            
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Véhicule non trouvé' });
            }
            
            res.status(500).json({ error: 'Erreur lors de la suppression du véhicule' });
        }
    }
}

// Instance singleton
const vehicleController = new VehicleController();

module.exports = {
    vehicleController,
    VehicleController
};
