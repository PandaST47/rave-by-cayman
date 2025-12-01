// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Создание зон
  const zones = [
    {
      name: 'VR Зона',
      type: 'vr',
      description: 'Oculus Quest 3 - виртуальная реальность нового поколения',
      pricePerHour: 800,
      totalSlots: 10,
      imageUrl: '/pricing/vr-zone.png',
    },
    {
      name: 'PS5 Зона',
      type: 'ps5',
      description: '15 консолей PlayStation 5 с эксклюзивными играми',
      pricePerHour: 500,
      totalSlots: 15,
      imageUrl: '/pricing/ps5-zone.png',
    },
    {
      name: 'ПК Зона - Базовый',
      type: 'pc-basic',
      description: 'RTX 3060 Ti, i5-12400F, 16GB RAM, 144Hz',
      pricePerHour: 300,
      totalSlots: 20,
      imageUrl: '/pricing/pc-basic.png',
    },
    {
      name: 'ПК Зона - Про',
      type: 'pc-pro',
      description: 'RTX 4070 Ti, i7-13700K, 32GB RAM, 240Hz',
      pricePerHour: 450,
      totalSlots: 25,
      imageUrl: '/pricing/pc-pro.png',
    },
    {
      name: 'ПК Зона - Ультра',
      type: 'pc-ultra',
      description: 'RTX 4090 Ti, i9-14900K, 64GB RAM, 240Hz, 4K',
      pricePerHour: 700,
      totalSlots: 15,
      imageUrl: '/pricing/pc-ultra.png',
    },
    {
      name: 'VIP Комната #1',
      type: 'vip-1',
      description: '5 ПК RTX 4090 Ti в приватной комнате с баром',
      pricePerHour: 1000,
      totalSlots: 5,
      imageUrl: '/pricing/vip-room-2.png',
    },
    {
      name: 'VIP Комната #2',
      type: 'vip-2',
      description: '5 ПК RTX 4090 Ti в приватной комнате с караоке',
      pricePerHour: 1000,
      totalSlots: 5,
      imageUrl: '/pricing/vip-room-1.png',
    },
  ];

  for (const zone of zones) {
    await prisma.zone.upsert({
      where: { name: zone.name },
      update: zone,
      create: zone,
    });
  }

  console.log('Zones created successfully');

  // Создание компьютеров для каждой зоны
  const allZones = await prisma.zone.findMany();
  
  for (const zone of allZones) {
    for (let i = 1; i <= zone.totalSlots; i++) {
      await prisma.computer.upsert({
        where: {
          zoneId_number: {
            zoneId: zone.id,
            number: i,
          },
        },
        update: {},
        create: {
          zoneId: zone.id,
          number: i,
          isActive: true,
        },
      });
    }
  }

  console.log('Computers created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });