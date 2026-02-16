# 🚚 Zoku - Campus Food Truck Aggregator

> **Your Campus. Your Cravings.**

Zoku connects multiple rotating food trucks with college students. Pre-order, skip queues, and grab fresh food from your favorite trucks.

---

## 🎯 What is Zoku?

**Simple Analogy:**
> Uber doesn't own cars. Zomato doesn't own restaurants. **Zoku doesn't own trucks.** We just connect them.

### The Problem
- Students waste time in long canteen queues
- Limited food variety on campus
- Food trucks struggle to find customers
- Colleges want organized food services

### The Solution
- **Students**: Browse multiple truck menus, pre-order, pay online, collect via token
- **Trucks**: Get guaranteed customers, manage orders digitally, track revenue
- **Colleges**: Organized food service, scheduled trucks, hygiene tracking
- **Zoku**: Earn commission on every order

---

## 🚀 Current Status

### ✅ Phase 1 Complete (Rebranding + UI)
- App rebranded from Cantio to Zoku
- Truck badges on menu items
- Bestseller tags
- Today's Trucks component
- Weekly Schedule component
- Payment success with truck location
- All existing features working

### 🔄 Phase 2 In Progress (Multi-Truck Support)
- Database schema for trucks
- Truck management (super admin)
- Schedule management
- Truck staff login
- Menu filtering by truck

### 📋 Phase 3 Planned (Advanced Features)
- Loyalty points system
- Ratings & reviews
- Push notifications
- Live queue tracking
- Revenue analytics

---

## 📱 User Flows

### Student Flow
```
1. Open app → See today's trucks
2. Browse truck menus → Add items to cart
3. Checkout → Pay online (UPI/Card/Wallet)
4. Get token number → Go to truck at break time
5. Show token → Collect food
6. Rate experience → Earn loyalty points
```

### Truck Staff Flow
```
1. Login to truck dashboard
2. See incoming orders
3. Mark orders: Preparing → Ready
4. Student shows token → Mark completed
5. View daily sales summary
```

### Super Admin Flow
```
1. Login to admin panel
2. Add/manage trucks
3. Set weekly schedule (which truck, which day, which parking spot)
4. View revenue & analytics
5. Track hygiene & compliance
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for images)
- **API**: Next.js API Routes

### Mobile
- **Android**: TWA (Trusted Web Activity)
- **iOS**: PWA (Progressive Web App)

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

---

## 📂 Project Structure

```
zoku/
├── app/                          # Next.js app directory
│   ├── app/                      # Main app (student + staff)
│   │   └── page.tsx             # Main app with toggle
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── onboarding/              # Onboarding flow
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                   # React components
│   ├── student/                 # Student-specific
│   │   ├── menu-item-card.tsx
│   │   ├── cart-summary.tsx
│   │   ├── todays-trucks.tsx   # NEW
│   │   └── weekly-schedule.tsx # NEW
│   ├── staff/                   # Staff-specific
│   │   ├── order-management.tsx
│   │   └── menu-management.tsx
│   ├── payment/                 # Payment flow
│   │   ├── payment-modal.tsx
│   │   └── payment-success.tsx
│   └── ui/                      # Reusable UI components
│
├── lib/                         # Utilities & helpers
│   ├── supabase/               # Supabase client & queries
│   ├── types/                  # TypeScript types
│   └── utils.ts                # Helper functions
│
├── public/                      # Static assets
│   ├── logo.png
│   └── images/
│
├── docs/                        # Documentation
│   ├── ZOKU_TRANSFORMATION_PLAN.md
│   ├── ZOKU_PHASE1_COMPLETE.md
│   ├── QUICK_START_ZOKU.md
│   └── about_cantio.md
│
└── package.json
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd zoku

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📖 Documentation

### For Developers
- **[Quick Start Guide](QUICK_START_ZOKU.md)** - Get up and running in 5 minutes
- **[Transformation Plan](ZOKU_TRANSFORMATION_PLAN.md)** - Full roadmap from Cantio to Zoku
- **[Phase 1 Complete](ZOKU_PHASE1_COMPLETE.md)** - What's done, what's next
- **[Original App Docs](about_cantio.md)** - Cantio documentation

### For Users
- Student Guide (Coming soon)
- Truck Staff Guide (Coming soon)
- Super Admin Guide (Coming soon)

---

## 🎨 Design System

### Colors
- **Primary**: Orange (#FF6B35)
- **Secondary**: Black (#2D3748)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Sans**: Inter
- **Mono**: JetBrains Mono

### Components
- Consistent 16px border radius
- 2px border width for emphasis
- Orange + black color scheme
- Veg/Non-veg indicators (Indian standard)

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Coverage
- [ ] Student order flow
- [ ] Staff order management
- [ ] Payment processing
- [ ] Real-time updates
- [ ] Mobile responsiveness

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Manual Deployment
```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📊 Roadmap

### Q1 2024
- [x] Phase 1: Rebranding + UI updates
- [ ] Phase 2: Multi-truck support
- [ ] Phase 3: Truck staff app
- [ ] Phase 4: Super admin panel

### Q2 2024
- [ ] Loyalty points system
- [ ] Ratings & reviews
- [ ] Push notifications
- [ ] Live queue tracking

### Q3 2024
- [ ] Advanced analytics
- [ ] Subscription meal plans
- [ ] Truck owner mobile app
- [ ] AI demand forecasting

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👥 Team

- **Product**: [Your Name]
- **Development**: [Your Name]
- **Design**: [Your Name]

---

## 📞 Support

- **Email**: support@zoku.app
- **Phone**: +91-XXXXX-XXXXX
- **Website**: https://zoku.app

---

## 🙏 Acknowledgments

- Built on top of Cantio (original canteen app)
- Inspired by Uber, Zomato, and campus food culture
- Thanks to all beta testers and early adopters

---

## 📈 Stats (Coming Soon)

- 🚚 Trucks onboarded: 0
- 🎓 Colleges partnered: 0
- 👨‍🎓 Active students: 0
- 🍔 Orders completed: 0
- 💰 Revenue generated: ₹0

---

**Made with ❤️ for hungry students everywhere** 🚚🔥
