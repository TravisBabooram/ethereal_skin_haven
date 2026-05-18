const BRAND = "Ethereal Skin Haven";
const GOLD = "#C9A96E";
const DARK = "#111111";
const BANK_NAME = "First Citizens Bank";
const BANK_ACCOUNT = "3128614";
const WHATSAPP = "+1 (868) 705-7023";
const SITE_URL = "https://etherealskinhaven.com";

function base(title: string, body: string, footerNote?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- Gold top bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#9a7a45,${GOLD},#e8d5a3,${GOLD},#9a7a45);"></td></tr>

        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:36px 48px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:5px;color:${GOLD};text-transform:uppercase;font-family:'Georgia',serif;">Luxury Spa &amp; Esthetics</p>
            <h1 style="margin:0;font-size:28px;color:#f0ebe3;font-weight:300;letter-spacing:3px;font-family:'Georgia',serif;">${BRAND}</h1>
            <div style="width:40px;height:1px;background:${GOLD};margin:16px auto 0;opacity:0.6;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px;">${body}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 48px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:${GOLD};letter-spacing:3px;text-transform:uppercase;">Get in Touch</p>
            <p style="margin:0 0 4px;font-size:13px;color:#aaa;">
              <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">WhatsApp: ${WHATSAPP}</a>
            </p>
            <p style="margin:0 0 4px;font-size:13px;color:#aaa;">
              <a href="mailto:etherealskinhaven@gmail.com" style="color:#aaa;text-decoration:none;">etherealskinhaven@gmail.com</a>
            </p>
            <p style="margin:16px 0 0;font-size:11px;color:#555;">
              ${footerNote || "You received this because you have a booking with Ethereal Skin Haven."}
            </p>
          </td>
        </tr>

        <!-- Gold bottom bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#9a7a45,${GOLD},#e8d5a3,${GOLD},#9a7a45);"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function divider(): string {
  return `<div style="height:1px;background:linear-gradient(90deg,transparent,#e0d5c5,transparent);margin:28px 0;"></div>`;
}

