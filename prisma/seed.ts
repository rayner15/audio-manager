import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface CategorySeed {
  id: string;
  name: string;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  const categories: CategorySeed[] = [
    { id: "265bf590-9dec-437c-9651-9ad0877abbc2", name: 'Podcast' },
    { id: "3b632863-6c7f-45db-aac1-80995fd45785", name: 'Music' },
    { id: '73e8bddb-94f1-4475-a802-44bec5e68baf', name: 'Interview' },
    { id: 'e39ab50f-c9c0-4d34-8e7e-de72588642a8', name: 'Sound Effect' },
    { id: '2413213a-ee58-44d7-ad98-f4c16192b7e', name: 'Field Recording' }
  ];

  console.log('📂 Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: { 
        id: category.id,
        name: category.name 
      }
    });
    console.log(`✅ Category "${category.name}" created/updated`);
  }

  // Create default user with fixed UUID
  console.log('👤 Creating default user...');
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const defaultUser = await prisma.account.upsert({
    where: { id:"d18dc4fd-1824-42df-8796-c34186bcedec" },
    update: {
      username: 'john_doe',
      email: 'john_doe@example.com',
      password_hash: hashedPassword,
    },
    create: {
      id: "d18dc4fd-1824-42df-8796-c34186bcedec" ,
      username: 'john_doe',
      email: 'john_doe@example.com',
      password_hash: hashedPassword,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    },
    include: {
      profile: true
    }
  });

  console.log('✅ Default user created/updated:', {
    id: defaultUser.id,
    username: defaultUser.username,
    email: defaultUser.email,
    profile: defaultUser.profile
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