# CSS Classes Quick Reference 🎨

## All Available Classes in globals.css

### Header
```
.zoku-header              Main header (orange background)
.zoku-header-title        "ZOKU" title text
.zoku-header-subtitle     "Campus Eats" subtitle
.zoku-toggle-btn          Student/Staff toggle button
```

### Van Filters
```
.van-filters-container    Container for all van filters
.van-filters-scroll       Scrollable filter list
.van-filter-pill          Individual van filter pill
.van-filter-circle        Circular van icon (3.5rem)
.van-filter-label         Van name text
.van-filter-pill.active   Active filter state
```

### Van Badges
```
.van-badge                Base badge styling
.van-badge-veg            Green badge (Veg Van)
.van-badge-nonveg         Red badge (Non-Veg Van)
.van-badge-healthy        Purple badge (Healthy Van)
.van-badge-dessert        Yellow badge (Dessert Van)
.van-badge-icon           Icon inside badge
```

### Menu Cards
```
.menu-card                Card container
.menu-card:hover          Hover state (shadow increase)
.menu-card-image          Image section (180px height)
.menu-card-image img      Image element (scales on hover)
.menu-card-badge          Van badge position (top-left)
.menu-card-veg-indicator  Veg/Non-veg indicator (top-right)
.menu-card-veg-indicator.veg      Green border
.menu-card-veg-indicator.nonveg   Red border
.menu-card-veg-dot        Dot inside indicator
.menu-card-content        Content area (padding 1rem)
.menu-card-title          Item name (2 lines max)
.menu-card-meta           Rating & time row
.menu-card-rating         Rating display
.menu-card-time           Prep time display
.menu-card-footer         Price & button row
.menu-card-price          Price container
.menu-card-price-main     Main price (1.25rem, bold)
.menu-card-price-original Original price (strikethrough)
.menu-card-calories       Calorie display
.menu-card-add-btn        Add to cart button
.menu-card-add-btn:hover  Button hover state
.menu-card-quantity       Quantity selector container
.menu-card-quantity-btn   +/- buttons
.menu-card-quantity-value Quantity number
```

### Search
```
.search-container         Search bar wrapper
.search-input             Input field
.search-input:focus       Focus state (orange ring)
.search-icon              Search icon (left side)
```

### Sections
```
.section-title            Section heading (1.25rem, bold)
.section-title-with-action Title with action button
.section-action-btn       "See All" type buttons
.greeting-text            "What are you feeling" text
```

### Cart
```
.cart-container           Cart wrapper (max-width 42rem)
.cart-empty               Empty state container
.cart-empty-icon          Empty state icon
.cart-empty-title         Empty state title
.cart-empty-text          Empty state text
.cart-item                Individual cart item
.cart-item:hover          Item hover state
.cart-item-image          Item image (3rem)
.cart-item-info           Item details
.cart-item-name           Item name
.cart-item-price          Item price
.cart-item-controls       Quantity controls
.cart-summary-row         Summary row (subtotal, fee)
.cart-summary-total       Total row (bold)
.cart-total-amount        Total amount (red)
.checkout-btn             Checkout button (red)
.checkout-btn:hover       Checkout hover state
```

### Payment Success
```
.payment-success-container Success page wrapper
.success-header           Header section
.success-icon             Green checkmark icon
.success-title            "Payment Successful" title
.success-subtitle         Subtitle text
.token-card               Token display card
.token-label              "Pickup Token" label
.token-number             Large token number (3rem)
.token-number:hover       Token hover (scale up)
.token-copy-btn           Copy button
.token-info               Time & location info
.token-location           Location display
.token-truck-info         Truck info section
.token-truck-name         Truck name
.token-truck-location     Parking spot
```

### Buttons
```
.btn-primary              Orange button
.btn-primary:hover        Darker orange on hover
.btn-secondary            White with orange border
.btn-secondary:hover      Light orange background
.btn-outline              Transparent with gray border
.btn-outline:hover        Light gray background
```

### Badges
```
.badge                    Base badge
.badge-success            Green badge
.badge-warning            Yellow badge
.badge-error              Red badge
.badge-info               Blue badge
```

