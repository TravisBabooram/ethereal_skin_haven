import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { sendProductReceiptEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

// POST /api/admin/products/receipt
// Body: { userId, items: [{productId, quantity}], paymentMethod }
async function postHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { userId, items, paymentMethod } = await req.json();

    if (!userId || !items?.length || !paymentMethod) {
      throw new APIError(400, "userId, items, and paymentMethod are required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    if (!user) throw new APIError(404, "Client not found");

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
      select: { id: true, name: true, price: true },
    });

    const receiptItems = items.map((i: any) => {
      const p = products.find((p) => p.id === i.productId);
      if (!p) throw new APIError(404, `Product ${i.productId} not found`);
      return { name: p.name, price: p.price, quantity: i.quantity };
    });

    const totalPrice = receiptItems.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );

    await sendProductReceiptEmail({
      userName: user.name,
      userEmail: user.email,
      items: receiptItems,
      totalPrice,
      paymentMethod,
      date: new Date(),
    });

    return success({ message: "Receipt sent" });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
