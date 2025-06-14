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
  const hashedPassword = await bcrypt.hash('johndoe12345', 12);
  
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

  // Create sample audio files
  console.log('🎵 Creating sample audio files...');
  
  const sampleAudioFiles = [
    {
      id: '615da42b-ffea-4944-a0aa-6c1db442fe66',
      accountId: 'd18dc4fd-1824-42df-8796-c34186bcedec',
      categoryId: '2413213a-ee58-44d7-ad98-f4c16192b7e',
      fileName: 'Soft.mp3',
      filePath: 'uploads/d18dc4fd-1824-42df-8796-c34186bcedec_Soft.mp3',
      description: 'A gentle and mellow track, ideal for relaxation or background ambience.',
      mimeType: 'audio/mpeg',
      sizeBytes: 616907,
      uploadedAt: new Date('2025-06-14 09:44:44.611')
    },
    {
      id: '69e9c060-95fe-4d64-a9c3-5dd6d20edc93',
      accountId: 'd18dc4fd-1824-42df-8796-c34186bcedec',
      categoryId: '3b632863-6c7f-45db-aac1-80995fd45785',
      fileName: 'Soulful Piano.mp3',
      filePath: 'uploads/d18dc4fd-1824-42df-8796-c34186bcedec_Soulful_Piano.mp3',
      description: 'A sentimental and melodic tune that evokes warm, nostalgic feelings.',
      mimeType: 'audio/mpeg',
      sizeBytes: 550034,
      uploadedAt: new Date('2025-06-14 09:44:44.638')
    },
    {
      id: '8c36652e-ee33-474e-a78e-957cb6b0f1f8',
      accountId: 'd18dc4fd-1824-42df-8796-c34186bcedec',
      categoryId: '3b632863-6c7f-45db-aac1-80995fd45785',
      fileName: 'Ambience.mp3',
      filePath: 'uploads/d18dc4fd-1824-42df-8796-c34186bcedec_Ambience.mp3',
      description: 'An atmospheric soundscape, perfect for setting a calm or immersive mood.',
      mimeType: 'audio/mpeg',
      sizeBytes: 300930,
      uploadedAt: new Date('2025-06-14 09:44:44.628')
    },
    {
      id: '9c2b04ef-4df9-469f-b249-397700a44389',
      accountId: 'd18dc4fd-1824-42df-8796-c34186bcedec',
      categoryId: 'e39ab50f-c9c0-4d34-8e7e-de72588642a8',
      fileName: 'Nostalgia Sweet.mp3',
      filePath: 'uploads/d18dc4fd-1824-42df-8796-c34186bcedec_Nostalgia_Sweet.mp3',
      description: 'An expressive piano piece rich with emotion and heartfelt tones.',
      mimeType: 'audio/mpeg',
      sizeBytes: 825600,
      uploadedAt: new Date('2025-06-14 09:44:44.650')
    }
  ];

  for (const audioFile of sampleAudioFiles) {
    await prisma.audioFile.upsert({
      where: { id: audioFile.id },
      update: audioFile,
      create: audioFile
    });
    console.log(`✅ Audio file "${audioFile.fileName}" created/updated`);
  }

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