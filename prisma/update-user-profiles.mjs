// update-user-profiles.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📝 Mise à jour des profils utilisateurs...')

  // Mettre à jour les utilisateurs existants avec des informations complètes
  const updates = await Promise.all([
    // Alice - Chauffeur expérimenté
    prisma.user.update({
      where: { email: 'alice@example.com' },
      data: {
        firstName: 'Alice',
        lastName: 'Dubois',
        phoneNumber: '+33612345678',
        licenseNumber: 'LIC-001-2020',
        licenseExpiryDate: new Date('2030-12-15')
      }
    }),

    // Bob - Jeune chauffeur
    prisma.user.update({
      where: { email: 'bob@example.com' },
      data: {
        firstName: 'Bob',
        lastName: 'Rousseau',
        phoneNumber: '+33687654321',
        licenseNumber: 'LIC-002-2022',
        licenseExpiryDate: new Date('2032-03-20')
      }
    }),

    // Carol - Modérateur/Superviseur
    prisma.user.update({
      where: { email: 'carol@example.com' },
      data: {
        firstName: 'Carol',
        lastName: 'Martin',
        phoneNumber: '+33698765432',
        licenseNumber: 'LIC-003-2018',
        licenseExpiryDate: new Date('2028-08-10')
      }
    }),

    // Admin - Gestionnaire de flotte
    prisma.user.update({
      where: { email: 'admin@example.com' },
      data: {
        firstName: 'Pierre',
        lastName: 'Administrateur',
        phoneNumber: '+33123456789',
        // Pas de permis nécessaire pour l'admin
        licenseNumber: null,
        licenseExpiryDate: null
      }
    })
  ])

  console.log(`✅ Mis à jour ${updates.length} profils utilisateurs`)
  
  // Afficher les utilisateurs mis à jour
  const users = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      licenseNumber: true,
      licenseExpiryDate: true,
      role: true
    }
  })

  console.log('\n👥 Utilisateurs mis à jour:')
  users.forEach(user => {
    console.log(`- ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`  Rôle: ${user.role}`)
    console.log(`  Téléphone: ${user.phoneNumber || 'Non renseigné'}`)
    console.log(`  Permis: ${user.licenseNumber || 'Non renseigné'}`)
    console.log(`  Expiration permis: ${user.licenseExpiryDate ? user.licenseExpiryDate.toLocaleDateString('fr-FR') : 'N/A'}`)
    console.log('')
  })

  console.log('🎉 Mise à jour des profils terminée!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la mise à jour:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
