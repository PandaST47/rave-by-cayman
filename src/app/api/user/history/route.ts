// app/api/user/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const [bookings, transactions, tickets] = await Promise.all([
      // История бронирований
      prisma.booking.findMany({
        where: { userId: auth.userId },
        include: {
          zone: {
            select: {
              name: true,
              type: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // История транзакций
      prisma.transaction.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // История тикетов
      prisma.ticket.findMany({
        where: { userId: auth.userId },
        select: {
          id: true,
          subject: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return NextResponse.json({
      bookings,
      transactions,
      tickets
    });

  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}