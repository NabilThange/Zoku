# Zoku Quick Start Guide 🚀

## What Just Happened?

Your Cantio app is now **Zoku**! Here's what changed:

### ✅ Done (No Code Changes Needed)
1. **Branding**: App is now called Zoku everywhere
2. **Menu Cards**: Show truck badges (🚚 Truck A) and bestseller tags (🔥)
3. **Payment Success**: Shows truck location instead of canteen
4. **New Components**: Today's Trucks & Weekly Schedule ready to use

### 🔧 Ready to Integrate (Copy-Paste)
Two new components are built and waiting:
- `TodaysTrucks` - Shows active trucks on campus
- `WeeklySchedule` - Shows weekly truck rotation

---

## Test It Right Now

### 1. See the Rebranding
```bash
npm run dev
```
Visit `http://localhost:3000` and you'll see:
- Landing page says "Your Campus. Your Cravings."
- App header says "ZOKU" with "Campus Eats"
- Everything else works exactly the same

### 2. See Truck Badges on Menu Items
Go to `/app` and browse menu. Each item now has space for:
- 🚚 Truck badge (top-left)
- 🟢/🔴 Veg indicator (top-right)
- 🔥 Bestseller tag (bottom-left)
- Available/Sold Out (bottom-right)

*Note: Truck badges won't show yet because menu items don't have `truckName` field. That's Phase 2.*

---

## Add Mock Data (5 Minutes)

Want to see it working with fake data? Here's how:

### Step 1: Add Mock Trucks to Student App

Open `app/app/page.tsx` and add this after the imports:

```typescript
// Mock truck data - TEMPORARY for testing
const MOCK_TRUCKS = [
  {
    id: 1,
    name: "Desi Delights",
    logo: "🍛",
    cuisineType: "North Indian",
    location: "Main Campus",
    parkingSpot: "Gate 2 Parking",
    openTime: "11:00 AM",
    closeTime: "3:00 PM",
    isOpen: true,
    queueLength: 8,
    rating: 4.5,
    distance: "50m",
    specialToday: "Butter Chicken Combo ₹180"
  },
  {
    id: 2,
    name: "Healthy Bites",
    logo: "🥗",
    cuisineType: "Healthy Bowls",
    location: "Main Campus",
    parkingSpot: "Main Gate",
    openTime: "10:00 AM",
    closeTime: "2:00 PM",
    isOpen: true,
    queueLength: 3,
    rating: 4.7,
    distance: "100m",
    specialToday: "Quinoa Bowl ₹120"
  }
]
```

### Step 2: Import TodaysTrucks Component

```typescript
import { TodaysTrucks } from "@/components/student/todays-trucks"
```

### Step 3: Add to Menu Tab

Find the line that says `{activeTab === "menu" && (` and add TodaysTrucks:

```typescript
{activeTab === "menu" && (
  <div className="space-y-6">
    {/* NEW: Today's Trucks Section */}
    <TodaysTrucks 
      trucks={MOCK_TRUCKS}
      onTruckClick={(truckId) => {
        console.log("Clicked truck:", truckId)
        // TODO: Filter menu by truck
      }}
    />

    {/* Existing greeting section */}
    <div style={{ textAlign: "left" }}>
      <h2 className="font-bold mb-2" style={{ color: "#2D3748", fontSize: "22px" }}>
        What are you feeling, Nabil?
      </h2>
    </div>

    {/* Rest of existing code... */}
```

### Step 4: Refresh Browser

You should now see "Today's Trucks on Campus 🚚" section at the top!

---

## Add Truck Names to Menu Items (Optional)

Want to see truck badges on menu cards? Update your mock menu data:

```typescript
// In data/mock-menu-items.ts or wherever your menu items are

const menuItems = [
  {
    id: 1,
    name: "Butter Chicken",
    price: 280,
    // ... other fields
    truckName: "Desi Delights", // ADD THIS
    truckId: 1, // ADD THIS
    isBestseller: true // ADD THIS for bestseller badge
  },
  // ... more items
]
```

Now menu cards will show:
- 🚚 Desi Delights (top-left)
- 🔥 Bestseller (bottom-left if isBestseller: true)

---

## Add Weekly Schedule Tab (Optional)

### Step 1: Add Mock Schedule Data

```typescript
const MOCK_SCHEDULE = [
  {
    day: "Monday",
    dayShort: "MON",
    date: "Dec 16",
    isToday: true,
    trucks: [
      { id: 1, name: "Desi Delights", cuisineType: "North Indian", logo: "🍛" },
      { id: 2, name: "Healthy Bites", cuisineType: "Healthy Bowls", logo: "🥗" }
    ]
  },
  {
    day: "Tuesday",
    dayShort: "TUE",
    date: "Dec 17",
    isToday: false,
    trucks: [
      { id: 1, name: "Desi Delights", cuisineType: "North Indian", logo: "🍛" }
    ]
  },
  // Add more days...
]
```

