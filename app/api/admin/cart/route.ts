import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(req: NextRequest, _user: JWTPayload) {
  try {
    const items = await prisma.cartItem.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: { select: { id: true, name: true, price: true } },
        product: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by user
    const byUser: Record<string, { user: { id: string; name: string; email: string; phone: string | null }; items: typeof items; total: number }> = {};
    for (const item of items) {
      const uid = item.user.id;
      if (!byUser[uid]) byUser[uid] = { user: item.user, items: [], total: 0 };
      byUser[uid].items.push(item);
      const price = item.service?.price ?? item.product?.price ?? 0;
      byUser[uid].total += price * item.quantity;
    }

    return success({ carts: Object.values(byUser), totalItems: items.length });
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAdmin(GET);
export { getRoute as GET };