function receiptTable(items: { label: string; value: string; bold?: boolean; gold?: boolean }[]): string {
  const rows = items.map(({ label, value, bold, gold }) => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:#666;border-bottom:1px solid #f0ebe3;">${label}</td>
      <td style="padding:10px 0;font-size:${gold ? "16px" : "13px"};color:${gold ? GOLD : bold ? DARK : "#444"};font-weight:${bold || gold ? "bold" : "normal"};text-align:right;border-bottom:1px solid #f0ebe3;font-family:${gold ? "'Georgia',serif" : "inherit"};">${value}</td>
    </tr>`).join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border-radius:4px;padding:20px 24px;margin:20px 0;">
    <tr><td colspan="2"><table width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
  </table>`;
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export interface BookingEmailData {
  userName: string;
  userEmail: string;
  bookingId: string;
  services: { name: string; price: number; duration: number; quantity: number }[];
  appointmentDate: Date | string;
  appointmentTime: string;
  paymentMethod: string;
  totalPrice: number;
  notes?: string;
}

export interface ProductReceiptData {
  userName: string;
  userEmail: string;
  items: { name: string; price: number; quantity: number }[];
  totalPrice: number;
  paymentMethod: string;
  date: Date | string;
}

// ─── BOOKING RECEIVED (Pending) ───────────────────────────────────────────────

export function bookingReceivedTemplate(data: BookingEmailData): { subject: string; html: string } {
  const serviceRows = data.services.map(s => ({
    label: `${s.name}${s.quantity > 1 ? ` × ${s.quantity}` : ""} <span style="color:#aaa;font-size:11px;">(${s.duration * s.quantity} min)</span>`,
    value: `$${(s.price * s.quantity).toFixed(2)}`,
  }));

  const isBankTransfer = data.paymentMethod?.toLowerCase().includes("bank");

  const bankNote = isBankTransfer ? `
    ${divider()}
    <p style="font-size:13px;font-weight:bold;color:${DARK};margin:0 0 12px;">Bank Transfer Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffdf8;border:1px solid #e8d5a3;border-radius:4px;padding:16px 20px;margin-bottom:16px;">
      <tr>
        <td style="font-size:13px;color:#666;padding:6px 0;">Bank</td>
        <td style="font-size:13px;color:${DARK};font-weight:bold;text-align:right;">${BANK_NAME}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#666;padding:6px 0;">Account Name</td>
        <td style="font-size:13px;color:${DARK};font-weight:bold;text-align:right;">${BRAND}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#666;padding:6px 0;">Account Number</td>
        <td style="font-size:13px;color:${DARK};font-weight:bold;text-align:right;">${BANK_ACCOUNT}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#666;padding:6px 0;">Amount</td>
        <td style="font-size:15px;color:${GOLD};font-weight:bold;text-align:right;font-family:'Georgia',serif;">$${data.totalPrice.toFixed(2)} TTD</td>
      </tr>
    </table>
    <p style="font-size:13px;color:#888;margin:0;line-height:1.6;">Please send your transfer receipt via WhatsApp to <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a> to complete your booking.</p>
  ` : "";

  const body = `
    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;">We've received your booking</h2>
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 24px;">Pending Confirmation</p>

    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 6px;">Hello <strong style="color:${DARK};">${data.userName}</strong>,</p>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 24px;">Thank you for your booking request. We'll review and confirm your appointment as soon as possible — you'll receive a confirmation email once approved.</p>

    ${divider()}
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 16px;">Appointment Summary</p>

    ${receiptTable([
      { label: "Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "Time", value: formatTime(data.appointmentTime), bold: true },
      ...serviceRows,
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment Method", value: data.paymentMethod },
      ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
    ])}

    ${bankNote}

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      Need to make changes? Contact us via WhatsApp at <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a> and we'll assist you right away.
    </p>
  `;

  return {
    subject: `Booking Request Received — ${formatDate(data.appointmentDate)}`,
    html: base("Booking Request Received", body),
  };
}

// ─── BOOKING CONFIRMED + RECEIPT ─────────────────────────────────────────────

export function bookingConfirmedTemplate(data: BookingEmailData): { subject: string; html: string } {
  const serviceRows = data.services.map(s => ({
    label: `${s.name}${s.quantity > 1 ? ` × ${s.quantity}` : ""} <span style="color:#aaa;font-size:11px;">(${s.duration * s.quantity} min)</span>`,
    value: `$${(s.price * s.quantity).toFixed(2)}`,
  }));

  const isBankTransfer = data.paymentMethod?.toLowerCase().includes("bank");

  const paymentNote = isBankTransfer
    ? `<p style="color:#888;font-size:13px;line-height:1.7;margin:0 0 8px;">If you haven't already, please send your bank transfer receipt of <strong style="color:${GOLD};">$${data.totalPrice.toFixed(2)} TTD</strong> to our WhatsApp to finalise payment.</p>`
    : `<p style="color:#888;font-size:13px;line-height:1.7;margin:0 0 8px;">Payment of <strong style="color:${GOLD};">$${data.totalPrice.toFixed(2)} TTD</strong> is due in cash at your appointment.</p>`;

  const body = `
    <!-- Confirmed badge -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#f0ebe3;border:2px solid ${GOLD};line-height:56px;font-size:22px;color:${GOLD};">✓</div>
    </div>

    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;text-align:center;">Your Appointment is Confirmed</h2>
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 28px;text-align:center;">Official Receipt</p>

    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 6px;">Hello <strong style="color:${DARK};">${data.userName}</strong>,</p>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 24px;">We're looking forward to seeing you! Your appointment is confirmed and your receipt is below. Please keep this for your records.</p>

    ${divider()}
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 16px;">Official Receipt</p>

    ${receiptTable([
      { label: "Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "Time", value: formatTime(data.appointmentTime), bold: true },
      ...serviceRows,
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment Method", value: data.paymentMethod },
      ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
    ])}

    ${divider()}
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 12px;">Payment</p>
    ${paymentNote}

    ${divider()}
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 12px;">What to Expect</p>
    <ul style="color:#666;font-size:13px;line-height:1.9;margin:0;padding-left:20px;">
      <li>Please arrive 5–10 minutes before your appointment time.</li>
      <li>Avoid heavy makeup or skincare products on the area being treated.</li>
      <li>Cancellations must be made at least 24 hours in advance.</li>
    </ul>

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      Questions? Reach us on WhatsApp at <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a> or visit <a href="${SITE_URL}" style="color:${GOLD};text-decoration:none;">etherealskinhaven.com</a>
    </p>
  `;

  return {
    subject: `✓ Appointment Confirmed — ${formatDate(data.appointmentDate)} at ${formatTime(data.appointmentTime)}`,
    html: base("Appointment Confirmed", body),
  };
}

// ─── BOOKING CANCELLED ────────────────────────────────────────────────────────

export function cancellationTemplate(data: BookingEmailData): { subject: string; html: string } {
  const body = `
    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;">Booking Cancelled</h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">Hello <strong style="color:${DARK};">${data.userName}</strong>, your appointment has been cancelled.</p>

    ${receiptTable([
      { label: "Date", value: formatDate(data.appointmentDate) },
      { label: "Time", value: formatTime(data.appointmentTime) },
      { label: "Service", value: data.services.map(s => s.name).join(", ") },
    ])}

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      We hope to see you again soon. Book a new appointment anytime at <a href="${SITE_URL}/booking" style="color:${GOLD};text-decoration:none;">etherealskinhaven.com</a> or contact us via WhatsApp.
    </p>
  `;

  return {
    subject: `Booking Cancelled — ${formatDate(data.appointmentDate)}`,
    html: base("Booking Cancelled", body),
  };
}

// ─── BOOKING RESCHEDULED ──────────────────────────────────────────────────────

export function rescheduleTemplate(data: BookingEmailData): { subject: string; html: string } {
  const body = `
    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;">Appointment Rescheduled</h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">Hello <strong style="color:${DARK};">${data.userName}</strong>, your appointment has been moved to a new time. Here are your updated details:</p>

    ${receiptTable([
      { label: "New Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "New Time", value: formatTime(data.appointmentTime), bold: true },
      { label: "Service", value: data.services.map(s => s.name).join(", ") },
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
    ])}

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      If this time doesn't work for you, please contact us on WhatsApp at <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a>.
    </p>
  `;

  return {
    subject: `Appointment Rescheduled — ${formatDate(data.appointmentDate)} at ${formatTime(data.appointmentTime)}`,
    html: base("Appointment Rescheduled", body),
  };
}

// ─── REMINDERS ────────────────────────────────────────────────────────────────

export function reminderTemplate(data: BookingEmailData, type: "24hr" | "sameday"): { subject: string; html: string } {
  const isToday = type === "sameday";
  const body = `
    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;">
      Your appointment is ${isToday ? "today" : "tomorrow"}
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">Hello <strong style="color:${DARK};">${data.userName}</strong>, just a friendly reminder about your upcoming visit:</p>

    ${receiptTable([
      { label: "Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "Time", value: formatTime(data.appointmentTime), bold: true },
      { label: "Service", value: data.services.map(s => s.name).join(", ") },
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment", value: data.paymentMethod },
    ])}

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      ${isToday
        ? "We're excited to see you today! Please arrive 5–10 minutes early and avoid heavy skincare products on the area being treated."
        : "We look forward to seeing you tomorrow. If you need to reschedule, please contact us as soon as possible via WhatsApp."}
    </p>
  `;

  return {
    subject: `Reminder: Your appointment is ${isToday ? "today" : "tomorrow"} — ${formatTime(data.appointmentTime)}`,
    html: base("Appointment Reminder", body),
  };
}

// ─── ADMIN NOTIFICATION (new booking) ────────────────────────────────────────

export function adminNewBookingTemplate(data: BookingEmailData): { subject: string; html: string } {
  const body = `
    <h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 6px;">New Booking Received</h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">A new appointment request has been submitted. Review and confirm it in your admin panel.</p>

    ${receiptTable([
      { label: "Client", value: data.userName, bold: true },
      { label: "Email", value: data.userEmail },
      { label: "Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "Time", value: formatTime(data.appointmentTime), bold: true },
      { label: "Service(s)", value: data.services.map(s => `${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}`).join(", ") },
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment", value: data.paymentMethod },
      ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
    ])}

    <div style="text-align:center;margin-top:28px;">
      <a href="${SITE_URL}/admin/bookings" style="display:inline-block;padding:14px 32px;background:${GOLD};color:#111;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border-radius:2px;font-family:'Georgia',serif;">View in Admin Panel →</a>
    </div>
  `;

  return {
    subject: `New Booking — ${data.userName} on ${formatDate(data.appointmentDate)}`,
    html: base("New Booking Received", body, "This is an automated notification for the Ethereal Skin Haven admin."),
  };
}

// ─── PRODUCT RECEIPT ──────────────────────────────────────────────────────────

export function productReceiptTemplate(data: ProductReceiptData): { subject: string; html: string } {
  const itemRows = data.items.map(i => ({
    label: `${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`,
    value: `$${(i.price * i.quantity).toFixed(2)}`,
  }));

  const isBankTransfer = data.paymentMethod?.toLowerCase().includes("bank");

  const paymentNote = isBankTransfer
    ? `<p style="color:#888;font-size:13px;line-height:1.7;margin:0;">If you haven't already, please send your bank transfer receipt of <strong style="color:${GOLD};">$${data.totalPrice.toFixed(2)} TTD</strong> via WhatsApp to <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a>.</p>`
    : `<p style="color:#888;font-size:13px;line-height:1.7;margin:0;">Payment of <strong style="color:${GOLD};">$${data.totalPrice.toFixed(2)} TTD</strong> was received in cash. Thank you!</p>`;

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#f0ebe3;border:2px solid ${GOLD};line-height:56px;font-size:22px;color:${GOLD};">✓</div>
    </div>

    <h2 style="color:${DARK};font-size:24px;font-weight:300;margin:0 0 6px;letter-spacing:1px;text-align:center;">Thank You for Your Purchase</h2>
    <p style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;margin:0 0 28px;text-align:center;">Official Receipt</p>

    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">Hello <strong style="color:${DARK};">${data.userName}</strong>, thank you for shopping with us. Here is your receipt:</p>

    ${receiptTable([
      { label: "Date", value: formatDate(data.date) },
      ...itemRows,
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment Method", value: data.paymentMethod },
    ])}

    ${divider()}
    ${paymentNote}

    ${divider()}
    <p style="color:#888;font-size:13px;line-height:1.7;margin:0;">
      Questions about your products? Contact us on WhatsApp at <a href="https://wa.me/18687057023" style="color:${GOLD};text-decoration:none;">${WHATSAPP}</a>.
    </p>
  `;

  return {
    subject: `Your Ethereal Skin Haven Receipt — ${formatDate(data.date)}`,
    html: base("Purchase Receipt", body),
  };
}

// ─── ADMIN: BOOKING CONFIRMED NOTIFICATION ───────────────────────────────────

export function adminBookingConfirmedTemplate(data: BookingEmailData): { subject: string; html: string } {
  const body = `
    <h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 6px;">Booking Confirmed</h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">You confirmed the following appointment. A confirmation email has been sent to the client.</p>

    ${receiptTable([
      { label: "Client", value: data.userName, bold: true },
      { label: "Email", value: data.userEmail },
      { label: "Date", value: formatDate(data.appointmentDate), bold: true },
      { label: "Time", value: formatTime(data.appointmentTime), bold: true },
      { label: "Service(s)", value: data.services.map(s => `${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}`).join(", ") },
      { label: "Total", value: `$${data.totalPrice.toFixed(2)} TTD`, gold: true },
      { label: "Payment", value: data.paymentMethod },
      ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
    ])}

    <div style="text-align:center;margin-top:28px;">
      <a href="${SITE_URL}/admin/bookings" style="display:inline-block;padding:14px 32px;background:${GOLD};color:#111;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border-radius:2px;font-family:'Georgia',serif;">View Bookings →</a>
    </div>
  `;

  return {
    subject: `Confirmed: ${data.userName} — ${formatDate(data.appointmentDate)} at ${formatTime(data.appointmentTime)}`,
    html: base("Booking Confirmed", body, "This is an automated notification for the Ethereal Skin Haven admin."),
  };
}

// ─── ADMIN: LOW STOCK ALERT ───────────────────────────────────────────────────

export interface LowStockData {
  name: string;
  category: string;
  stockQty: number;
}

export function adminLowStockTemplate(product: LowStockData): { subject: string; html: string } {
  const isOut = product.stockQty === 0;
  const body = `
    <h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 6px;">${isOut ? "Product Out of Stock" : "Low Stock Alert"}</h2>
    <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 20px;">
      ${isOut
        ? `<strong style="color:${DARK};">${product.name}</strong> is now <strong style="color:#e05555;">out of stock</strong>. It has been hidden from customers automatically.`
        : `<strong style="color:${DARK};">${product.name}</strong> is running low. Only <strong style="color:${GOLD};">${product.stockQty} unit${product.stockQty === 1 ? "" : "s"}</strong> remaining.`}
    </p>

    ${receiptTable([
      { label: "Product", value: product.name, bold: true },
      { label: "Category", value: product.category },
      { label: "Units Remaining", value: product.stockQty === 0 ? "None" : String(product.stockQty), gold: product.stockQty > 0 },
    ])}

    <div style="text-align:center;margin-top:28px;">
      <a href="${SITE_URL}/admin/products" style="display:inline-block;padding:14px 32px;background:${GOLD};color:#111;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border-radius:2px;font-family:'Georgia',serif;">Manage Products →</a>
    </div>
  `;

  return {
    subject: isOut ? `Out of Stock: ${product.name}` : `Low Stock Alert: ${product.name} (${product.stockQty} remaining)`,
    html: base(isOut ? "Out of Stock" : "Low Stock Alert", body, "This is an automated notification for the Ethereal Skin Haven admin."),
  };
}

// Legacy export aliases so existing imports don't break
export type BookingEmailData_Legacy = BookingEmailData;
export const confirmationTemplate = bookingReceivedTemplate;
