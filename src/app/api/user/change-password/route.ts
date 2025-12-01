// app/api/user/change-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Новый пароль должен содержать минимум 8 символов' },
        { status: 400 }
      );
    }

    // Получение текущего пользователя
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { password: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверка текущего пароля
    const isPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 400 }
      );
    }

    // Хеширование нового пароля
    const hashedPassword = await hashPassword(newPassword);

    // Обновление пароля
    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hashedPassword }
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: auth.userId,
        action: 'password_changed',
        details: 'User changed password',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}