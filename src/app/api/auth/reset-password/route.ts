// app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

// Запрос на сброс пароля
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    // Если передан только email - создаем токен для сброса
    if (email && !token && !newPassword) {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Не раскрываем существование email
        return NextResponse.json({
          success: true,
          message: 'Если аккаунт существует, инструкции отправлены на email'
        });
      }

      // Генерация токена сброса
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 час

      // В реальном проекте здесь должна быть отправка email
      // Для теста сохраним токен в логах
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'password_reset_requested',
          details: JSON.stringify({
            resetToken, // В production НЕ сохранять токен в логах!
            expiresAt: resetTokenExpiry
          }),
        }
      });

      console.log('Reset token for', email, ':', resetToken);

      return NextResponse.json({
        success: true,
        message: 'Если аккаунт существует, инструкции отправлены на email',
        // В development режиме возвращаем токен для тестирования
        ...(process.env.NODE_ENV === 'development' && { token: resetToken })
      });
    }

    // Если переданы token и newPassword - выполняем сброс
    if (token && newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Пароль должен содержать минимум 8 символов' },
          { status: 400 }
        );
      }

      // Поиск пользователя с этим токеном в логах (упрощенная версия)
      // В production нужна отдельная таблица для токенов сброса
      const recentLog = await prisma.activityLog.findFirst({
        where: {
          action: 'password_reset_requested',
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!recentLog || !recentLog.userId) {
        return NextResponse.json(
          { error: 'Неверный или истекший токен' },
          { status: 400 }
        );
      }

      const details = JSON.parse(recentLog.details || '{}');

      if (details.resetToken !== token) {
        return NextResponse.json(
          { error: 'Неверный или истекший токен' },
          { status: 400 }
        );
      }

      // Проверка срока действия токена
      const expiresAt = new Date(details.expiresAt);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Токен истек' },
          { status: 400 }
        );
      }

      // Обновление пароля
      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: recentLog.userId },
        data: { password: hashedPassword }
      });

      // Логирование
      await prisma.activityLog.create({
        data: {
          userId: recentLog.userId,
          action: 'password_reset_completed',
          details: 'Password was reset successfully',
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Пароль успешно изменен'
      });
    }

    return NextResponse.json(
      { error: 'Неверные параметры запроса' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}