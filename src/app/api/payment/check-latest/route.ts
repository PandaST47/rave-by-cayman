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
    // Найти последнюю pending транзакцию пользователя
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId: auth.userId,
        status: 'pending',
        method: 'yookassa'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!transaction) {
      console.log('No pending transaction found for user:', auth.userId);
      return NextResponse.json({
        status: 'no_transaction',
        message: 'Транзакция не найдена'
      });
    }

    // Извлечь paymentId из details
    let paymentId: string | null = null;
    try {
      const details = JSON.parse(transaction.details || '{}');
      paymentId = details.paymentId;
    } catch (e) {
      console.error('Failed to parse transaction details:', e);
    }

    if (!paymentId) {
      console.error('No paymentId in transaction:', transaction.id);
      return NextResponse.json({
        status: 'error',
        message: 'ID платежа не найден'
      }, { status: 400 });
    }

    console.log('Checking payment:', paymentId, 'for transaction:', transaction.id);

    // Получить информацию о платеже из ЮКассы
    const payment = await yookassa.getPaymentInfo(paymentId);
    
    console.log('Payment info from YooKassa:', {
      id: payment.id,
      status: payment.status,
      paid: payment.paid,
      amount: payment.amount.value
    });

    // Если платеж успешен и транзакция еще не обработана
    if (payment.status === 'succeeded' && payment.paid) {
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

      return NextResponse.json({
        status: 'success',
        payment: {
          id: payment.id,
          amount: payment.amount.value
        }
      });
    }

    // Если платеж отменен
    if (payment.status === 'canceled' || payment.status === 'cancelled') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'cancelled' }
      });

      return NextResponse.json({
        status: 'cancelled',
        payment: {
          id: payment.id
        }
      });
    }

    // Платеж все еще в обработке
    return NextResponse.json({
      status: 'pending',
      payment: {
        id: payment.id,
        status: payment.status
      }
    });

  } catch (error: any) {
    console.error('Payment check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message || 'Error checking payment' 
      },
      { status: 500 }
    );
  }
}