### Utilities
```
.text-primary             Orange text (#FF6B35)
.text-secondary           Dark gray text (#4B5563)
.text-muted               Light gray text (#9CA3AF)
.bg-primary               Orange background
.bg-light                 Light gray background
.rounded-lg               1rem border radius
.rounded-xl               1.25rem border radius
.shadow-sm                Small shadow
.shadow-md                Medium shadow
.shadow-lg                Large shadow
.transition-all           Smooth transitions
.cursor-pointer           Pointer cursor
```

---

## Color Palette

### Primary
```
Orange:        #FF6B35
Orange Hover:  #E55A2B
Orange Light:  #FFF7ED
```

### Van Colors
```
Veg Van:       #10B981 (Green)
Non-Veg Van:   #EF4444 (Red)
Healthy Van:   #8B5CF6 (Purple)
Dessert Van:   #F59E0B (Yellow)
```

### Semantic
```
Success:       #10B981 (Green)
Error:         #EF4444 (Red)
Warning:       #F59E0B (Yellow)
Info:          #8B5CF6 (Purple)
```

### Neutral
```
Text Primary:  #111827 (Dark)
Text Secondary:#4B5563 (Gray)
Text Muted:    #9CA3AF (Light Gray)
Background:    #FEFEFE (White)
Background Soft:#FAF8F5 (Cream)
Border:        #E5E7EB (Light Gray)
```

---

## Common Combinations

### Menu Card
```html
<div class="menu-card">
  <div class="menu-card-image">
    <img src="..." />
    <div class="menu-card-badge">
      <span class="van-badge van-badge-veg">🥗 Veg Van</span>
    </div>
    <div class="menu-card-veg-indicator veg">
      <div class="menu-card-veg-dot veg"></div>
    </div>
  </div>
  <div class="menu-card-content">
    <h3 class="menu-card-title">Item Name</h3>
    <div class="menu-card-meta">
      <div class="menu-card-rating">⭐ 4.5</div>
      <div class="menu-card-time">⏱️ 20m</div>
    </div>
    <div class="menu-card-footer">
      <div class="menu-card-price">
        <span class="menu-card-price-main">₹120</span>
      </div>
      <button class="menu-card-add-btn">ADD</button>
    </div>
  </div>
</div>
```

### Van Filter
```html
<div class="van-filters-container">
  <div class="van-filters-scroll">
    <div class="van-filter-pill active" style="color: #10B981">
      <div class="van-filter-circle">🥗</div>
      <span class="van-filter-label">Veg Van</span>
    </div>
  </div>
</div>
```

### Button
```html
<button class="btn-primary">Click Me</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-outline">Outline</button>
```

### Badge
```html
<span class="van-badge van-badge-veg">🥗 Veg Van</span>
<span class="badge badge-success">Available</span>
<span class="badge badge-error">Sold Out</span>
```

---

## Responsive Breakpoints

Use Tailwind breakpoints with classes:
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

Example:
```html
<div class="text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

---

## How to Use

### 1. Replace Inline Styles
```tsx
// Before
<div style={{ backgroundColor: "#FF6B35", color: "white" }}>
  Header
</div>

// After
<div className="zoku-header">
  Header
</div>
```

### 2. Combine Classes
```tsx
<button className="btn-primary shadow-lg transition-all">
  Click Me
</button>
```

### 3. Conditional Classes
```tsx
<div className={item.isVeg ? "text-green-600" : "text-red-600"}>
  {item.name}
</div>
```

### 4. Use with Tailwind
```tsx
<div className="p-4 md:p-6 rounded-lg shadow-md">
  Content
</div>
```

---

## Tips

1. **Always use classes** - Never use inline styles
2. **Check globals.css** - Before creating new styles
3. **Use color variables** - For consistency
4. **Test responsive** - On mobile, tablet, desktop
5. **Use TweakCN** - To preview changes in real-time

---

## File Location

All CSS classes are defined in:
```
app/globals.css
```

---

**Ready to refactor! Start with app/app/page.tsx** 🚀
