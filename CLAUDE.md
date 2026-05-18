# Ethereal Skin Haven — Claude Code Project Context

> **Read this file at the start of every session before writing any code.**
> This is the single source of truth for the project. Do not deviate from this spec unless explicitly instructed.

---

## Project Identity

| Field | Value |
|---|---|
| Project Name | Ethereal Skin Haven |
| Type | Luxury Spa & Esthetics Booking + Product Showcase Platform |
| Status | In Development |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js (App Router) | Frontend framework + SSR |
| React | UI rendering |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js or NestJS | API management |
| PostgreSQL | Primary database |
| Prisma ORM | Database operations |
| JWT | Authentication |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Railway or Render | Backend hosting |
| Cloudinary | Image storage |
| Resend or SendGrid | Email reminders |

---

## Design System

### Dark Theme
- Matte Black, Metallic Gold, Champagne Gold Highlights, Soft Gold Glow Effects
- Feel: Premium, Elegant, Luxurious, Sophisticated, Modern

### Light Theme
- White, Soft Pink, Rose Beige, Light Grey Shadows
- Feel: Clean, Feminine, Soft Luxury, Relaxing, Minimalistic

### Design Principles
- Smooth animations and fluid transitions
- Elegant typography with large spacing
- Minimal but premium layouts
- Soft glowing hover effects
- Animated page transitions
- Interactive visual elements
- Skeleton loading animations
- Scroll reveal animations
- Glassmorphism overlays on hero sections

---

## Project Structure

```
ethereal-skin-haven/
├── app/                        # Next.js App Router pages
│   ├── (public)/               # Public-facing pages
│   │   ├── page.tsx            # Home
│   │   ├── services/
│   │   ├── products/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── booking/
│   │   ├── gallery/
│   │   ├── faq/
│   │   └── policies/
│   ├── (auth)/                 # Login / Register
│   ├── dashboard/              # Customer dashboard
│   └── admin/                  # Admin dashboard
├── components/                 # Reusable UI components
├── lib/                        # Utilities, helpers, API clients
├── prisma/                     # Prisma schema and migrations
├── public/                     # Static assets
├── styles/                     # Global styles
├── middleware.ts               # Auth + route protection
└── .env.local                  # Environment variables (never commit)
```

---

## Environment Variables

> When you need credentials, tell the user exactly what to create and where.
> Never hardcode secrets. Always use `process.env`.

```env
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=
JWT_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=
# or
SENDGRID_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=development
```

---

## Database Schema

### Tables
```sql
users
services
products
bookings
booking_items
cart
reviews
audit_logs
admins
email_notifications
gallery
faq
policies
```

### Key Relationships
- `bookings` → belongs to `users`
- `booking_items` → belongs to `bookings`, references `services`
- `cart` → belongs to `users`, references `services` and `products`
- `audit_logs` → belongs to `admins`
- `email_notifications` → belongs to `bookings`

---

## Authentication & Security

### Rules
- Passwords must be hashed with `bcrypt`
- JWT tokens expire in 7 days with refresh logic
- Admin routes protected by role-based middleware
- All inputs validated and sanitized server-side
- Rate limiting on all API endpoints via `express-rate-limit`
- HTTP security headers via `helmet`
- HTTPS enforced in production
- CAPTCHA on registration and booking forms
- `.env` always in `.gitignore`
- API keys never exposed to the client

### Route Protection
- `/dashboard/*` — requires authenticated user session
- `/admin/*` — requires admin role JWT claim
- All booking and cart mutations — require authenticated user

---

## Public Pages

### 1. Home Page
- Full-screen hero with animated text, floating animations, glassmorphism overlays
- CTA buttons: Book Appointment, View Services, Shop Products
- Featured Services section (max 6, admin-controlled)
- Featured Products section (max 6, admin-controlled)
- Testimonials carousel (auto-scroll, star ratings, fade transitions)
- Instagram/Social feed embed

### 2. Services Page
- Category filtering
- Animated service cards
- Each card: name, description, price, duration, benefits, aftercare, booking button

