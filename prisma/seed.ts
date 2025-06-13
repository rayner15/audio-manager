import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = [
    'Podcast',
    'Music',
    'Interview',
    'Sound Effect',
    'Field Recording'
  ];

  console.log('📂 Creating categories...');
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName }
    });
    console.log(`✅ Category "${categoryName}" created/updated`);
  }

  // Create default admin user
  console.log('👤 Creating default admin user...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.account.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@audiohub.com',
      password_hash: hashedPassword,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User'
        }
      }
    },
    include: {
      profile: true
    }
  });

  console.log('✅ Admin user created/updated:', {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    profile: adminUser.profile
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 