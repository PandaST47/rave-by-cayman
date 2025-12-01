// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { login: validated.login },
          { email: validated.email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким логином или email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(validated.password);

    // Получение IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        login: validated.login,
        email: validated.email,
        password: hashedPassword,
        registrationIp: ip,
      },
      select: {
        id: true,
        login: true,
        email: true,
        balance: true,
        createdAt: true,
      }
    });

    // Создание токена
    const token = generateToken({ userId: user.id, email: user.email });

    // Создание сессии
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'register',
        ip,
      }
    });

    // Установка cookie
    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    
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