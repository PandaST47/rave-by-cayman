import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { yookassa } from '@/lib/yookassa';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await request.json();
    const { amount } = body;

    // Валидация суммы
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Минимальная сумма пополнения 100₽' },
        { status: 400 }
      );
    }

    if (amount > 100000) {
      return NextResponse.json(
        { error: 'Максимальная сумма пополнения 100,000₽' },
        { status: 400 }
      );
    }

    // Создание транзакции в БД
    const transaction = await prisma.transaction.create({
      data: {
        userId: auth.userId,
        amount,
        method: 'yookassa',
        status: 'pending',
      }
    });

    // Правильный return_url
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/payment/callback`;
    
    console.log('Creating payment with return URL:', returnUrl);

    const payment = await yookassa.createPayment(
      amount,
      auth.userId,
      transaction.id,
      returnUrl
    );

    // Обновление транзакции с paymentId
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        details: JSON.stringify({ 
          paymentId: payment.id,
          status: payment.status,
          createdAt: payment.created_at
        })
      }
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: auth.userId,
        action: 'payment_created',
        details: JSON.stringify({
          transactionId: transaction.id,
          amount,
          paymentId: payment.id
        }),
      }
    });

    console.log('Payment created successfully:', {
      paymentId: payment.id,
      transactionId: transaction.id,
      confirmationUrl: payment.confirmation.confirmation_url
    });

    return NextResponse.json({
      success: true,
      paymentUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id,
      transactionId: transaction.id
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка создания платежа' },
      { status: 500 }
    );
  }
}