### 3. Products Page
- Categories: Retail, Professional Use, Recommended
- Each card: image, description, usage instructions, skin type suitability, availability status

### 4. About Page
- Business story, esthetician intro, qualifications, philosophy, brand values, spa imagery

### 5. Contact Page
- Phone, email, social links, business hours, embedded Google Map, contact form

### 6. Booking Page
- Multi-step form (see Booking Flow below)

### 7. Gallery Page
- Masonry layout, lightbox viewing, zoom animations, category filtering

### 8. FAQ Page
- Topics: booking process, cancellation, preparation, payment, aftercare, products

### 9. Policies Page
- Cancellation, booking, privacy, refund, late arrival policies

---

## Booking Flow

```
Step 1 → Choose service(s)
Step 2 → Select available date
Step 3 → Select available time slot
Step 4 → Enter details (name, phone, email, notes)
Step 5 → Choose payment method (Cash or Bank Transfer)
Step 6 → Receive booking confirmation
```

### Booking Rules
- Prevent double bookings (enforce at DB level)
- Buffer times between appointments
- Block unavailable/closed dates
- Manual approval option for admin
- Appointment statuses: Pending → Confirmed → Completed / Cancelled

---

## Email Reminders

### Triggers
| Email | When |
|---|---|
| Booking confirmation | Immediately after booking |
| Appointment reminder | 24 hours before |
| Same-day reminder | Morning of appointment |
| Reschedule notification | On admin reschedule |
| Cancellation notification | On cancellation |

### Email Contents
- Appointment date and time
- Service booked
- Business contact info
- Cancellation instructions

---

## Customer Dashboard

| Section | Features |
|---|---|
| Profile | Edit name, phone, email, password |
| Cart | Add/remove services and products, quantity management |
| My Orders | Order history |
| Booking History | Past appointments |
| Appointment Tracking | Live status of upcoming bookings |

---

## Admin Dashboard

| Section | Features |
|---|---|
| Overview | Upcoming appointments, total bookings, popular services/products, recent customers |
| Services Management | Full CRUD, feature on homepage toggle |
| Products Management | Full CRUD, feature on homepage toggle |
| Booking Calendar | Daily/weekly/monthly views, color coding, click-to-view details |
| Homepage Content Manager | Edit hero, banners, featured content, homepage text |
| Audit Logs | Track all admin actions (logins, edits, deletions, booking changes) |
| SEO Controls | Edit meta titles, descriptions per page |

---

## SEO Requirements

### Technical SEO
- Server-side rendering on all public pages (Next.js native)
- `generateMetadata()` per page — dynamic titles and descriptions
- Open Graph and Twitter Card meta tags
- XML sitemap (dynamic, auto-generated)
- `robots.txt`
- Canonical URLs
- Structured schema markup:
  - `LocalBusiness` schema on home and contact
  - `Service` schema on service pages
  - `Product` schema on product pages
- Semantic HTML (correct heading hierarchy, landmark elements)
- Image `alt` attributes on all images

### Local SEO
- Google Maps embed on contact page
- Local business schema with address and hours
- Mobile-first, fast loading
- SEO-friendly URL slugs (e.g. `/services/hydrating-facial`)

### Performance
- Lazy-loaded images
- CDN via Cloudinary
- Optimized media compression
- Code splitting (Next.js native)

---

## Animation Requirements

| Animation | Where |
|---|---|
| Page transitions | All route changes |
| Scroll reveal | Sections on all pages |
| Floating hero animations | Home page hero |
| Fade-in effects | Cards, sections |
| Hover glow effects | All interactive cards |
| Card expansion | Service and product cards |
| Skeleton loaders | While data is fetching |
| Glassmorphism overlays | Hero sections |

---

## Mobile Requirements

- Mobile-first CSS architecture
- All layouts fully responsive
- Touch-friendly tap targets
- Optimized animations for mobile (reduce motion where needed)
- Fast loading on mobile networks

---

## Error Handling Rules

