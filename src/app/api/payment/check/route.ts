import { NextRequest, NextResponse } from 'next/server';
import { yookassa } from '@/lib/yookassa';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    console.log('Checking payment:', paymentId);

    // Получить информацию о платеже из ЮКассы
    const payment = await yookassa.getPaymentInfo(paymentId);
    
    console.log('Payment info from YooKassa:', {
      id: payment.id,
      status: payment.status,
      paid: payment.paid,
      amount: payment.amount.value
    });

    // Найти транзакцию по paymentId в details
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId: auth.userId,
        details: {
          contains: paymentId
        }
      }
    });

    if (!transaction) {
      console.error('Transaction not found for payment:', paymentId);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('Found transaction:', {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount
    });

    // Если платеж успешен и транзакция еще не обработана
    if (payment.status === 'succeeded' && payment.paid && transaction.status !== 'success') {
      const paidAmount = parseFloat(payment.amount.value);

      console.log('Processing successful payment, updating balance...');

      await prisma.$transaction(async (tx) => {
        // Обновить статус транзакции
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { 
            status: 'success',
            details: JSON.stringify({
              paymentId: payment.id,
              status: payment.status,
              paid: payment.paid,
              processedAt: new Date().toISOString()
            })
          }
        });

        // Пополнить баланс
        await tx.user.update({
          where: { id: auth.userId },
          data: {
            balance: {
              increment: paidAmount
            }
          }
        });

        // Создать лог
        await tx.activityLog.create({
          data: {
            userId: auth.userId,
            action: 'payment_success',
            details: JSON.stringify({
              transactionId: transaction.id,
              paymentId,
              amount: paidAmount
            }),
          }
        });
      });

      console.log('Balance updated successfully');
    }

    // Определить статус для фронтенда
    let status = 'pending';
    if (payment.status === 'succeeded' && payment.paid) {
      status = 'success';
    } else if (payment.status === 'canceled' || payment.status === 'cancelled') {
      status = 'cancelled';
      
      // Обновить статус транзакции на cancelled
      if (transaction.status === 'pending') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'cancelled' }
        });
      }
    }

    return NextResponse.json({
      status,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount.value,
        paid: payment.paid
      }
    });

  } catch (error: any) {
    console.error('Payment check error:', error);
    return NextResponse.json(
      { error: error.message || 'Error checking payment' },
      { status: 500 }
    );
  }
}