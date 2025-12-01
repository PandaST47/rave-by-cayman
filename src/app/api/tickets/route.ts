// app/api/tickets/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { createTicketSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }
  
  try {
    const body = await request.json();
    const validated = createTicketSchema.parse(body);
    
    // Создание тикета с первым сообщением в транзакции
    const ticket = await prisma.$transaction(async (tx) => {
      const newTicket = await tx.ticket.create({
        data: {
          userId: auth.userId,
          subject: validated.subject,
          category: validated.category,
          status: 'open',
        }
      });
      
      await tx.ticketMessage.create({
        data: {
          ticketId: newTicket.id,
          userId: auth.userId,
          message: validated.message,
          isStaff: false,
        }
      });
      
      await tx.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'create_ticket',
          details: validated.subject,
        }
      });
      
      return newTicket;
    });
    
    return NextResponse.json({
      success: true,
      ticket
    });
    
  } catch (error: any) {
    console.error('Create ticket error:', error);
    
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
    const tickets = await prisma.ticket.findMany({
      where: { userId: auth.userId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1, // Только первое сообщение для списка
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ tickets });
    
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}