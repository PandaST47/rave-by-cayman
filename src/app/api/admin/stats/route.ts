// app/api/admin/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    // TODO: Добавить проверку прав администратора
    // const user = await prisma.user.findUnique({
    //   where: { id: auth.userId },
    //   select: { isAdmin: true }
    // });
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    // }

    // Получение общей статистики
    const [
      totalUsers,
      activeBookings,
      zones,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count({
        where: {
          status: 'active',
          endTime: { gte: new Date() }
        }
      }),
      prisma.zone.findMany({
        where: { isActive: true },
        include: {
          bookings: {
            where: {
              status: 'active',
              endTime: { gte: new Date() }
            }
          }
        }
      }),
      prisma.booking.aggregate({
        where: { status: { in: ['active', 'completed'] } },
        _sum: { totalPrice: true }
      })
    ]);

    // Расчет статистики по зонам
    const zoneStats = zones.map(zone => {
      const occupiedSlots = zone.bookings.length;
      const occupancyRate = (occupiedSlots / zone.totalSlots) * 100;

      return {
        id: zone.id,
        name: zone.name,
        type: zone.type,
        totalSlots: zone.totalSlots,
        occupiedSlots,
        occupancyRate
      };
    });

    // Общая загрузка
    const totalSlots = zones.reduce((sum, zone) => sum + zone.totalSlots, 0);
    const totalOccupied = zones.reduce((sum, zone) => sum + zone.bookings.length, 0);
    const overallOccupancy = (totalOccupied / totalSlots) * 100;

    const stats = {
      totalUsers,
      activeBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      occupancyRate: overallOccupancy,
      zones: zoneStats
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}