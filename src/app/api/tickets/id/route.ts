// app/api/tickets/id/route.ts

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
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: params.id,
        userId: auth.userId, // Только свои тикеты
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            user: {
              select: {
                id: true,
                login: true,
              }
            }
          }
        }
      }
    });
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Тикет не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ ticket });
    
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }
  
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message || message.trim().length < 1) {
      return NextResponse.json(
        { error: 'Сообщение не может быть пустым' },
        { status: 400 }
      );
    }
    
    // Проверка принадлежности тикета
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      }
    });
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Тикет не найден' },
        { status: 404 }
      );
    }
    
    if (ticket.status === 'closed') {
      return NextResponse.json(
        { error: 'Тикет закрыт' },
        { status: 400 }
      );
    }
    
    // Создание сообщения
    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        userId: auth.userId,
        message: message.trim(),
        isStaff: false,
      },
      include: {
        user: {
          select: {
            id: true,
            login: true,
          }
        }
      }
    });
    
    // Обновление статуса тикета
    await prisma.ticket.update({
      where: { id: params.id },
      data: { 
        status: 'in_progress',
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: newMessage
    });
    
  } catch (error) {
    console.error('Add message error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}