- All API routes wrapped in try/catch
- Meaningful HTTP status codes returned (400, 401, 403, 404, 500)
- User-facing error messages are friendly, never expose stack traces
- Failed email sends are logged but do not break booking flow
- Form validation errors shown inline, not as alerts
- Loading and error states on all data-fetching components

---

## Code Standards

- TypeScript throughout (strict mode)
- Component files use PascalCase: `BookingForm.tsx`
- Utility files use camelCase: `formatDate.ts`
- API routes follow REST conventions
- Prisma queries abstracted into service layer files (e.g. `lib/services/bookings.ts`)
- No inline styles — Tailwind classes only
- All images go through Cloudinary (no local image storage)
- All secrets via `process.env` — never hardcoded

---

## Session Workflow Instructions

At the start of every new session:
1. Re-read this file fully
2. Ask the user for current project status if unclear
3. Continue from where work left off
4. Do not restart or re-scaffold already completed work
5. If a decision conflicts with this spec, flag it and ask before proceeding

When you need something from the user:
- State clearly what you need (API key, account, command to run)
- Tell them exactly where to get it
- Wait for their input before continuing
- Confirm receipt before moving on

---

## Final Vision

Ethereal Skin Haven is not a typical business website. It is a **luxury digital spa experience**. Every page, interaction, and animation should reinforce that feeling. The code must be clean, the UI must be premium, and the customer journey must feel effortless.

---

## Current Build Status

> Last updated: 2026-05-17. Update this section at the end of every session.

### What Is Built

#### Public Pages — ALL COMPLETE
| Page | File | Status |
|---|---|---|
| Home | `app/(public)/page.tsx` | ✅ Built — hero, featured services, featured products, testimonials, CTA |
| Services | `app/(public)/services/page.tsx` | ✅ Built — category filter, expandable cards, image rendering, Add to Cart, Book link |
| Products | `app/(public)/products/page.tsx` | ✅ Built — category filter, expandable cards, Add to Cart (available items only) |
| About | `app/(public)/about/page.tsx` | ✅ Built — portrait photo live, credentials card, brand values |
| Contact | `app/(public)/contact/page.tsx` | ✅ Built |
| Booking | `app/(public)/booking/page.tsx` | ✅ Built — full 6-step form with hCaptcha on submission |
| Gallery | `app/(public)/gallery/page.tsx` | ✅ Built — masonry, lightbox, real images only (no placeholders), category filter |
| FAQ | `app/(public)/faq/page.tsx` | ✅ Built |
| Policies | `app/(public)/policies/page.tsx` | ✅ Built |

#### Auth Pages — COMPLETE
| Page | File | Status |
|---|---|---|
| Login | `app/(auth)/login/page.tsx` | ✅ Built — email/password, JWT cookie, redirects to /dashboard or /admin by role |
| Register | `app/(auth)/register/page.tsx` | ✅ Built — name, email, **phone (required)**, password with strength meter |

#### Customer Dashboard — COMPLETE
| Page | File | Status |
|---|---|---|
| Layout + sidebar | `app/dashboard/layout.tsx` | ✅ Built |
| Overview | `app/dashboard/page.tsx` | ✅ Built — stats, upcoming appointments, past visits |
| My Bookings | `app/dashboard/bookings/page.tsx` | ✅ Built — full history, status filter tabs, Cancel button (24h notice enforced) |
| Cart | `app/dashboard/cart/page.tsx` | ✅ Built — qty +/−, remove, order summary, proceed to booking |
| Profile | `app/dashboard/profile/page.tsx` | ✅ Built — edit name/email/phone, change password |

