// lib/email.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendBookingConfirmation = async (
  email: string,
  booking: any
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Подтверждение бронирования',
    html: `
      <h2>Ваше бронирование подтверждено!</h2>
      <p>Зона: ${booking.zone.name}</p>
      <p>Время: ${new Date(booking.startTime).toLocaleString('ru')}</p>
      <p>Длительность: ${booking.hours}ч</p>
      <p>Стоимость: ${booking.totalPrice}₽</p>
    `
  });
};