### Step 2: Import Component

```typescript
import { WeeklySchedule } from "@/components/student/weekly-schedule"
```

### Step 3: Add Schedule Tab Content

Find where you have `{activeTab === "orders" && (` and add before it:

```typescript
{activeTab === "schedule" && (
  <div className="space-y-4">
    <WeeklySchedule 
      schedule={MOCK_SCHEDULE}
      onTruckClick={(truckId) => {
        setActiveTab("menu")
        console.log("View truck menu:", truckId)
      }}
    />
  </div>
)}
```

### Step 4: Add Schedule to Navbar

Find `StudentNavbar` component and add schedule tab:

```typescript
// In components/navigation/student-navbar.tsx
// Add Calendar icon import
import { Calendar } from "lucide-react"

// Add to tabs array
const tabs = [
  { id: "menu", label: "Menu", icon: Utensils },
  { id: "schedule", label: "Schedule", icon: Calendar }, // NEW
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "orders", label: "Orders", icon: Package },
  { id: "profile", label: "Profile", icon: User }
]
```

---

## What You'll See

### Home Page (/)
- "Your Campus. Your Cravings." hero
- Same video and animations
- "Start Ordering" button

### Student App (/app)
- **Header**: "ZOKU" with "Campus Eats"
- **Today's Trucks**: Cards showing active trucks (if you added mock data)
- **Menu**: Items with truck badges (if you added truckName to items)
- **Schedule Tab**: Weekly calendar (if you added it)
- **Cart**: Same as before
- **Orders**: Same as before
- **Profile**: Same as before

### Payment Success
- Shows "🚚 Truck Name" instead of "Main Canteen"
- Shows "Gate 2 Parking" location
- Everything else same

---

## Common Issues

### "TodaysTrucks is not defined"
- Make sure you imported: `import { TodaysTrucks } from "@/components/student/todays-trucks"`

### "Truck badges not showing"
- Menu items need `truckName` and `truckId` fields
- Add them to your mock data or database

### "Schedule tab not appearing"
- Make sure you added it to StudentNavbar tabs array
- Check activeTab state includes "schedule"

### "TypeScript errors"
- Run `npm run build` to check for type errors
- Make sure MenuItem interface includes truckName and truckId (already done)

---

## Next Steps

### Immediate (This Week)
1. ✅ Test with mock data
2. ✅ Show to team/stakeholders
3. ✅ Get feedback on UI/UX
4. ⏳ Decide on truck filtering approach

### Short Term (Next 2 Weeks)
1. Create trucks table in database
2. Add truck management for super admin
3. Connect Today's Trucks to real data
4. Add truck filtering to menu

### Medium Term (Next Month)
1. Build super admin panel
2. Add truck staff login
3. Implement schedule management
4. Add loyalty points system

---

## Files You Might Edit

### To Add Mock Data
- `app/app/page.tsx` - Add MOCK_TRUCKS constant

### To Add Truck Info to Menu Items
- `data/mock-menu-items.ts` - Add truckName, truckId fields
- Or your database seed file

### To Customize Truck Cards
- `components/student/todays-trucks.tsx` - Edit styling, layout

### To Customize Schedule
- `components/student/weekly-schedule.tsx` - Edit calendar view

---

## Getting Help

### Check These Files
1. `ZOKU_TRANSFORMATION_PLAN.md` - Full roadmap
2. `ZOKU_PHASE1_COMPLETE.md` - What's done, what's next
3. `about_cantio.md` - Original app documentation

### Common Questions

**Q: Can I still use it as a single canteen app?**
A: Yes! Just don't add truck data. It works exactly like before.

**Q: Do I need to change the database now?**
A: No. Phase 1 is UI only. Database changes come in Phase 2.

**Q: Will existing orders break?**
A: No. Everything is backward compatible.

**Q: Can I customize truck badges?**
A: Yes! Edit `components/student/menu-item-card.tsx`

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# Run tests (if you have them)
npm test
```

---

## Success Checklist

After following this guide, you should have:
- [x] App branded as Zoku
- [x] Landing page updated
- [x] Menu cards ready for truck badges
- [x] Payment success shows truck location
- [x] (Optional) Today's Trucks section visible
- [x] (Optional) Weekly Schedule tab working
- [x] All existing features still working

---

**You're ready to demo Zoku! 🚚🔥**

Show it to your team, get feedback, then move to Phase 2 (backend + database).
