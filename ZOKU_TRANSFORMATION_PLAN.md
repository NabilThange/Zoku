# Zoku Transformation Plan 🚚

## From Cantio → Zoku

### Current State (Cantio)
Single college canteen ordering app with:
- One menu for one location
- Two user types: Students & Staff
- Static menu management
- Basic order tracking

### Target State (Zoku)
Multi-truck campus aggregator with:
- Multiple truck menus per campus
- Three user types: Students, Truck Staff, Super Admin
- Dynamic truck scheduling & locations
- Advanced logistics & revenue tracking

---

## Architecture Changes Required

### 1. Database Schema Updates

#### New Tables Needed

```sql
-- Trucks/Vendors
trucks (
  id, name, logo, cuisine_type, 
  owner_name, owner_phone, owner_email,
  license_number, hygiene_rating,
  commission_rate, status (active/inactive),
  created_at, updated_at
)

-- College/Campus Management
colleges (
  id, name, location, 
  parking_spots[], contact_person,
  contract_start_date, contract_end_date,
  created_at
)

-- Truck Schedule (Weekly rotation)
truck_schedules (
  id, truck_id, college_id, 
  parking_spot, day_of_week,
  start_time, end_time,
  is_active, created_at
)

-- Daily Truck Presence (actual check-in)
truck_presence (
  id, truck_id, college_id,
  date, parking_spot,
  checked_in_at, checked_out_at,
  status (scheduled/active/completed)
)

-- Truck Staff (separate from super admin)
truck_staff (
  id, truck_id, user_id,
  role (owner/manager/staff),
  created_at
)

-- Loyalty & Ratings
student_loyalty (
  id, student_id, points_balance,
  total_orders, total_spent
)

ratings_reviews (
  id, order_id, student_id, truck_id,
  rating (1-5), review_text, 
  food_quality, service_speed,
  created_at
)
```

#### Modified Tables

```sql
-- menu_items: Add truck_id
ALTER TABLE menu_items ADD COLUMN truck_id UUID REFERENCES trucks(id);
ALTER TABLE menu_items ADD COLUMN is_sold_out BOOLEAN DEFAULT false;

-- orders: Add truck_id and location
ALTER TABLE orders ADD COLUMN truck_id UUID REFERENCES trucks(id);
ALTER TABLE orders ADD COLUMN college_id UUID REFERENCES colleges(id);
ALTER TABLE orders ADD COLUMN parking_spot TEXT;

-- users: Add role differentiation
ALTER TABLE users ADD COLUMN role TEXT CHECK (role IN ('student', 'truck_staff', 'super_admin'));
ALTER TABLE users ADD COLUMN college_id UUID REFERENCES colleges(id);
```

---

## 2. User Interface Changes

### Student App Updates

#### New Pages/Features

**Home/Dashboard (`/app`)**
- "Today's Trucks" section showing active trucks on campus
- Truck cards with: logo, name, cuisine type, location, ETA
- Weekly schedule view (calendar showing which trucks come when)
- Filter by cuisine type, veg/non-veg, ratings

**Truck Detail Page (`/app/truck/[id]`)**
- Truck info (name, cuisine, ratings, location)
- Today's menu (filtered by this truck)
- Operating hours
- Queue status (live order count)
- Reviews & ratings

**Schedule Page (`/app/schedule`)**
- Weekly calendar view
- Shows which trucks are coming on which days
- Set reminders for favorite trucks
- Push notification opt-in

**Loyalty Page (`/app/loyalty`)**
- Points balance
- Rewards catalog
- Order history with points earned
- Referral program

**Modifications to Existing**
- Menu page: Add truck filter dropdown
- Cart: Show which truck items are from
- Orders: Show truck name and parking location
- Profile: Add favorite trucks, dietary preferences

---

### Truck Staff App (New)

