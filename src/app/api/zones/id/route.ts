// app/api/zones/id/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
      include: {
        computers: {
          where: { isActive: true },
          select: {
            id: true,
            number: true,
            bookings: {
              where: {
                status: 'active',
                endTime: {
                  gte: new Date()
                }
              },
              select: {
                startTime: true,
                endTime: true
              }
            }
          }
        },
        bookings: {
          where: {
            status: 'active',
            endTime: {
              gte: new Date()
            }
          },
          include: {
            computer: true
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

    // Подсчет доступных мест
    const occupiedSlots = zone.bookings.length;
    const availableSlots = zone.totalSlots - occupiedSlots;

    // Информация о компьютерах с их статусами
    const computersStatus = zone.computers.map(computer => ({
      id: computer.id,
      number: computer.number,
      isOccupied: computer.bookings.length > 0,
      currentBooking: computer.bookings[0] || null
    }));

    const zoneWithAvailability = {
      id: zone.id,
      name: zone.name,
      type: zone.type,
      description: zone.description,
      pricePerHour: zone.pricePerHour,
      totalSlots: zone.totalSlots,
      occupiedSlots,
      availableSlots,
      imageUrl: zone.imageUrl,
      computers: computersStatus
    };

    return NextResponse.json({ zone: zoneWithAvailability });

  } catch (error) {
    console.error('Get zone error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}