// seed-transport-data.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚌 Seeding transport data...')

  // 1. Créer des lieux
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: "Gare de Lyon",
        address: "Place Louis Armand, 75012 Paris",
        city: "Paris",
        postalCode: "75012",
        country: "France",
        latitude: 48.8449,
        longitude: 2.3733
      }
    }),
    prisma.location.create({
      data: {
        name: "Aéroport Lyon-Saint-Exupéry",
        address: "69125 Colombier-Saugnieu",
        city: "Lyon",
        postalCode: "69125",
        country: "France",
        latitude: 45.7256,
        longitude: 5.0811
      }
    }),
    prisma.location.create({
      data: {
        name: "Gare de Marseille-Saint-Charles",
        address: "Square Narvik, 13001 Marseille",
        city: "Marseille",
        postalCode: "13001",
        country: "France",
        latitude: 43.3035,
        longitude: 5.3808
      }
    }),
    prisma.location.create({
      data: {
        name: "Aéroport Nice Côte d'Azur",
        address: "06206 Nice",
        city: "Nice",
        postalCode: "06206",
        country: "France",
        latitude: 43.6642,
        longitude: 7.2150
      }
    }),
    prisma.location.create({
      data: {
        name: "Place Bellecour",
        address: "Place Bellecour, 69002 Lyon",
        city: "Lyon",
        postalCode: "69002",
        country: "France",
        latitude: 45.7578,
        longitude: 4.8320
      }
    }),
    prisma.location.create({
      data: {
        name: "Vieux-Port de Marseille",
        address: "Quai du Port, 13002 Marseille",
        city: "Marseille",
        postalCode: "13002",
        country: "France",
        latitude: 43.2951,
        longitude: 5.3758
      }
    })
  ])

  console.log(`✅ Created ${locations.length} locations`)

  // 2. Créer des véhicules
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        parkNumber: "CAR-001",
        licensePlate: "AB-123-CD",
        brand: "Mercedes",
        model: "Sprinter",
        year: 2022,
        capacity: 16,
        isActive: true,
        notes: "Véhicule neuf, climatisation"
      }
    }),
    prisma.vehicle.create({
      data: {
        parkNumber: "CAR-002",
        licensePlate: "EF-456-GH",
        brand: "Volkswagen",
        model: "Crafter",
        year: 2021,
        capacity: 12,
        isActive: true,
        notes: "Véhicule récent, GPS intégré"
      }
    }),
    prisma.vehicle.create({
      data: {
        parkNumber: "CAR-003",
        licensePlate: "IJ-789-KL",
        brand: "Iveco",
        model: "Daily",
        year: 2020,
        capacity: 20,
        isActive: true,
        notes: "Grand véhicule, idéal pour groupes"
      }
    }),
    prisma.vehicle.create({
      data: {
        parkNumber: "CAR-004",
        licensePlate: "MN-012-OP",
        brand: "Ford",
        model: "Transit",
        year: 2023,
        capacity: 9,
        isActive: true,
        notes: "Véhicule compact, parfait pour petits groupes"
      }
    }),
    prisma.vehicle.create({
      data: {
        parkNumber: "CAR-005",
        licensePlate: "QR-345-ST",
        brand: "Mercedes",
        model: "Vito",
        year: 2019,
        capacity: 8,
        isActive: false,
        notes: "En maintenance"
      }
    })
  ])

  console.log(`✅ Created ${vehicles.length} vehicles`)

  // 3. Créer des donneurs d'ordre
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Entreprise TechCorp",
        contactName: "Marie Dupont",
        email: "marie.dupont@techcorp.fr",
        phone: "01 23 45 67 89",
        address: "123 Avenue des Champs-Élysées",
        city: "Paris",
        postalCode: "75008",
        notes: "Client régulier, transports d'entreprise"
      }
    }),
    prisma.customer.create({
      data: {
        name: "Association Voyages Seniors",
        contactName: "Jean Martin",
        email: "j.martin@voyages-seniors.org",
        phone: "04 56 78 90 12",
        address: "45 Rue de la République",
        city: "Lyon",
        postalCode: "69002",
        notes: "Voyages organisés pour personnes âgées"
      }
    }),
    prisma.customer.create({
      data: {
        name: "Collège Saint-Antoine",
        contactName: "Sophie Leroy",
        email: "sophie.leroy@college-antoine.edu",
        phone: "04 91 23 45 67",
        address: "78 Boulevard Michelet",
        city: "Marseille",
        postalCode: "13008",
        notes: "Transports scolaires et sorties pédagogiques"
      }
    }),
    prisma.customer.create({
      data: {
        name: "Hôtel Luxe Riviera",
        contactName: "Pierre Moreau",
        email: "p.moreau@luxe-riviera.com",
        phone: "04 93 12 34 56",
        address: "22 Promenade des Anglais",
        city: "Nice",
        postalCode: "06000",
        notes: "Navettes aéroport pour clients VIP"
      }
    }),
    prisma.customer.create({
      data: {
        name: "Agence EventPro",
        contactName: "Laure Bernard",
        email: "laure@eventpro.fr",
        phone: "01 98 76 54 32",
        address: "156 Rue du Faubourg Saint-Honoré",
        city: "Paris",
        postalCode: "75008",
        notes: "Organisation d'événements d'entreprise"
      }
    })
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // 4. Mettre à jour les utilisateurs existants pour en faire des chauffeurs
  const users = await prisma.user.findMany({ where: { role: 'USER' } })
  
  if (users.length > 0) {
    await Promise.all([
      prisma.user.update({
        where: { email: 'alice@example.com' },
        data: {
          firstName: 'Alice',
          lastName: 'Dubois',
          phone: '06 12 34 56 78',
          licenseNumber: 'LIC-001-2023'
        }
      }),
      prisma.user.update({
        where: { email: 'bob@example.com' },
        data: {
          firstName: 'Bob',
          lastName: 'Rousseau',
          phone: '06 98 76 54 32',
          licenseNumber: 'LIC-002-2023'
        }
      })
    ])
    console.log(`✅ Updated ${users.length} drivers`)
  }

  // 5. Créer des transports d'exemple
  const drivers = await prisma.user.findMany({ where: { role: 'USER' } })
  
  if (drivers.length > 0) {
    const transports = await Promise.all([
      // Transport Paris -> Lyon
      prisma.transport.create({
        data: {
          transportNumber: "TRANS-001",
          driverId: drivers[0].id,
          vehicleId: vehicles[0].id,
          customerId: customers[0].id,
          departureLocationId: locations[0].id, // Gare de Lyon Paris
          arrivalLocationId: locations[1].id,   // Aéroport Lyon
          departureDateTime: new Date('2025-08-15T08:00:00Z'),
          arrivalDateTime: new Date('2025-08-15T12:30:00Z'),
          passengerCount: 12,
          distance: 465.5,
          status: 'PLANNED',
          price: 450.00,
          notes: "Transport d'équipe pour séminaire"
        }
      }),
      
      // Transport Lyon -> Marseille avec étapes
      prisma.transport.create({
        data: {
          transportNumber: "TRANS-002",
          driverId: drivers[1].id,
          vehicleId: vehicles[1].id,
          customerId: customers[1].id,
          departureLocationId: locations[4].id, // Place Bellecour Lyon
          arrivalLocationId: locations[2].id,   // Gare Marseille
          departureDateTime: new Date('2025-08-16T09:00:00Z'),
          arrivalDateTime: new Date('2025-08-16T15:00:00Z'),
          passengerCount: 8,
          distance: 315.2,
          status: 'PLANNED',
          price: 320.00,
          notes: "Voyage groupe seniors avec visite"
        }
      }),

      // Transport Marseille -> Nice
      prisma.transport.create({
        data: {
          transportNumber: "TRANS-003",
          driverId: drivers[0].id,
          vehicleId: vehicles[2].id,
          customerId: customers[3].id,
          departureLocationId: locations[5].id, // Vieux-Port Marseille
          arrivalLocationId: locations[3].id,   // Aéroport Nice
          departureDateTime: new Date('2025-08-17T14:00:00Z'),
          arrivalDateTime: new Date('2025-08-17T17:30:00Z'),
          passengerCount: 15,
          distance: 205.8,
          status: 'IN_PROGRESS',
          price: 280.00,
          notes: "Navette hôtel vers aéroport"
        }
      })
    ])

    console.log(`✅ Created ${transports.length} transports`)

    // 6. Ajouter des étapes au transport Lyon -> Marseille
    await prisma.transportStep.create({
      data: {
        transportId: transports[1].id,
        locationId: locations[5].id, // Vieux-Port Marseille
        stepOrder: 1,
        arrivalTime: new Date('2025-08-16T13:30:00Z'),
        departureTime: new Date('2025-08-16T14:00:00Z'),
        passengerChange: -2,
        notes: "Dépose de 2 passagers au Vieux-Port"
      }
    })

    console.log(`✅ Created transport steps`)
  }

  console.log('🎉 Transport data seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding transport data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
