// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    // Найти пользователя
    const user = await prisma.user.findUnique({
      where: { login: validated.login }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    // Проверить пароль
    const isValidPassword = await verifyPassword(validated.password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    // Проверить, не заблокирован ли пользователь
    if (user.isBlocked) {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован' },
        { status: 403 }
      );
    }

    // Получить IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Создать токен
    const token = generateToken({ userId: user.id, email: user.email });

    // Создать сессию
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    });

    // Логирование входа
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'login',
        ip,
      }
    });

    // Установить cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        balance: user.balance,
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    
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