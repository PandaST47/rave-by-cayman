// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const token = request.cookies.get('auth_token')?.value;

    if (token) {
      // Удалить сессию из БД
      await prisma.session.deleteMany({
        where: { token }
      });

      // Логирование
      await prisma.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'logout',
        }
      });
    }

    // Удалить cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth_token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    );
  }
}