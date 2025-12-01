// app/api/zones/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const zones = await prisma.zone.findMany({
      where: { isActive: true },
      include: {
        computers: {
          where: { isActive: true }
        },
        bookings: {
          where: {
            status: 'active',
            endTime: {
              gte: new Date()
            }
          }
        }
      }
    });

    // Подсчет занятых мест
    const zonesWithAvailability = zones.map(zone => {
      const occupiedSlots = zone.bookings.length;
      const totalSlots = zone.totalSlots;

      return {
        id: zone.id,
        name: zone.name,
        type: zone.type,
        description: zone.description,
        pricePerHour: zone.pricePerHour,
        totalSlots,
        occupiedSlots,
        imageUrl: zone.imageUrl,
      };
    });

    return NextResponse.json({ zones: zonesWithAvailability });

  } catch (error) {
    console.error('Get zones error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}