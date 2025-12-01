// app/api/bookings/[id]/extend/route.ts

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { additionalHours } = body;

    if (!additionalHours || additionalHours < 1) {
      return NextResponse.json(
        { error: 'Минимум 1 час для продления' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
        status: 'active'
      },
      include: { zone: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Активное бронирование не найдено' },
        { status: 404 }
      );
    }

    const additionalCost = booking.zone.pricePerHour * additionalHours;

    // Проверка баланса
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { balance: true }
    });

    if (!user || user.balance < additionalCost) {
      return NextResponse.json(
        { error: 'Недостаточно средств' },
        { status: 400 }
      );
    }

    const newEndTime = new Date(booking.endTime);
    newEndTime.setHours(newEndTime.getHours() + additionalHours);

    await prisma.$transaction(async (tx) => {
      // Продлить бронирование
      await tx.booking.update({
        where: { id: params.id },
        data: {
          endTime: newEndTime,
          hours: booking.hours + additionalHours,
          totalPrice: booking.totalPrice + additionalCost
        }
      });

      // Списать средства
      await tx.user.update({
        where: { id: auth.userId },
        data: { balance: { decrement: additionalCost } }
      });

      // Создать транзакцию
      await tx.transaction.create({
        data: {
          userId: auth.userId,
          amount: -additionalCost,
          method: 'booking_extension',
          status: 'success',
          details: JSON.stringify({
            bookingId: params.id,
            additionalHours
          })
        }
      });
    });

    return NextResponse.json({
      success: true,
      newEndTime,
      additionalCost
    });

  } catch (error) {
    console.error('Extend booking error:', error);
    return NextResponse.json(
      { error: 'Ошибка продления бронирования' },
      { status: 500 }
    );
  }
}