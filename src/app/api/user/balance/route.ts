// app/api/user/balance/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }
  
  try {
    const body = await request.json();
    const { amount, method } = body;
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Неверная сумма' },
        { status: 400 }
      );
    }
    
    if (!method) {
      return NextResponse.json(
        { error: 'Метод оплаты обязателен' },
        { status: 400 }
      );
    }
    
    // Создание транзакции
    const transaction = await prisma.transaction.create({
      data: {
        userId: auth.userId,
        amount,
        method,
        status: 'pending', // В реальности здесь будет интеграция с платежной системой
      }
    });
    
    // ДЛЯ ТЕСТИРОВАНИЯ: автоматически одобряем транзакцию
    // В production это должно происходить после подтверждения платежа
    if (process.env.NODE_ENV === 'development') {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'success' }
        });
        
        await tx.user.update({
          where: { id: auth.userId },
          data: {
            balance: {
              increment: amount
            }
          }
        });
        
        await tx.activityLog.create({
          data: {
            userId: auth.userId,
            action: 'top_up',
            details: `${amount} руб. через ${method}`,
          }
        });
      });
    }
    
    return NextResponse.json({
      success: true,
      transaction
    });
    
  } catch (error) {
    console.error('Top up error:', error);
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
    const transactions = await prisma.transaction.findMany({
      where: { userId: auth.userId },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Последние 20 транзакций
    });
    
    return NextResponse.json({ transactions });
    
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}