#### Admin Dashboard — COMPLETE
| Page | File | Status |
|---|---|---|
| Layout + sidebar | `app/admin/layout.tsx` | ✅ Built |
| Overview | `app/admin/page.tsx` | ✅ Built — stats, upcoming bookings, popular services, recent users |
| Bookings | `app/admin/bookings/page.tsx` | ✅ Built — list view, status filtering, inline status update |
| Calendar | `app/admin/calendar/page.tsx` | ✅ Built — month/week/day views, booking detail modal |
| Services | `app/admin/services/page.tsx` | ✅ Built — full CRUD, image upload via Cloudinary, featured toggle |
| Products | `app/admin/products/page.tsx` | ✅ Built — full CRUD, image upload, stock +/−, featured toggle |
| Gallery | `app/admin/gallery/page.tsx` | ✅ Built — upload image, set label + category, delete |
| Clients | `app/admin/users/page.tsx` | ✅ Built — searchable table |
| Customer Carts | `app/admin/cart/page.tsx` | ✅ Built — grouped by user |
| Homepage Manager | `app/admin/homepage/page.tsx` | ✅ Built — hero text, featured services/products toggle |
| SEO Controls | `app/admin/seo/page.tsx` | ✅ Built — per-page meta title + description |
| FAQ | `app/admin/faq/page.tsx` | ✅ Built — CRUD |
| Policies | `app/admin/policies/page.tsx` | ✅ Built — CRUD |
| Audit Logs | `app/admin/audit-logs/page.tsx` | ✅ Built |
| Admin Profile | `app/admin/profile/page.tsx` | ✅ Built — edit name/email, change password |

#### API Routes — COMPLETE
| Route | Methods | Notes |
|---|---|---|
| `/api/auth/register` | POST | Requires name, email, phone, password |
| `/api/auth/login` | POST | Checks users + admins tables; sets httpOnly JWT cookie |
| `/api/auth/logout` | POST | Clears cookie |
| `/api/auth/me` | GET | Returns current user from cookie |
| `/api/auth/refresh` | POST | Token refresh |
| `/api/users/profile` | GET, PUT | Authenticated user profile |
| `/api/users/profile/delete` | POST | Delete account |
| `/api/cart` | GET, POST | User's cart items |
| `/api/cart/[id]` | PUT, DELETE | Update qty / remove item |
| `/api/bookings` | GET, POST | Sends `bookingReceived` + `adminNewBooking` emails on POST |
| `/api/bookings/[id]` | GET, PUT | Individual booking |
| `/api/bookings/availability` | GET | Available time slots for a given date + duration |
| `/api/services` | GET, POST | Public GET supports `?featured=true&limit=6` |
| `/api/services/[id]` | GET, PUT, DELETE | Individual service |
| `/api/products` | GET, POST | Same pattern as services |
| `/api/products/[id]` | GET, PUT, DELETE | Fires low stock alert email when stock crosses ≤5 threshold |
| `/api/gallery` | GET, POST | Gallery images |
| `/api/gallery/[id]` | GET, PUT, DELETE | Individual image |
| `/api/faq` | GET, POST | FAQ entries |
| `/api/faq/[id]` | GET, PUT, DELETE | Individual FAQ |
| `/api/policies` | GET, POST | Policy documents |
| `/api/policies/[id]` | GET, PUT, DELETE | Individual policy |
| `/api/reviews` | GET, POST | Reviews |
| `/api/reviews/[id]` | GET, PUT, DELETE | Individual review |
| `/api/coming-soon` | GET | Returns `{ gallery: bool, products: bool }` flags |
| `/api/instagram` | GET | Fetch Instagram posts via Graph API |
| `/api/cron/send-reminders` | GET | Protected by `CRON_SECRET` header; sends 24hr + same-day reminders |
| `/api/cron/refresh-instagram-token` | GET | Refreshes Instagram access token monthly |
| `/api/admin/stats` | GET | Dashboard stats |
| `/api/admin/bookings` | GET | Paginated bookings with filters |
| `/api/admin/bookings/[id]` | GET, PUT | Status update fires `bookingConfirmed` (client + admin) or `cancellation` email |
| `/api/admin/bookings/calendar` | GET | Bookings by date range for calendar view |
| `/api/admin/users` | GET | Paginated client list |
| `/api/admin/users/[id]` | GET, PUT, DELETE | Individual user management |
| `/api/admin/cart` | GET | All customer carts grouped by user |
| `/api/admin/products/receipt` | POST | Sends product receipt email |
| `/api/admin/profile` | GET, PUT | Admin's own profile + password change |
| `/api/admin/audit-logs` | GET | Audit log entries |
| `/api/admin/settings` | GET, PUT | Site settings (hero text, SEO) |
| `/api/admin/upload` | POST | Returns Cloudinary signed upload credentials |
| `/api/admin/coming-soon` | GET, PUT | Toggle coming soon mode per page |
| `/api/admin/maintenance` | GET, PUT | Toggle maintenance mode |

