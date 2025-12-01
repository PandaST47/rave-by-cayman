// app/api/bookings/[id]/cancel/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
        status: 'active'
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Бронирование не найдено или уже завершено' },
        { status: 404 }
      );
    }

    // Проверка: можно отменить только за 1+ час до начала
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const hoursDiff = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 1) {
      return NextResponse.json(
        { error: 'Отмена возможна только за 1 час до начала' },
        { status: 400 }
      );
    }

    // Возврат средств (100% если >24ч, 50% если <24ч)
    const refundPercent = hoursDiff >= 24 ? 1.0 : 0.5;
    const refundAmount = Math.floor(booking.totalPrice * refundPercent);

    await prisma.$transaction(async (tx) => {
      // Отменить бронирование
      await tx.booking.update({
        where: { id: params.id },
        data: { status: 'cancelled' }
      });

      // Вернуть средства
      await tx.user.update({
        where: { id: auth.userId },
        data: { balance: { increment: refundAmount } }
      });

      // Создать транзакцию возврата
      await tx.transaction.create({
        data: {
          userId: auth.userId,
          amount: refundAmount,
          method: 'refund',
          status: 'success',
          details: JSON.stringify({
            bookingId: params.id,
            refundPercent: refundPercent * 100
          })
        }
      });

      // Лог
      await tx.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'booking_cancelled',
          details: `Booking ${params.id}, refund: ${refundAmount}₽`
        }
      });
    });

    return NextResponse.json({
      success: true,
      refundAmount,
      refundPercent: refundPercent * 100
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Ошибка отмены бронирования' },
      { status: 500 }
    );
  }
}