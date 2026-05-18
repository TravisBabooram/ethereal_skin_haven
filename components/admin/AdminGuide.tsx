"use client";

import { useState, useEffect } from "react";
import { X, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  emoji: string;
  content: React.ReactNode;
}

function SectionBlock({ emoji, title, id, content }: { emoji: string; title: string; id: string; content: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div id={id} style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "0.02em" }}>{title}</span>
        {open ? <ChevronDown size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: "0 28px 24px 58px" }}>
          {content}
        </div>
      )}
    </div>
  );
}

const h = (text: string) => (
  <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700, margin: "20px 0 8px" }}>{text}</p>
);

const p = (text: string) => (
  <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.75, margin: "0 0 10px" }}>{text}</p>
);

const tip = (text: string) => (
  <div style={{ margin: "12px 0", padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 4, display: "flex", gap: 10 }}>
    <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
    <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>{text}</p>
  </div>
);

const warn = (text: string) => (
  <div style={{ margin: "12px 0", padding: "10px 14px", background: "rgba(224,85,85,0.05)", border: "1px solid rgba(224,85,85,0.2)", borderRadius: 4, display: "flex", gap: 10 }}>
    <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
    <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>{text}</p>
  </div>
);

const li = (items: string[]) => (
  <ul style={{ margin: "8px 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 8 }} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SECTIONS: Section[] = [
  {
    id: "overview",
    emoji: "📊",
    title: "Dashboard Overview",
    content: (
      <div>
        {p("The Overview is your home base — it gives you a snapshot of everything happening in your business at a glance.")}
        {h("Stats Cards (top row)")}
        {li([
          "Total Clients — how many people have created an account on your site.",
          "Total Bookings — the total number of appointments ever made.",
          "Today's Bookings — how many appointments are scheduled for today.",
          "Total Revenue — sum of all non-cancelled bookings.",
        ])}
        {h("Revenue Breakdown")}
        {p("Below the stats, you'll see a revenue strip showing: This Week, This Month, and All Time totals. These help you track how the business is trending.")}
        {h("Site Controls")}
        {p("Three quick toggles you can flip without leaving the dashboard:")}
        {li([
          "Maintenance Mode — takes the entire public website offline and shows a 'Be Right Back' message. Use this when you need to make big changes and don't want clients to see an incomplete site.",
          "Gallery Coming Soon — hides your gallery page from clients and shows a 'Coming Soon' placeholder instead.",
          "Products Coming Soon — same as above but for the Products page.",
        ])}
        {tip("These toggles take effect immediately the moment you click them. No saving required.")}
        {h("Upcoming Appointments")}
        {p("Shows your next 6 confirmed/pending bookings at a glance — client name, service, date, and time. Click 'View All' to go to the full Bookings page.")}
        {h("Popular Services")}
        {p("A ranked list of your most-booked services. Useful for knowing what to keep featured on the homepage.")}
        {h("New Clients")}
        {p("The 5 most recently registered clients. Gives you a sense of who's just discovered your business.")}
        {h("Low Stock Alerts")}
        {p("If any of your products are running low (5 or fewer units remaining), they'll appear here with a warning. You also receive an email automatically when stock crosses that threshold.")}
        {h("Quick Actions")}
        {p("Shortcut buttons at the bottom for common tasks: Add Service, Add Product, View Clients, Audit Logs.")}
      </div>
    ),
  },
  {
    id: "calendar",
    emoji: "🗓️",
    title: "Calendar",
    content: (
      <div>
        {p("The Calendar gives you a visual view of all your bookings. It's especially useful for seeing how your week or month looks at a glance.")}
        {h("Views")}
        {li([
          "Month view — see every day of the month with coloured dots for bookings.",
          "Week view — see your full week with appointments plotted by time.",
          "Day view — a detailed hourly breakdown of a single day.",
        ])}
        {h("Colour Coding")}
        {li([
          "Gold — Pending (not yet confirmed)",
          "Green — Confirmed",
          "Grey — Completed",
          "Red — Cancelled",
        ])}
        {h("Clicking a Booking")}
        {p("Click on any appointment in the calendar to open a detail popup showing the client name, service, time, and status.")}
        {tip("Use the Calendar view at the start of each day to see exactly what you have coming up.")}
      </div>
    ),
  },
  {
    id: "bookings",
    emoji: "📋",
    title: "Bookings",
    content: (
      <div>
        {p("The Bookings page is where you manage all appointments — confirm, cancel, reschedule, or create them manually.")}
        {h("Filtering & Searching")}
        {li([
          "Click All, Pending, Confirmed, Completed, or Cancelled to filter the list.",
          "Use the search bar to find a specific client by name, email, or service name.",
        ])}
        {h("Clicking a Booking Row")}
        {p("Click any row to open the Detail Panel on the right. This shows:")}
        {li([
          "Client's full name, email, and phone number.",
          "Appointment date, time, payment method, and total.",
          "All services booked and their individual durations.",
          "Any notes the client left at the time of booking.",
          "Email and WhatsApp buttons to contact the client instantly.",
          "A Reschedule button if the appointment hasn't been completed or cancelled.",
        ])}
        {h("Updating a Booking Status")}
        {p("In the Actions column, use the dropdown on each row to change the status. When you confirm a booking:")}
        {li([
          "The client automatically receives a confirmation email with their full receipt.",
          "You receive a copy of the confirmation too.",
        ])}
        {warn("Cancelling a booking sends the client a cancellation email immediately. Make sure you intend to cancel before changing the status.")}
        {h("Rescheduling a Booking")}
        {p("Open the detail panel for a Pending or Confirmed booking and click Reschedule Appointment. A popup opens where you:")}
        {li([
          "Pick the new date from the calendar.",
          "Choose from the available time slots that appear automatically.",
          "Click Confirm Reschedule — the client is emailed the new details.",
        ])}
        {h("Creating a New Booking")}
        {p("Click the gold New Booking button at the top right to manually create an appointment for a client (e.g. walk-ins, phone bookings). You'll select:")}
        {li([
          "Which registered client the booking is for.",
          "Which service they want.",
          "The date and available time slot.",
          "Cash or Bank Transfer payment method.",
          "Any optional notes.",
        ])}
        {tip("The client receives the same booking confirmation email as if they booked it themselves.")}
      </div>
    ),
  },
  {
    id: "hours",
    emoji: "🕐",
    title: "Business Hours",
    content: (
      <div>
        {p("Set the days and times you're open for business. Clients will only be able to book on days and within the hours you configure here.")}
        {h("How to Set Your Hours")}
        {li([
          "Each day of the week has a toggle — click it to turn that day on (open) or off (closed).",
          "When a day is turned on, two time fields appear: Opens and Closes.",
          "Type or click the time fields to set your opening and closing times.",
          "A preview shows the times in 12-hour format (e.g. 9:00 AM – 6:00 PM) so you can double-check.",
        ])}
        {h("Saving")}
        {p("Click Save Hours when you're done. Changes take effect immediately — the booking calendar will grey out closed days right away.")}
        {tip("If you need a single day off (like a one-time holiday), use Blocked Dates instead. Business Hours is for your regular weekly schedule.")}
      </div>
    ),
  },
  {
    id: "blocked",
    emoji: "🚫",
    title: "Blocked Dates",
    content: (
      <div>
        {p("Block specific calendar dates that you won't be available — public holidays, personal days, vacations, etc. Clients won't see any time slots on these days.")}
        {h("Adding a Blocked Date")}
        {li([
          "Click the date field under 'Block a Date' and pick the date you want to block.",
          "Click Block Date — the date is immediately saved and added to the list below.",
        ])}
        {h("Removing a Blocked Date")}
        {p("Click the × button on the right of any date in the list to unblock it. The date becomes bookable again instantly.")}
        {tip("Past blocked dates stay in the list greyed out. You can remove them to keep things tidy, but they have no effect on the calendar.")}
        {warn("Blocking a date does not cancel any existing bookings already scheduled for that day. You'll need to manually reschedule or cancel those from the Bookings page.")}
      </div>
    ),
  },
  {
    id: "services",
    emoji: "✨",
    title: "Services",
    content: (
      <div>
        {p("Manage all the treatments you offer — facials, waxing, brow services, nails, and more.")}
        {h("Adding a Service")}
        {p("Click Add Service. A form opens where you fill in:")}
        {li([
          "Service Name — what the treatment is called.",
          "Description — what the client can expect.",
          "Price (TTD) — the full price of the service.",
          "Duration (minutes) — how long the appointment takes. This is used by the booking system to calculate available time slots.",
          "Category — choose from Facials, Waxing, Intimate Care, Brows, or Nails. This groups your services on the public Services page.",
          "Benefits — list what the treatment does (separated with · between each benefit).",
          "Aftercare Instructions — what the client should do after the treatment.",
          "Service Image — upload a photo by clicking the upload box or dragging a photo onto it.",
        ])}
        {h("Editing a Service")}
        {p("Click the Edit button on any service row. The same form opens pre-filled with the current details. Change whatever you need and click Save.")}
        {h("Deleting a Service")}
        {p("Click Delete on the service row. You'll be asked to confirm before it's removed.")}
        {warn("Deleting a service removes it from the website permanently. If the service has a Cloudinary image uploaded, that image is automatically deleted from storage too.")}
        {h("Featuring on the Homepage")}
        {p("Click the star icon ★ on any service row to feature it on the homepage. Up to 6 services can be featured at once. Click again to unfeature it.")}
        {tip("You can also manage which services are featured from the Homepage Manager — both places do the same thing.")}
      </div>
    ),
  },
  {
    id: "products",
    emoji: "🧴",
    title: "Products",
    content: (
      <div>
        {p("Manage the skincare products you sell or recommend — serums, cleansers, SPFs, and more.")}
        {h("Adding a Product")}
        {p("Click Add Product and fill in:")}
        {li([
          "Product Name — what it's called.",
          "Description — what the product does.",
          "Price (TTD) — the selling price.",
          "Category — how it's grouped (Retail, Professional Use, Recommended).",
          "Stock Quantity — how many units you currently have.",
          "Display Status — whether it shows as Available, Low Stock, or Out of Stock to clients.",
          "Usage Instructions — how the client should use it.",
          "Skin Type Suitability — who it's best for.",
          "Product Image — upload a photo.",
        ])}
        {h("Managing Stock")}
        {p("In the product table, each row has + and − buttons next to the stock number. Click them to adjust inventory one unit at a time — no need to open the edit form for routine stock updates.")}
        {li([
          "Stock above 5 — shown as Available (green).",
          "Stock 1–5 — shown as Low Stock (yellow). You'll receive an email alert the first time it drops into this range.",
          "Stock 0 — shown as Out of Stock (red). The product is automatically hidden from clients.",
        ])}
        {h("Visibility Toggle (Eye Icon)")}
        {p("The eye icon in the Display column lets you manually show or hide a product regardless of stock. Click the eye to hide a product from clients; click again to show it.")}
        {h("Featured Toggle")}
        {p("Click the star ★ to feature a product on the homepage. Up to 6 products can be featured.")}
        {tip("When you delete a product, its Cloudinary image is automatically deleted from storage.")}
      </div>
    ),
  },
  {
    id: "clients",
    emoji: "👥",
    title: "Clients",
    content: (
      <div>
        {p("View and manage all registered clients — people who have created an account on your website.")}
        {h("Searching")}
        {p("Use the search bar to find a client by name, email address, or phone number.")}
        {h("Client Detail Panel")}
        {p("Click any row to open a full profile panel on the right showing:")}
        {li([
          "Name, email, and phone number.",
          "How long they've been a client.",
          "Total number of bookings, total amount spent, and how many items are in their cart.",
          "Full booking history — every appointment they've ever made, with service names, dates, times, status, and any notes.",
          "Their current shopping cart if they have items saved.",
        ])}
        {h("Deleting a Client")}
        {p("At the bottom of the detail panel, there's a red Delete Client Account button. This permanently removes the client and all their data including bookings and cart items.")}
        {warn("Deleting a client cannot be undone. All their booking history will be gone. Only do this if you're certain.")}
      </div>
    ),
  },
  {
    id: "carts",
    emoji: "🛒",
    title: "Customer Carts",
    content: (
      <div>
        {p("See what clients have saved in their carts — services or products they're interested in but haven't booked or purchased yet.")}
        {p("Carts are grouped by client. For each client you can see:")}
        {li([
          "Their name and email.",
          "Each item in their cart (service or product name, price, quantity).",
          "The cart total.",
        ])}
        {tip("This page is useful for spotting clients who are close to booking but haven't committed yet — you could reach out to them via WhatsApp to nudge them along.")}
      </div>
    ),
  },
  {
    id: "reviews",
    emoji: "⭐",
    title: "Reviews",
    content: (
      <div>
        {p("Manage client reviews that have been submitted through your website. Reviews appear in the Testimonials section on your homepage.")}
        {h("What You'll See")}
        {li([
          "The reviewer's name.",
          "Their star rating (1–5 stars).",
          "The service or product they're reviewing.",
          "The date it was submitted.",
          "Their written comment.",
        ])}
        {h("Deleting a Review")}
        {p("Click the trash icon on any review to permanently remove it. Only do this for spam, inappropriate comments, or reviews that don't reflect the actual experience.")}
        {p("The average rating shown at the top right updates automatically as you add or remove reviews.")}
        {tip("All reviews submitted go live immediately. Make it a habit to check this page regularly so you can remove anything that doesn't belong.")}
      </div>
    ),
  },
  {
    id: "homepage",
    emoji: "🏠",
    title: "Homepage Manager",
    content: (
      <div>
        {p("Control what appears on your homepage without touching any code.")}
        {h("Hero Text")}
        {p("The hero is the very first thing visitors see — the large full-screen section at the top of the homepage. You can change three things:")}
        {li([
          "Tagline — the small uppercase text above the main heading (e.g. 'Luxury Spa & Esthetics').",
          "Main Heading — the large title (e.g. 'Ethereal Skin Haven').",
          "Subheading / Description — the paragraph of text below the heading.",
        ])}
        {p("Click Save Hero Text after making changes.")}
        {h("Featured Services")}
        {p("A grid of service cards is shown on the homepage. Toggle any service on or off by clicking it — selected services have a gold border. You can have a maximum of 6 featured at once.")}
        {h("Featured Products")}
        {p("Same as featured services but for your product range. Up to 6 can be featured.")}
        {tip("You can also toggle featured services and products from the Services and Products management pages — both places sync instantly.")}
      </div>
    ),
  },
  {
    id: "seo",
    emoji: "🔍",
    title: "SEO Controls",
    content: (
      <div>
        {p("SEO stands for Search Engine Optimisation — it's how Google understands what your pages are about and decides how to show them in search results. You don't need to be technical to use this.")}
        {h("What You Can Edit")}
        {p("For each public page on your website (Home, Services, Products, Gallery, etc.) you can set:")}
        {li([
          "Meta Title — the text that appears as the page title in Google search results and in your browser tab.",
          "Meta Description — a short sentence (under 160 characters) that appears below your link in Google results. Think of it as your sales pitch to someone searching.",
        ])}
        {h("How to Use It")}
        {p("Pick a page from the dropdown, type your title and description, and click Save. If you leave these blank, the website will use sensible defaults.")}
        {tip("A good Meta Title is 50–60 characters. Include your business name and what the page is about, e.g. 'Services | Ethereal Skin Haven – Luxury Esthetics in Couva'.")}
      </div>
    ),
  },
  {
    id: "gallery",
    emoji: "🖼️",
    title: "Gallery",
    content: (
      <div>
        {p("Manage the photos that appear in your public Gallery page. This is where you showcase your work — before & afters, studio shots, products, and more.")}
        {h("Adding a Photo")}
        {p("Click Add Image. A form appears with three fields:")}
        {li([
          "Image — click the upload box or drag and drop a photo directly onto it. Accepted formats: JPG, PNG, WEBP. Max size: 10 MB.",
          "Label — a short title for the photo (e.g. 'Hydrating Facial Result' or 'Studio Interior').",
          "Category — choose from Facials, Waxing, Brows, Nails, Before & After, Studio, or General. This lets clients filter photos by type.",
        ])}
        {p("Click Add Image to save. The photo is immediately live on the gallery page.")}
        {h("Editing a Photo")}
        {p("Hover over any photo in the grid. Two buttons appear at the bottom: Edit (gold) and Remove (red). Click Edit to change the label, category, or swap the image.")}
        {h("Removing a Photo")}
        {p("Hover over the photo and click Remove. You'll be asked to confirm. Once removed, the photo is deleted from both the website and Cloudinary storage.")}
        {tip("Categories on the Gallery page filter match exactly what you set here. If you assign a photo to 'Before & After', clients can filter the gallery to show only those shots.")}
      </div>
    ),
  },
  {
    id: "faq",
    emoji: "❓",
    title: "FAQ",
    content: (
      <div>
        {p("Manage the Frequently Asked Questions that appear on your FAQ page. Good FAQs reduce the number of repetitive messages you receive.")}
        {h("Adding a Question")}
        {p("Click Add FAQ. Fill in the question, the answer, and select a category (Booking, Cancellation, Preparation, Payment, Aftercare, or Products). Click Save.")}
        {h("Editing or Deleting")}
        {p("Each FAQ has Edit and Delete buttons. Click Edit to change the question, answer, or category. Click Delete to remove it entirely.")}
        {tip("Think about the questions you get asked most via WhatsApp or Instagram DMs — those are the ones to add here first.")}
      </div>
    ),
  },
  {
    id: "policies",
    emoji: "📜",
    title: "Policies",
    content: (
      <div>
        {p("Manage your official business policies — cancellation, booking, privacy, refunds, and late arrivals. These appear on your Policies page.")}
        {h("Adding a Policy")}
        {p("Click Add Policy and fill in the title, policy type, and the full text of the policy. Click Save.")}
        {h("Editing or Deleting")}
        {p("Each policy has Edit and Delete buttons. Policies should be reviewed and updated any time your terms change.")}
        {warn("Your cancellation and late arrival policies are especially important — make sure they accurately reflect what you actually enforce so there are no disputes.")}
      </div>
    ),
  },
  {
    id: "settings",
    emoji: "⚙️",
    title: "Settings",
    content: (
      <div>
        {p("The Settings page is where you find additional site controls — mainly maintenance mode and coming soon toggles.")}
        {tip("The quickest way to toggle maintenance mode and coming soon pages is directly from the Dashboard Overview, which has the same buttons. The Settings page is a backup location for the same controls.")}
      </div>
    ),
  },
  {
    id: "profile",
    emoji: "👤",
    title: "My Profile",
    content: (
      <div>
        {p("Update your admin account details — the email and password you use to log into this panel.")}
        {h("Changing Your Name or Email")}
        {p("Type your new name or email address and click Save Changes. Your new email becomes your login email immediately.")}
        {h("Changing Your Password")}
        {p("Fill in your current password, then your new password (twice to confirm), and click Change Password. You'll stay logged in after changing it.")}
        {warn("If you forget your current password, you won't be able to change it from here. Contact your developer to reset it.")}
      </div>
    ),
  },
  {
    id: "emails",
    emoji: "📧",
    title: "Automatic Emails",
    content: (
      <div>
        {p("Your website sends emails automatically — you don't need to do anything. Here's exactly when they go out and to whom.")}
        {h("Emails to Clients")}
        {li([
          "Booking Received — sent the moment a client completes a booking. Includes the appointment details and bank transfer instructions if they chose that payment method.",
          "Booking Confirmed — sent when you change a booking's status to Confirmed from the Bookings page. Includes a full receipt.",
          "Appointment Cancelled — sent when a booking is cancelled (by you or the client). Includes the appointment details.",
          "Appointment Rescheduled — sent if you change the date or time of a Confirmed booking.",
          "Day-of Reminder — sent at 7:00 AM on the day of their appointment reminding them of their slot.",
          "24-Hour Reminder — sent the morning before their appointment.",
        ])}
        {h("Emails to You (Admin)")}
        {li([
          "New Booking Alert — sent every time a client submits a booking. Includes client name, service, date, time, and a link to the admin panel.",
          "Booking Confirmed Copy — sent when you confirm a booking, so you have a record.",
          "Low Stock Alert — sent once when a product's stock drops to 5 or fewer units.",
        ])}
        {h("Where Emails Come From")}
        {p("All emails are sent from bookings@etherealskinhaven.com. Clients can reply to that address and it will forward to etherealskinhaven@gmail.com.")}
        {tip("Check your spam folder if you're not receiving admin notifications. Add bookings@etherealskinhaven.com to your contacts to prevent this.")}
      </div>
    ),
  },
  {
    id: "images",
    emoji: "📸",
    title: "Uploading Images",
    content: (
      <div>
        {p("Images throughout the admin panel — services, products, and gallery — all use the same upload system.")}
        {h("How to Upload")}
        {li([
          "Click the upload box — this opens your file browser so you can choose a photo.",
          "Or drag and drop a photo directly onto the upload box — it will highlight gold when you're hovering over it.",
          "The photo uploads automatically. You'll see a spinner while it's uploading.",
          "Once done, a preview of the photo appears.",
        ])}
        {h("Changing an Uploaded Image")}
        {p("Once a photo is uploaded, a Change button appears below the preview. Click it to replace the photo with a new one.")}
        {h("Removing an Uploaded Image")}
        {p("Click the red × button in the corner of the preview to remove the photo.")}
        {h("Supported Formats and Limits")}
        {li([
          "Formats: JPG, PNG, WEBP",
          "Maximum file size: 10 MB",
          "There's no limit on how many photos you can upload overall.",
        ])}
        {tip("For best results, use square or landscape photos for services and products. For gallery, portrait photos (taller than wide) look great in the masonry layout.")}
        {warn("Removing an image from a service or product, or deleting a gallery photo, also permanently deletes the file from Cloudinary. This keeps your storage clean but cannot be undone.")}
      </div>
    ),
  },
];

export default function AdminGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />

      {/* Panel */}
      <div style={{
        position: "relative", width: "min(680px, 100vw)", height: "100vh",
        background: "var(--bg-card)", borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column", boxShadow: "-16px 0 48px rgba(0,0,0,0.3)",
        animation: "slideIn 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,169,110,0.1)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BookOpen size={16} style={{ color: "var(--gold)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: "0 0 2px" }}>Admin Panel Guide</h2>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Click any section below to expand it</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 4, display: "flex", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            <X size={18} />
          </button>
        </div>

        {/* Intro */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", background: "rgba(201,169,110,0.03)", flexShrink: 0 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
            This guide explains every section of your admin panel in plain language. Click a section header to expand it and read how it works.
          </p>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {SECTIONS.map(s => (
            <SectionBlock key={s.id} id={s.id} emoji={s.emoji} title={s.title} content={s.content} />
          ))}
          <div style={{ height: 40 }} />
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