#### Email System — FULLY WIRED
| Trigger | Recipient | Function |
|---|---|---|
| New booking created | Client | `sendBookingReceivedEmail` — includes bank transfer details if applicable |
| New booking created | Admin | `sendAdminNewBookingNotification` |
| Admin confirms booking | Client | `sendBookingConfirmedEmail` — full receipt |
| Admin confirms booking | Admin | `sendAdminBookingConfirmedNotification` |
| Admin cancels booking | Client | `sendCancellationEmail` |
| Admin reschedules confirmed booking | Client | `sendRescheduleEmail` |
| Cron at 7am TTD (11am UTC) | Client | `sendReminderEmail("sameday")` — day-of reminder |
| Cron at 7am TTD (11am UTC) | Client | `sendReminderEmail("24hr")` — 24h ahead reminder |
| Product stock drops through 5 | Admin | `sendAdminLowStockAlert` — fires once on threshold crossing only |

All sent from `bookings@etherealskinhaven.com` (Resend, domain verified).
All client emails logged to `EmailNotification` table to prevent duplicates.

#### Image Upload System — COMPLETE
- `components/admin/CloudinaryUpload.tsx` — drag-and-drop + click to upload, 10MB limit, preview with remove/change, full-width
- `app/api/admin/upload/route.ts` — generates signed Cloudinary credentials server-side (admin only)
- Used in: Services admin, Products admin, Gallery admin
- Gallery categories (admin + public synced): Facials, Waxing, Brows, Nails, Before & After, Studio, General

#### Service Layer (`lib/services/`)
| File | Purpose |
|---|---|
| `users.ts` | User CRUD |
| `bookings.ts` | Booking CRUD, availability checking |
| `cart.ts` | Cart CRUD |
| `services.ts` | Service/treatment CRUD |
| `products.ts` | Product CRUD, `getLowStockProducts(threshold)` |
| `admins.ts` | Admin lookup |
| `admin.ts` | `getDashboardStats` |
| `settings.ts` | `getSetting`, `setSetting`, `getSettings`, `setSettings` |
| `gallery.ts`, `faq.ts`, `policies.ts`, `reviews.ts`, `audit.ts` | CRUD helpers |

---

### Critical Implementation Notes

> These are non-obvious facts that caused bugs and must be remembered.

1. **`success()` returns data DIRECTLY — no wrapper.**
   `lib/utils/error.ts` → `success(data)` calls `NextResponse.json(data)`. The response body IS the data.
   Pages must access response fields directly: `const d = await res.json(); d.name` — NOT `d.data.name`.

2. **JWT is in an httpOnly cookie — never readable by JavaScript.**
   Always use `credentials: "include"` on every `fetch()` call that needs auth.

3. **Booking API requires authentication.**
   `POST /api/bookings` is wrapped in `withAuth`. Returns 401 if not logged in.
   The booking page shows a "Sign In" banner on the payment step if `user` is null.

4. **Admin JWT payload uses `userId` (not `adminId`).**
   `JWTPayload` has `userId: string`. For admins, `userId` = the admin's DB id and `role = "admin"`.

5. **Password changes require current password verification.**
   Both `/api/users/profile` PUT and `/api/admin/profile` PUT verify current password first.

6. **Services and products data is fetched as a raw array.**
   `GET /api/services` returns `Service[]` directly. Always check `Array.isArray(d)` before setting state.

7. **Phone number is required on registration.**
   The register form and API both require `phone`. The DB field is `String?` (optional for legacy) but the API enforces it.

8. **Inline styles with CSS variables are the established pattern.**
   The entire codebase uses `style={{}}` props with CSS custom properties (`var(--gold)`, `var(--bg-card)`, etc.). Do not switch to Tailwind classes.

