// app/api/user/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

function getMostFrequentZone(bookings: any[]): string {
  if (bookings.length === 0) return 'Нет данных';
  
  const zoneCounts: Record<string, number> = {};
  
  bookings.forEach(booking => {
    const zoneName = booking.zone.name;
    zoneCounts[zoneName] = (zoneCounts[zoneName] || 0) + 1;
  });
  
  const sortedZones = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);
  return sortedZones[0]?.[0] || 'Нет данных';
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: auth.userId },
      include: { zone: true }
    });

    const stats = {
      totalBookings: bookings.length,
      totalHours: bookings.reduce((sum, b) => sum + b.hours, 0),
      totalSpent: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      favoriteZone: getMostFrequentZone(bookings),
      averageSession: bookings.length > 0 
        ? Math.round((bookings.reduce((sum, b) => sum + b.hours, 0) / bookings.length) * 10) / 10
        : 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}