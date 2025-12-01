// app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
      include: {
        zone: true,
        computer: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Бронирование не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Бронирование не найдено' },
        { status: 404 }
      );
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Невозможно отменить это бронирование' },
        { status: 400 }
      );
    }

    // Отмена бронирования и возврат средств
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: params.id },
        data: { status: 'cancelled' }
      });

      await tx.user.update({
        where: { id: auth.userId },
        data: {
          balance: {
            increment: booking.totalPrice
          }
        }
      });

      await tx.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'booking_cancelled',
          details: JSON.stringify({
            bookingId: params.id,
            refund: booking.totalPrice
          }),
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Бронирование отменено, средства возвращены'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}