9. **Business hours: Tuesday–Saturday, 9 AM – 6 PM.**
   Sunday (0) and Monday (1) are blocked in the booking calendar. Slots are 30-minute intervals with a 15-minute buffer.

10. **Bank details are hardcoded in the booking payment step.**
    First Citizens Bank, Account: 3128614, Name: Ethereal Skin Haven (Savings). WhatsApp receipt confirmation required.

11. **Low stock alert fires only once per threshold crossing.**
    `PUT /api/products/[id]` compares `before.stockQty > 5` and `updated.stockQty <= 5`. Only triggers on the first drop — not on every subsequent update.

12. **Cron runs at 11am UTC = 7am Trinidad time.**
    `vercel.json` schedule is `0 11 * * *`. Trinidad is UTC-4 with no DST.

13. **`CLOUDINARY_CLOUD_NAME` is exempt from Netlify secrets scanning.**
    Set in `netlify.toml` via `SECRETS_SCAN_OMIT_KEYS`. The cloud name is public — it appears in every Cloudinary URL. The API key and secret remain protected.

14. **Esthetician photo is a hardcoded constant.**
    `ESTHETICIAN_IMAGE` in `app/(public)/about/page.tsx` — currently set to the Cloudinary URL. Update this constant to change the photo.

---

### Hardcoded Values Reference

| Constant | Location | Value |
|---|---|---|
| `ESTHETICIAN_IMAGE` | `app/(public)/about/page.tsx` | Cloudinary URL (set) |
| `FROM` email | `lib/email/index.ts` | `bookings@etherealskinhaven.com` |
| `ADMIN_EMAIL` | `lib/email/index.ts` | `etherealskinhaven@gmail.com` |
| `REPLY_TO` | `lib/email/index.ts` | `etherealskinhaven@gmail.com` |
| `WHATSAPP` | `lib/email/templates.ts` | `+1 (868) 705-7023` |
| `BANK_NAME` | `lib/email/templates.ts` | First Citizens Bank |
| `BANK_ACCOUNT` | `lib/email/templates.ts` | `3128614` |
| `SITE_URL` | `lib/email/templates.ts` | `https://etherealskinhaven.com` |
| `LOW_STOCK_THRESHOLD` | `app/api/products/[id]/route.ts` | `5` |
| hCaptcha site key | `app/(public)/booking/page.tsx` | `cda45378-45f6-463a-a83e-758e8e9c4d7e` |

---

### Environment Variables (all required)

```env
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=
JWT_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Resend — domain verified)
RESEND_API_KEY=

# hCaptcha
HCAPTCHA_SECRET_KEY=

# Cron protection
CRON_SECRET=

# Rate limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Instagram feed (optional)
INSTAGRAM_ACCESS_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://etherealskinhaven.com
NODE_ENV=production
```

---

### Database Schema (Prisma models)

```
User, Admin, Service, Product, Booking, BookingItem,
CartItem, Review, EmailNotification, AuditLog,
GalleryImage, FAQ, Policy, SiteSettings
```

`SiteSettings` is a key/value store used for hero text and per-page SEO overrides.

---

### What Is NOT Yet Built / Still To Do

| Item | Priority | Notes |
|---|---|---|
| **Add real photography** | High | Hero: set `HERO_BG_IMAGE` const in `components/home/Hero.tsx`. Products/services: upload via admin panel — `image` field auto-renders. |
| **Connect Instagram feed** | Medium | `components/home/InstagramFeed.tsx` is a placeholder grid — integrate Instagram Graph API or replace with real photos |
| Connect coming-soon + maintenance toggles to admin sidebar | Low | API routes exist; admin UI pages exist but may not be linked in nav |

### Deployment

- **Netlify** (active) — `netlify.toml` configured, `@netlify/plugin-nextjs` installed
- **Vercel** — `vercel.json` configured with cron jobs (use Vercel for cron, Netlify for hosting, or consolidate)
- Build command: `npx prisma generate && npm run build`