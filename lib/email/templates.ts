const BRAND = "Ethereal Skin Haven";
const PRIMARY = "#C9A96E";
const DARK = "#1a1a1a";

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:36px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:4px;color:${PRIMARY};text-transform:uppercase;">Luxury Spa &amp; Esthetics</p>
            <h1 style="margin:8px 0 0;font-size:26px;color:#fff;font-weight:400;letter-spacing:2px;">${BRAND}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
              ${BRAND} &nbsp;|&nbsp; Questions? Reply to this email or call us directly.<br/>
              <span style="color:#ccc;">You are receiving this because you made a booking with us.</span>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function appointmentDetails(
  serviceName: string,
  date: string,
  time: string,
  paymentMethod: string
): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:6px;margin:24px 0;">
    <tr><td style="padding:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;">Service</td>
          <td style="padding:8px 0;color:${DARK};font-size:14px;font-weight:bold;text-align:right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;border-top:1px solid #eee;">Date</td>
          <td style="padding:8px 0;color:${DARK};font-size:14px;text-align:right;border-top:1px solid #eee;">${date}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;border-top:1px solid #eee;">Time</td>
          <td style="padding:8px 0;color:${DARK};font-size:14px;text-align:right;border-top:1px solid #eee;">${time}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:14px;border-top:1px solid #eee;">Payment</td>
          <td style="padding:8px 0;color:${DARK};font-size:14px;text-align:right;border-top:1px solid #eee;">${paymentMethod}</td>
        </tr>
      </table>
    </td></tr>
  </table>`;
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface BookingEmailData {
  userName: string;
  userEmail: string;
  serviceName: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  paymentMethod: string;
}

export function confirmationTemplate(data: BookingEmailData): { subject: string; html: string } {
  const details = appointmentDetails(
    data.serviceName,
    formatDate(data.appointmentDate),
    data.appointmentTime,
    data.paymentMethod
  );

  return {
    subject: `Booking Confirmed – ${formatDate(data.appointmentDate)}`,
    html: base(
      "Booking Confirmed",
      `<h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 8px;">Your appointment is confirmed</h2>
       <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 4px;">Hello ${data.userName},</p>
       <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">We're looking forward to seeing you. Here's a summary of your booking:</p>
       ${details}
       <p style="color:#666;font-size:14px;line-height:1.7;margin:20px 0 0;">
         Need to cancel or reschedule? Please contact us at least 24 hours in advance.<br/>
         We can't wait to give you an exceptional experience. ✨
       </p>`
    ),
  };
}

export function reminderTemplate(
  data: BookingEmailData,
  type: "24hr" | "sameday"
): { subject: string; html: string } {
  const timeLabel = type === "24hr" ? "tomorrow" : "today";
  const details = appointmentDetails(
    data.serviceName,
    formatDate(data.appointmentDate),
    data.appointmentTime,
    data.paymentMethod
  );

  return {
    subject: `Reminder: Your appointment is ${timeLabel}`,
    html: base(
      "Appointment Reminder",
      `<h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 8px;">Your appointment is ${timeLabel}</h2>
       <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">Hello ${data.userName}, just a friendly reminder about your upcoming visit:</p>
       ${details}
       <p style="color:#666;font-size:14px;line-height:1.7;margin:20px 0 0;">
         ${type === "sameday" ? "We're excited to see you today! Please arrive 5–10 minutes early." : "We look forward to seeing you tomorrow. If you need to reschedule, please contact us as soon as possible."}
       </p>`
    ),
  };
}

export function cancellationTemplate(data: BookingEmailData): { subject: string; html: string } {
  return {
    subject: `Booking Cancelled – ${formatDate(data.appointmentDate)}`,
    html: base(
      "Booking Cancelled",
      `<h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 8px;">Your booking has been cancelled</h2>
       <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">Hello ${data.userName}, your appointment on <strong>${formatDate(data.appointmentDate)}</strong> at <strong>${data.appointmentTime}</strong> for <strong>${data.serviceName}</strong> has been cancelled.</p>
       <p style="color:#666;font-size:14px;line-height:1.7;margin:0;">
         We hope to see you again soon. Book a new appointment anytime through our website.
       </p>`
    ),
  };
}

export function rescheduleTemplate(data: BookingEmailData): { subject: string; html: string } {
  const details = appointmentDetails(
    data.serviceName,
    formatDate(data.appointmentDate),
    data.appointmentTime,
    data.paymentMethod
  );

  return {
    subject: `Appointment Rescheduled – New time: ${data.appointmentTime} on ${formatDate(data.appointmentDate)}`,
    html: base(
      "Appointment Rescheduled",
      `<h2 style="color:${DARK};font-size:22px;font-weight:400;margin:0 0 8px;">Your appointment has been rescheduled</h2>
       <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">Hello ${data.userName}, your appointment has been moved to a new time. Here are your updated details:</p>
       ${details}
       <p style="color:#666;font-size:14px;line-height:1.7;margin:20px 0 0;">
         If this time doesn't work for you, please contact us and we'll find a suitable alternative.
       </p>`
    ),
  };
}
