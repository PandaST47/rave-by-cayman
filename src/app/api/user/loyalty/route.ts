// app/api/user/loyalty/route.ts

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      loyaltyPoints: true,
      loyaltyTier: true
    }
  });

  const rewards = await prisma.loyaltyReward.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Рассчитать уровень
  const tiers = {
    bronze: { min: 0, discount: 0 },
    silver: { min: 1000, discount: 5 },
    gold: { min: 5000, discount: 10 },
    platinum: { min: 10000, discount: 15 }
  };

  return NextResponse.json({
    points: user?.loyaltyPoints || 0,
    tier: user?.loyaltyTier || 'bronze',
    discount: tiers[user?.loyaltyTier as keyof typeof tiers]?.discount || 0,
    rewards,
    nextTier: Object.entries(tiers).find(
      ([_, data]) => data.min > (user?.loyaltyPoints || 0)
    )
  });
}