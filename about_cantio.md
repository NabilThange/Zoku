# Cantio → Zoku 🚚

## Current State: Cantio (Single Canteen App)
Cantio is a Next.js-based web application that enables students to order food from their college canteen online, skip queues, and track orders in real-time. Staff can manage orders, menus, and view reports.

## Future Vision: Zoku (Multi-Truck Aggregator)
Zoku will transform Cantio into a campus food truck aggregator platform connecting multiple rotating food trucks with college students. Think "Uber for campus food trucks" - we don't own trucks, we connect them.

**Key Difference**: Single canteen → Multiple trucks | One staff login → Per-truck staff + super admin | Static location → Dynamic daily schedules

> 📋 See `ZOKU_TRANSFORMATION_PLAN.md` for detailed transformation roadmap

## Technology Stack
- Next.js 14 with React 18
- TypeScript
- Supabase (database & real-time)
- Tailwind CSS
- Radix UI components
- Android TWA (Trusted Web Activity) wrapper

## Pages & Features

### Landing Page (`/`)
- Hero section with video demo
- "Skip the Queue, Order Ahead" value proposition
- Live order notifications animation
- Statistics display (500+ orders, 2min avg wait)
- CTA button to onboarding

### Onboarding (`/onboarding`)
- 3-page swipeable onboarding flow
- Video animations for each page
- Skip option to jump to login
- Pages explain: work ease, team organization, notifications

### Authentication

#### Login (`/auth/login`)
- Email or phone number login toggle
- Password field with show/hide
- Google OAuth integration
- Forgot password link
- Redirect to register page

#### Register (`/auth/register`)
- Full name, email/phone toggle
- Password with confirmation
- Terms & conditions checkbox
- Account creation flow

### Main App (`/app`)
Dual-mode interface with toggle between Student and Staff views.

#### Student Mode

**Menu Tab**
- Personalized greeting
- Search bar with real-time filtering
- Category chips (All, Breakfast, Lunch, Snacks, Beverages)
- "Need to Try" section with random featured items
- Grid view of all menu items
- Each item shows: image, veg/non-veg indicator, name, rating, prep time, price, calories
- Add to cart with quantity controls
- Item detail modal with full nutritional info

**Cart Tab**
- Cart summary with item list
- Quantity adjustment controls
- Order total calculation
- Checkout button
- Ongoing orders display
- Completed order history

**Orders Tab**
- Active order tracking with real-time status
- Progress tracker (Placed → Confirmed → Preparing → Ready → Completed)
- Token number display
- Estimated time
- Recent order history

**Profile Tab**
- User information (name, student ID)
- Contact details (phone)
- Location (hostel/room)
- Edit profile button

#### Staff Mode

**Orders Tab**
- Real-time order management
- Filter by status (All, New, Preparing, Ready)
- Order cards with:
  - Token number
  - Customer name
  - Order items with quantities
  - Total amount
  - Payment status
  - Time elapsed
  - Urgency indicators
- Status update buttons (Start Preparing, Mark Ready, Complete)
- QR code scanner for pickup verification

**Menu Tab**
- Full menu item management
- Add new items with form
- Edit existing items
- Toggle availability
- Delete items
- Category management
- Stock quantity tracking

**Reports Tab**
- Sales analytics dashboard
- Revenue charts
- Popular items statistics
- Order trends
- Time-based analysis

### Payment Flow
- Payment modal with UPI/Card/Wallet options
- Payment processing simulation
- Success screen with order token
- Estimated pickup time
- Track order button

## Key Components

### Student Components
- `MenuItemCard` - Displays menu items with add-to-cart
- `CartSummary` - Shopping cart with checkout
- `OrderProgressTracker` - Real-time order status
- `FloatingActionBar` - Quick access to cart/orders
- `StudentNavbar` - Bottom navigation

### Staff Components
- `OrderManagement` - Order queue and status updates
- `MenuManagement` - CRUD operations for menu items
- `ReportsDashboard` - Analytics and insights
- `StaffNavbar` - Staff navigation

### Shared Components
- `PaymentModal` - Payment processing
- `PaymentSuccess` - Order confirmation
- `ConnectionStatus` - Real-time connection indicator
- `LiveOrderUpdates` - Real-time order notifications

## Database Schema (Supabase)

### Tables
- `menu_items` - Food items with pricing, images, nutritional info
- `categories` - Menu categories
- `orders` - Order records with status tracking
- `order_items` - Individual items in orders
- `users` - User accounts (implicit via Supabase Auth)

## Real-time Features
- Live order status updates
- Connection status monitoring
- Order progress tracking
- Staff order notifications

## Android App
- TWA (Trusted Web Activity) wrapper
- Native Android launcher icons
- Splash screen
- Asset links for domain verification
- Gradle build configuration

## Design System
- Color palette: Orange (#FF6B35) primary, Gray neutrals
- Typography: Inter (sans), JetBrains Mono (mono)
- Responsive breakpoints
- Accessibility compliant (WCAG)
- Dark mode prepared (not active)
- Reduced motion support
