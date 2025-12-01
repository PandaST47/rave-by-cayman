// app/api/payment/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Извлечение данных из webhook ЮКассы
    const { object } = body;
    
    if (!object || object.status !== 'succeeded') {
      return NextResponse.json({ received: true });
    }

    const paymentId = object.id;
    const paidAmount = parseFloat(object.amount.value);
    const metadata = object.metadata;

    if (!metadata || !metadata.transactionId || !metadata.userId) {
      console.error('Missing metadata in payment:', paymentId);
      return NextResponse.json({ received: true });
    }

    // Поиск транзакции
    const transaction = await prisma.transaction.findUnique({
      where: { id: metadata.transactionId }
    });

    if (!transaction) {
      console.error('Transaction not found:', metadata.transactionId);
      return NextResponse.json({ received: true });
    }

    if (transaction.status === 'success') {
      // Уже обработана
      return NextResponse.json({ received: true });
    }

    // Обновление транзакции и баланса пользователя
    await prisma.$transaction(async (tx) => {
      // Обновить статус транзакции
      await tx.transaction.update({
        where: { id: metadata.transactionId },
        data: { status: 'success' }
      });

      // Пополнить баланс
      await tx.user.update({
        where: { id: metadata.userId },
        data: {
          balance: {
            increment: paidAmount
          }
        }
      });

      // Создать лог
      await tx.activityLog.create({
        data: {
          userId: metadata.userId,
          action: 'payment_success',
          details: JSON.stringify({
            transactionId: metadata.transactionId,
            paymentId,
            amount: paidAmount
          }),
        }
      });
    });

    console.log('Payment processed successfully:', paymentId);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}