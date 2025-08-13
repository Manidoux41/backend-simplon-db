import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'admin@example.com', password: 'AdminPass!123', role: 'ADMIN' },
    { email: 'alice@example.com', password: 'StrongPass!123', role: 'USER' },
    { email: 'bob@example.com', password: 'StrongPass!123', role: 'USER' },
    { email: 'carol@example.com', password: 'StrongPass!123', role: 'MODERATOR' },
  ];

  for (const u of users) {
    const passwordHash = await argon2.hash(u.password, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 19456,
      parallelism: 1,
    });
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role },
      create: { email: u.email, passwordHash, role: u.role },
    });
  }

  console.log('Seeded users:', users.map(u => `${u.email} (${u.role})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
