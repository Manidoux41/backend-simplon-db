/**
 * Controller pour la gestion des transports
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransportController {
    /**
     * GET /api/transports
     * Liste tous les transports avec filtres
     */
    async getAllTransports(req, res) {
        try {
            const { 
                status, 
                driverId, 
                vehicleId, 
                customerId,
                from,
                to,
                page = 1,
                limit = 20
            } = req.query;

            const where = {};
            if (status) where.status = status;
            if (driverId) where.driverId = driverId;
            if (vehicleId) where.vehicleId = vehicleId;
            if (customerId) where.customerId = customerId;
            
            if (from || to) {
                where.departureDateTime = {};
                if (from) where.departureDateTime.gte = new Date(from);
                if (to) where.departureDateTime.lte = new Date(to);
            }

            const offset = (parseInt(page) - 1) * parseInt(limit);

            const [transports, total] = await Promise.all([
                prisma.transport.findMany({
                    where,
                    include: {
                        driver: { select: { firstName: true, lastName: true, email: true, phone: true } },
                        vehicle: { select: { parkNumber: true, licensePlate: true, brand: true, model: true } },
                        customer: { select: { name: true, contactName: true, phone: true } },
                        departureLocation: { select: { name: true, city: true, address: true } },
                        arrivalLocation: { select: { name: true, city: true, address: true } },
                        steps: {
                            include: {
                                location: { select: { name: true, city: true } }
                            },
                            orderBy: { stepOrder: 'asc' }
                        }
                    },
                    orderBy: { departureDateTime: 'desc' },
                    skip: offset,
                    take: parseInt(limit)
                }),
                prisma.transport.count({ where })
            ]);

            res.json({
                transports,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            });

        } catch (error) {
            console.error('Erreur getAllTransports:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des transports' });
        }
    }

    /**
     * GET /api/transports/:id
     * Récupérer un transport par ID
     */
    async getTransportById(req, res) {
        try {
            const { id } = req.params;

            const transport = await prisma.transport.findUnique({
                where: { id },
                include: {
                    driver: { 
                        select: { 
                            id: true, firstName: true, lastName: true, 
                            email: true, phone: true, licenseNumber: true 
                        } 
                    },
                    vehicle: { 
                        select: { 
                            id: true, parkNumber: true, licensePlate: true, 
                            brand: true, model: true, capacity: true 
                        } 
                    },
                    customer: { 
                        select: { 
                            id: true, name: true, contactName: true, 
                            email: true, phone: true 
                        } 
                    },
                    departureLocation: true,
                    arrivalLocation: true,
                    steps: {
                        include: {
                            location: true
                        },
                        orderBy: { stepOrder: 'asc' }
                    }
                }
            });

            if (!transport) {
                return res.status(404).json({ error: 'Transport non trouvé' });
            }

            res.json({ transport });

        } catch (error) {
            console.error('Erreur getTransportById:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du transport' });
        }
    }

    /**
     * POST /api/transports
     * Créer un nouveau transport (admin uniquement)
     */
    async createTransport(req, res) {
        try {
            const {
                transportNumber,
                driverId,
                vehicleId,
                customerId,
                departureLocationId,
                arrivalLocationId,
                departureDateTime,
                arrivalDateTime,
                passengerCount,
                distance,
                price,
                notes,
                steps = []
            } = req.body;

            // Créer le transport avec les étapes en transaction
            const result = await prisma.$transaction(async (tx) => {
                // Créer le transport principal
                const transport = await tx.transport.create({
                    data: {
                        transportNumber,
                        driverId,
                        vehicleId,
                        customerId,
                        departureLocationId,
                        arrivalLocationId,
                        departureDateTime: new Date(departureDateTime),
                        arrivalDateTime: new Date(arrivalDateTime),
                        passengerCount: parseInt(passengerCount),
                        distance: distance ? parseFloat(distance) : null,
                        price: price ? parseFloat(price) : null,
                        notes
                    }
                });

                // Créer les étapes si elles existent
                if (steps.length > 0) {
                    await tx.transportStep.createMany({
                        data: steps.map((step, index) => ({
                            transportId: transport.id,
                            locationId: step.locationId,
                            stepOrder: index + 1,
                            arrivalTime: new Date(step.arrivalTime),
                            departureTime: step.departureTime ? new Date(step.departureTime) : null,
                            passengerChange: step.passengerChange || 0,
                            notes: step.notes
                        }))
                    });
                }

                return transport;
            });

            res.status(201).json({
                message: 'Transport créé avec succès',
                transport: result
            });

        } catch (error) {
            console.error('Erreur createTransport:', error);
            
            if (error.code === 'P2002') {
                return res.status(400).json({ 
                    error: 'Ce numéro de transport existe déjà' 
                });
            }
            
            res.status(500).json({ error: 'Erreur lors de la création du transport' });
        }
    }

    /**
     * PUT /api/transports/:id
     * Mettre à jour un transport (admin uniquement)
     */
    async updateTransport(req, res) {
        try {
            const { id } = req.params;
            const {
                transportNumber,
                driverId,
                vehicleId,
                customerId,
                departureLocationId,
                arrivalLocationId,
                departureDateTime,
                arrivalDateTime,
                passengerCount,
                distance,
                status,
                price,
                notes
            } = req.body;

            const updateData = {};
            if (transportNumber !== undefined) updateData.transportNumber = transportNumber;
            if (driverId !== undefined) updateData.driverId = driverId;
            if (vehicleId !== undefined) updateData.vehicleId = vehicleId;
            if (customerId !== undefined) updateData.customerId = customerId;
            if (departureLocationId !== undefined) updateData.departureLocationId = departureLocationId;
            if (arrivalLocationId !== undefined) updateData.arrivalLocationId = arrivalLocationId;
            if (departureDateTime !== undefined) updateData.departureDateTime = new Date(departureDateTime);
            if (arrivalDateTime !== undefined) updateData.arrivalDateTime = new Date(arrivalDateTime);
            if (passengerCount !== undefined) updateData.passengerCount = parseInt(passengerCount);
            if (distance !== undefined) updateData.distance = distance ? parseFloat(distance) : null;
            if (status !== undefined) updateData.status = status;
            if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
            if (notes !== undefined) updateData.notes = notes;

            const transport = await prisma.transport.update({
                where: { id },
                data: updateData,
                include: {
                    driver: { select: { firstName: true, lastName: true } },
                    vehicle: { select: { parkNumber: true, licensePlate: true } },
                    customer: { select: { name: true } }
                }
            });

            res.json({
                message: 'Transport mis à jour avec succès',
                transport
            });

        } catch (error) {
            console.error('Erreur updateTransport:', error);
            
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Transport non trouvé' });
            }
            
            res.status(500).json({ error: 'Erreur lors de la mise à jour du transport' });
        }
    }

    /**
     * DELETE /api/transports/:id
     * Supprimer un transport (admin uniquement)
     */
    async deleteTransport(req, res) {
        try {
            const { id } = req.params;

            await prisma.transport.delete({
                where: { id }
            });

            res.json({ message: 'Transport supprimé avec succès' });

        } catch (error) {
            console.error('Erreur deleteTransport:', error);
            
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Transport non trouvé' });
            }
            
            res.status(500).json({ error: 'Erreur lors de la suppression du transport' });
        }
    }

    /**
     * GET /api/transports/driver/:driverId
     * Récupérer les transports d'un chauffeur
     */
    async getTransportsByDriver(req, res) {
        try {
            const { driverId } = req.params;
            const { status, from, to } = req.query;

            const where = { driverId };
            if (status) where.status = status;
            
            if (from || to) {
                where.departureDateTime = {};
                if (from) where.departureDateTime.gte = new Date(from);
                if (to) where.departureDateTime.lte = new Date(to);
            }

            const transports = await prisma.transport.findMany({
                where,
                include: {
                    vehicle: { select: { parkNumber: true, licensePlate: true } },
                    customer: { select: { name: true, contactName: true } },
                    departureLocation: { select: { name: true, city: true } },
                    arrivalLocation: { select: { name: true, city: true } },
                    steps: {
                        include: {
                            location: { select: { name: true, city: true } }
                        },
                        orderBy: { stepOrder: 'asc' }
                    }
                },
                orderBy: { departureDateTime: 'asc' }
            });

            res.json({ transports });

        } catch (error) {
            console.error('Erreur getTransportsByDriver:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des transports du chauffeur' });
        }
    }
}

// Instance singleton
const transportController = new TransportController();

module.exports = {
    transportController,
    TransportController
};
