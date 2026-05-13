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

> Last updated: 2026-05-13. Update this section at the end of every session.

### What Is Built

#### Public Pages — ALL COMPLETE
| Page | File | Status |
|---|---|---|
| Home | `app/(public)/page.tsx` | ✅ Built — hero, featured services, featured products, testimonials, CTA |
| Services | `app/(public)/services/page.tsx` | ✅ Built — category filter, expandable cards, Add to Cart button, Book link |
| Products | `app/(public)/products/page.tsx` | ✅ Built — category filter, expandable cards, Add to Cart button (available items only) |
| About | `app/(public)/about/page.tsx` | ✅ Built |
| Contact | `app/(public)/contact/page.tsx` | ✅ Built |
| Booking | `app/(public)/booking/page.tsx` | ✅ Built — full 6-step form (service → date → time → details → payment → confirm) |
| Gallery | `app/(public)/gallery/page.tsx` | ✅ Built |
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
| Layout + sidebar | `app/dashboard/layout.tsx` | ✅ Built — Home, Overview, My Bookings, Cart, My Profile, Sign Out |
| Overview | `app/dashboard/page.tsx` | ✅ Built — stats, upcoming appointments, past visits |
| My Bookings | `app/dashboard/bookings/page.tsx` | ✅ Built — full history, status filter tabs, per-booking service breakdown |
| Cart | `app/dashboard/cart/page.tsx` | ✅ Built — qty +/−, remove, order summary, proceed to booking |
| Profile | `app/dashboard/profile/page.tsx` | ✅ Built — edit name/email/phone, change password with current password check |

#### Admin Dashboard — COMPLETE
| Page | File | Status |
|---|---|---|
| Layout + sidebar | `app/admin/layout.tsx` | ✅ Built — all nav items including Customer Carts and My Profile |
| Overview | `app/admin/page.tsx` | ✅ Built — stats, upcoming bookings, popular services, recent users |
| Bookings | `app/admin/bookings/page.tsx` | ✅ Built — list view, status filtering, inline status update dropdown |
| Services | `app/admin/services/page.tsx` | ✅ Built — full CRUD |
| Products | `app/admin/products/page.tsx` | ✅ Built — full CRUD |
| Clients | `app/admin/users/page.tsx` | ✅ Built — searchable table, shows name/email/phone/booking count |
| Customer Carts | `app/admin/cart/page.tsx` | ✅ Built — grouped by user, shows items and cart totals |
| Gallery | `app/admin/gallery/page.tsx` | ✅ Built — CRUD |
| FAQ | `app/admin/faq/page.tsx` | ✅ Built — CRUD |
| Policies | `app/admin/policies/page.tsx` | ✅ Built — CRUD |
| Audit Logs | `app/admin/audit-logs/page.tsx` | ✅ Built |
| Admin Profile | `app/admin/profile/page.tsx` | ✅ Built — edit name/email, change password |

#### API Routes — COMPLETE
| Route | Methods | Notes |
|---|---|---|
| `/api/auth/register` | POST | Creates user — requires name, email, phone, password |
| `/api/auth/login` | POST | Checks users + admins tables; sets httpOnly JWT cookie |
| `/api/auth/logout` | POST | Clears cookie |
| `/api/auth/me` | GET | Returns current user from cookie |
| `/api/auth/refresh` | POST | Token refresh |
| `/api/users/profile` | GET, PUT | Authenticated user profile — safe field-only updates, password change requires current password |
| `/api/cart` | GET, POST | User's cart items |
| `/api/cart/[id]` | PUT, DELETE | Update qty / remove item |
| `/api/bookings` | GET, POST | User's bookings / create new booking |
| `/api/bookings/[id]` | GET, PUT | Individual booking |
| `/api/bookings/availability` | GET | Available time slots for a given date + duration |
| `/api/services` | GET, POST | Public GET (supports `?featured=true&limit=6`) / admin POST |
| `/api/services/[id]` | GET, PUT, DELETE | Individual service |
| `/api/products` | GET, POST | Same pattern as services |
| `/api/products/[id]` | GET, PUT, DELETE | Individual product |
| `/api/gallery` | GET, POST | Gallery images |
| `/api/gallery/[id]` | GET, PUT, DELETE | Individual image |
| `/api/faq` | GET, POST | FAQ entries |
| `/api/faq/[id]` | GET, PUT, DELETE | Individual FAQ |
| `/api/policies` | GET, POST | Policy documents |
| `/api/policies/[id]` | GET, PUT, DELETE | Individual policy |
| `/api/reviews` | GET, POST | Reviews |
| `/api/reviews/[id]` | GET, PUT, DELETE | Individual review |
| `/api/cron/send-reminders` | GET | Scheduled email reminders (24h, same-day) |
| `/api/admin/stats` | GET | Dashboard stats — totalUsers, totalBookings, todayBookings, revenue, upcomingBookings, popularServices, recentUsers |
| `/api/admin/bookings` | GET | Paginated bookings with filters |
| `/api/admin/bookings/[id]` | PUT | Update booking status |
| `/api/admin/users` | GET | Paginated client list |
| `/api/admin/cart` | GET | All customer carts grouped by user |
| `/api/admin/profile` | GET, PUT | Admin's own profile + password change |
| `/api/admin/audit-logs` | GET | Audit log entries |