**Login (`/truck-staff/login`)**
- Truck-specific login (staff can only see their truck's data)
- Role-based access (owner sees revenue, staff sees orders only)

**Dashboard (`/truck-staff/dashboard`)**
- Today's location & schedule
- Active orders count
- Today's revenue
- Quick stats (orders completed, avg prep time)

**Orders (`/truck-staff/orders`)**
- Same as current staff order management
- But filtered to their truck only
- Add "Mark Sold Out" for menu items

**Menu Management (`/truck-staff/menu`)**
- Manage their truck's menu only
- Toggle availability in real-time
- Mark items as sold out for today
- Update prices (with super admin approval)

**Daily Summary (`/truck-staff/summary`)**
- Today's sales report
- Items sold count
- Revenue breakdown
- Download report as PDF

---

### Super Admin Panel (New)

**Dashboard (`/admin/dashboard`)**
- Overview: Total trucks, colleges, today's orders
- Revenue charts (total, per truck, per college)
- Active trucks map view
- Alerts (hygiene issues, low ratings, disputes)

**Truck Management (`/admin/trucks`)**
- List all trucks with status
- Add new truck (onboarding form)
- Edit truck details
- View truck performance metrics
- Suspend/activate trucks
- Commission rate management

**College Management (`/admin/colleges`)**
- List all partner colleges
- Add new college
- Manage parking spots
- Contract details
- Contact persons

**Schedule Management (`/admin/schedule`)**
- Weekly schedule builder (drag-drop interface)
- Assign trucks to colleges & parking spots
- Set operating hours
- Handle schedule conflicts
- Publish schedule (sends notifications)

**Revenue & Reports (`/admin/reports`)**
- Revenue dashboard (filters: date, truck, college)
- Commission tracking
- Settlement reports (per truck)
- Popular items across trucks
- Student behavior analytics
- Export reports (CSV, PDF)

**Compliance (`/admin/compliance`)**
- Hygiene ratings tracker
- License expiry alerts
- Incident reports
- Quality complaints

---

## 3. Technical Implementation Plan

### Phase 1: Database & Auth (Week 1-2)
- [ ] Create new Supabase tables
- [ ] Modify existing tables
- [ ] Set up Row Level Security (RLS) policies
- [ ] Implement role-based authentication
- [ ] Create truck staff user management

### Phase 2: Student App Updates (Week 3-4)
- [ ] Build "Today's Trucks" home page
- [ ] Add truck filtering to menu
- [ ] Create truck detail pages
- [ ] Implement weekly schedule view
- [ ] Add loyalty points system
- [ ] Build ratings & reviews

### Phase 3: Truck Staff App (Week 5-6)
- [ ] Create truck staff login flow
- [ ] Build truck staff dashboard
- [ ] Implement truck-specific order management
- [ ] Add "sold out" functionality
- [ ] Create daily summary reports

### Phase 4: Super Admin Panel (Week 7-9)
- [ ] Build admin authentication
- [ ] Create truck management CRUD
- [ ] Build college management
- [ ] Implement schedule builder
- [ ] Create revenue dashboard
- [ ] Build reports & analytics

### Phase 5: Real-time & Notifications (Week 10)
- [ ] Push notifications (truck arrival, order ready)
- [ ] Real-time truck location updates
- [ ] Live queue tracking
- [ ] WebSocket connections for order updates

### Phase 6: Testing & Polish (Week 11-12)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Security audit
- [ ] Beta testing with one college

---

## 4. Key Features Breakdown

### Must-Have (MVP)
✅ Multiple trucks support
✅ Truck-specific menus
✅ Daily truck schedule
✅ Truck staff login (separate from admin)
✅ Super admin panel (basic)
✅ Student can see today's trucks
✅ Order tracking per truck
✅ Basic revenue reports

### Should-Have (V1.1)
⭐ Weekly schedule management
⭐ Push notifications
⭐ Loyalty points
⭐ Ratings & reviews
⭐ Sold-out item management
⭐ Advanced analytics

### Nice-to-Have (V2.0)
💡 Live truck GPS tracking
💡 Queue time predictions
💡 Pre-order for next day
💡 Subscription plans (meal plans)
💡 Truck owner mobile app
💡 AI-based demand forecasting

---

## 5. API Endpoints Needed

### Student APIs
```
GET  /api/trucks/today?college_id=xxx
GET  /api/trucks/:id
GET  /api/trucks/:id/menu
GET  /api/schedule/weekly?college_id=xxx
POST /api/orders (with truck_id)
POST /api/ratings
GET  /api/loyalty/points
```

### Truck Staff APIs
```
POST /api/truck-staff/login
GET  /api/truck-staff/orders?truck_id=xxx
PATCH /api/truck-staff/orders/:id/status
PATCH /api/menu-items/:id/sold-out
GET  /api/truck-staff/summary?date=xxx
```

### Super Admin APIs
```
GET  /api/admin/trucks
POST /api/admin/trucks
PATCH /api/admin/trucks/:id
GET  /api/admin/colleges
POST /api/admin/colleges
GET  /api/admin/schedule
POST /api/admin/schedule
GET  /api/admin/revenue?filters=xxx
GET  /api/admin/reports/export
```

---

## 6. Migration Strategy

### Data Migration
1. Keep existing `menu_items` table
2. Create a default "Main Canteen" truck
3. Assign all existing items to this truck
4. Existing students continue using app normally
5. Gradually onboard new trucks

### User Migration
1. Existing staff → Convert to truck staff for "Main Canteen"
2. Create super admin account
3. New truck staff register separately

### Rollout Plan
1. **Week 1-2**: Backend changes (no user impact)
2. **Week 3-4**: Student app updates (backward compatible)
3. **Week 5-6**: Truck staff app (parallel to existing)
4. **Week 7-9**: Super admin panel (internal only)
5. **Week 10**: Soft launch with 2-3 trucks
6. **Week 11-12**: Full launch

---

## 7. Business Logic Changes

### Commission Calculation
```javascript
// Per order commission
const commission = orderTotal * truck.commissionRate / 100;

// Settlement calculation (weekly)
const truckRevenue = totalOrders - totalCommission;
```

### Truck Availability Logic
```javascript
// Check if truck is available today
const isTruckAvailable = (truckId, collegeId, date) => {
  const schedule = getTruckSchedule(truckId, collegeId, date.dayOfWeek);
  const presence = getTruckPresence(truckId, collegeId, date);
  
  return schedule.exists && presence.status === 'active';
}
```

### Order Assignment
```javascript
// Orders must be assigned to active trucks only
const validateOrder = (truckId, collegeId) => {
  const truck = getTruckPresence(truckId, collegeId, today);
  if (!truck || truck.status !== 'active') {
    throw new Error('Truck not available');
  }
}
```

---

## 8. UI/UX Considerations

### Student Experience
- Clear indication of which truck each item belongs to
- Easy switching between truck menus
- Visual schedule (calendar/timeline)
- Truck location on campus map
- ETA for truck arrival

### Truck Staff Experience
- Simple, fast order management
- One-tap "mark sold out"
- Clear daily targets/goals
- Easy end-of-day reporting

### Super Admin Experience
- Dashboard with key metrics at a glance
- Drag-drop schedule builder
- Quick truck performance comparison
- Automated alerts for issues

---

## 9. Security & Permissions

### Role-Based Access Control (RBAC)

```typescript
// Student: Can only see their own orders
// Truck Staff: Can only see their truck's orders & menu
// Super Admin: Can see everything

const permissions = {
  student: ['view_trucks', 'place_order', 'view_own_orders'],
  truck_staff: ['view_truck_orders', 'manage_truck_menu', 'update_order_status'],
  super_admin: ['manage_trucks', 'manage_colleges', 'view_all_orders', 'view_revenue']
}
```

### Data Isolation
- Truck staff can NEVER see other trucks' data
- Students can only see active trucks on their campus
- Super admin has god-mode access

---

## 10. Success Metrics

### For Students
- Average order time < 3 minutes
- Token pickup time < 5 minutes
- App rating > 4.5 stars
- Repeat order rate > 60%

### For Trucks
- Daily order volume > 50 orders/truck
- Average order value > ₹80
- Customer rating > 4.0
- Sold-out rate < 20%

### For Platform (Zoku)
- Commission revenue growth 20% MoM
- Truck retention rate > 80%
- College partnerships > 10 in 6 months
- Student MAU > 5000

---

## Next Steps

1. **Review this plan** with the team
2. **Prioritize features** (MVP vs V1.1 vs V2.0)
3. **Set up project board** (GitHub/Jira)
4. **Start with Phase 1** (Database & Auth)
5. **Weekly demos** to track progress

---

> **Remember**: We're not rebuilding from scratch. We're extending Cantio's solid foundation to support multiple trucks. Most of the order flow, payment, and UI components can be reused. 🚀
