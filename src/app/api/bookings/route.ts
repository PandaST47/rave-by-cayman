// app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { bookingSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    // Получение зоны
    const zone = await prisma.zone.findUnique({
      where: { id: validated.zoneId },
      include: {
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

    if (!zone) {
      return NextResponse.json(
        { error: 'Зона не найдена' },
        { status: 404 }
      );
    }

    // Проверка доступности
    if (zone.bookings.length >= zone.totalSlots) {
      return NextResponse.json(
        { error: 'Все места заняты' },
        { status: 400 }
      );
    }

    // Расчет стоимости
    const totalPrice = zone.pricePerHour * validated.hours;

    // Проверка баланса
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { balance: true }
    });

    if (!user || user.balance < totalPrice) {
      return NextResponse.json(
        { error: 'Недостаточно средств' },
        { status: 400 }
      );
    }

    const startTime = new Date(validated.startTime);
    const endTime = new Date(startTime.getTime() + validated.hours * 60 * 60 * 1000);

    // Создание бронирования в транзакции
    const booking = await prisma.$transaction(async (tx) => {
      // Списание средств
      await tx.user.update({
        where: { id: auth.userId },
        data: {
          balance: {
            decrement: totalPrice
          }
        }
      });

      // Создание бронирования
      const newBooking = await tx.booking.create({
        data: {
          userId: auth.userId,
          zoneId: validated.zoneId,
          startTime,
          endTime,
          hours: validated.hours,
          totalPrice,
          status: 'active',
        },
        include: {
          zone: true
        }
      });

      // Начисление баллов лояльности
      const loyaltyPoints = Math.floor(totalPrice / 10); // 1 балл за каждые 10₽

      await tx.user.update({
        where: { id: auth.userId },
        data: {
          loyaltyPoints: { increment: loyaltyPoints }
        }
      });

      await tx.loyaltyReward.create({
        data: {
          userId: auth.userId,
          points: loyaltyPoints,
          reason: `Бронирование ${zone.name} (${validated.hours}ч)`
        }
      });

      // Логирование
      await tx.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'booking',
          details: JSON.stringify({
            zoneId: validated.zoneId,
            hours: validated.hours,
            price: totalPrice
          }),
        }
      });

      return newBooking;
    });

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error: any) {
    console.error('Booking error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: auth.userId },
      include: {
        zone: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}