#### Service Layer (`lib/services/`)
| File | Functions |
|---|---|
| `users.ts` | `getUserById`, `getUserByEmail`, `createUser(email, name, hash, phone?)`, `updateUser`, `getUserProfile` |
| `bookings.ts` | `getBookingsByUser`, `getBookingById`, `getUpcomingBookings`, `updateBooking`, `getAvailableTimeSlots`, `isSlotAvailable`, `createBooking` |
| `cart.ts` | `getCartByUser`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart` |
| `services.ts` | `getAllServices`, `getFeaturedServices`, `createService`, etc. |
| `products.ts` | product CRUD helpers |
| `admins.ts` | `getAdminByEmail`, `getAdminById` |
| `admin.ts` | `getDashboardStats` |
| `gallery.ts`, `faq.ts`, `policies.ts`, `reviews.ts`, `audit.ts` | respective CRUD helpers |

---

### Critical Implementation Notes

> These are non-obvious facts that caused bugs and must be remembered.

1. **`success()` returns data DIRECTLY — no wrapper.**
   `lib/utils/error.ts` → `success(data)` calls `NextResponse.json(data)`. The response body IS the data.
   Pages must access response fields directly: `const d = await res.json(); d.name` — NOT `d.data.name`.

2. **JWT is in an httpOnly cookie — never readable by JavaScript.**
   `document.cookie` will never expose the `token`. Always use `credentials: "include"` on every `fetch()` call that needs auth. The browser sends the cookie automatically.

3. **Booking API requires authentication.**
   `POST /api/bookings` is wrapped in `withAuth`. If the user is not logged in the booking will return 401.
   The booking page (`/booking`) shows a "Sign In" banner on the payment step if `user` is null.

4. **Admin JWT payload uses `userId` (not `adminId`).**
   `JWTPayload` interface has `userId: string`. For admins, `userId` = the admin's DB id and `role = "admin"`.

5. **Password changes require current password verification.**
   Both `/api/users/profile` PUT and `/api/admin/profile` PUT verify the current password before allowing a new one.

6. **Services and products data is fetched as a raw array.**
   `GET /api/services` returns `Service[]` directly. Pages must check `Array.isArray(d)` before setting state.

7. **Phone number is now a required field on registration.**
   The register form and API both require `phone`. The DB field is `phone String?` (optional for legacy data) but the API enforces it at the application level.

8. **Inline styles with CSS variables are the established pattern.**
   Despite the CLAUDE.md saying "Tailwind only", the entire codebase uses inline `style={{}}` props with CSS custom properties (`var(--gold)`, `var(--bg-card)`, etc.). Follow this pattern — do not switch to Tailwind classes.

9. **Business hours: Tuesday–Saturday, 9 AM – 6 PM.**
   Sunday (0) and Monday (1) are blocked in the booking calendar. Slots are 30-minute intervals with a 15-minute buffer between appointments.

10. **Bank details are hardcoded in the booking payment step.**
    First Citizens Bank, Account: 3128614, Name: Ethereal Skin Haven (Savings). WhatsApp receipt confirmation required.

---

### Additional Files Built (Phase 2 — 2026-05-13)

| File | Purpose |
|---|---|
| `app/admin/calendar/page.tsx` | Booking calendar — month/week/day views, booking detail modal |
| `app/api/admin/bookings/calendar/route.ts` | Calendar API — bookings by date range |
| `app/admin/homepage/page.tsx` | Homepage content manager — hero text, featured services/products toggle |
| `app/admin/seo/page.tsx` | SEO controls — per-page meta title + description |
| `app/api/admin/settings/route.ts` | Settings API — GET/PUT site settings |
| `lib/services/settings.ts` | Settings service — getSetting, setSetting, getSettings, setSettings |
| `prisma/schema.prisma` | Added `SiteSettings` model (key/value store for hero text + SEO) |
| `app/robots.ts` | robots.txt — allows public pages, blocks admin/dashboard/api |
| `app/sitemap.ts` | XML sitemap — static pages + dynamic service/product URLs |
| `app/(public)/*/layout.tsx` | Per-route metadata layouts for all 8 "use client" public pages |
| `components/admin/CloudinaryUpload.tsx` | Reusable image upload component — signed upload to Cloudinary |
| `app/api/admin/upload/route.ts` | Cloudinary signed upload URL generator |

### Additional Files Built (Phase 3 — 2026-05-13)

| File | Purpose |
|---|---|
| `components/ui/WhatsAppFloat.tsx` | Sticky floating WhatsApp button on all public pages — expands on hover |
| `components/seo/SchemaMarkup.tsx` | JSON-LD schema component — LocalBusiness on home+contact, ItemList on services |
| `components/home/InstagramFeed.tsx` | Instagram feed section on home page — placeholder grid, follow CTA |
| `vercel.json` | Vercel cron config — fires `/api/cron/send-reminders` daily at 8 AM |

### Key Changes in Phase 3

- **WhatsApp deep-links**: All service "Book" buttons link to `/booking?services={id}` (pre-selects service). All product "Enquire" buttons pre-fill WhatsApp message with product name.
- **Card shimmer animation**: Gold sweep on hover via `card-base::after` pseudo-element (CSS keyframe, no JS).
- **Booking progress persistence**: The 6-step booking form saves to `localStorage` under `ethereal_booking_progress` (TTL: 24h). Restored on page load unless pre-empted by `?services=` URL param.
- **Customer cancellation**: Dashboard bookings page now shows a "Cancel" button on Pending/Confirmed bookings. Enforces 24h notice rule client-side; the API already enforces the permission server-side.
- **Review submission**: "Share Your Experience" button below testimonials opens a modal form (name, star rating, text) that POSTs to `/api/reviews`.
- **Image slots ready**: Hero, About esthetician avatar, product/service cards all check for an image URL and fall back to the existing placeholder. Set the Cloudinary URL in the constant to activate.
- **Schema markup**: `LOCAL_BUSINESS_SCHEMA` (BeautySalon type) rendered on home + contact pages. Services page gets an ItemList schema.

### What Is NOT Yet Built / Still To Do

| Item | Priority | Notes |
|---|---|---|
| **Run DB migration** | Critical | `npx prisma db push` needed to create `site_settings` table after schema update |
| **Set Cloudinary env vars** | High | Need `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env.local` |
| **Set email env var** | High | Need `RESEND_API_KEY` in `.env.local`. Email code in `lib/email/` is complete. |
| **Add real photography** | High | Hero: set `HERO_BG_IMAGE` const in `components/home/Hero.tsx`. Esthetician photo: set url in `app/(public)/about/page.tsx`. Products/services: upload via admin panel then `image` field auto-renders. |
| **Connect Instagram feed** | Medium | `components/home/InstagramFeed.tsx` is placeholder — swap `TILE_GRADIENTS` for real images or integrate Instagram Basic Display API |
| CAPTCHA on forms | Low | Referenced in spec but not implemented |
| Rate limiting | Low | Referenced in spec — implement via Next.js middleware or upstash/ratelimit |
| Customer order history | Low | Bookings already serve this purpose — no separate orders needed |

### Required Setup Steps (Before Going Live)

```bash
# 1. Push the new SiteSettings table to your database
npx prisma db push

# 2. Set environment variables in .env.local:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=https://etherealskinhaven.com
JWT_SECRET=your_strong_random_secret
DATABASE_URL=your_postgres_url
```