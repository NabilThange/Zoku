# CSS Refactoring Guide - Remove Inline Styles 🎨

## Overview

All components now have corresponding CSS classes in `app/globals.css`. This enables:
- ✅ Consistent theming across the app
- ✅ Easy theme switching (light/dark mode, color schemes)
- ✅ Better performance (no inline style recalculation)
- ✅ Centralized design system
- ✅ TweakCN live preview support

---

## CSS Classes Available

### Header & Navigation
```css
.zoku-header              /* Main header container */
.zoku-header-title        /* "ZOKU" title */
.zoku-header-subtitle     /* "Campus Eats" subtitle */
.zoku-toggle-btn          /* Student/Staff toggle button */
```

### Van Filters
```css
.van-filters-container    /* Container for van filters */
.van-filters-scroll       /* Scrollable van filter list */
.van-filter-pill          /* Individual van filter */
.van-filter-circle        /* Circular van icon */
.van-filter-label         /* Van name label */
.van-filter-pill.active   /* Active van filter state */
```

### Van Badges
```css
.van-badge                /* Base van badge */
.van-badge-veg            /* Veg Van badge (green) */
.van-badge-nonveg         /* Non-Veg Van badge (red) */
.van-badge-healthy        /* Healthy Van badge (purple) */
.van-badge-dessert        /* Dessert Van badge (yellow) */
.van-badge-icon           /* Icon inside badge */
```

### Menu Cards
```css
.menu-card                /* Card container */
.menu-card-image          /* Image section */
.menu-card-badge          /* Van badge on card */
.menu-card-veg-indicator  /* Veg/Non-veg indicator */
.menu-card-content        /* Card content area */
.menu-card-title          /* Item name */
.menu-card-meta           /* Rating & time */
.menu-card-footer         /* Price & add button */
.menu-card-price-main     /* Price amount */
.menu-card-add-btn        /* Add to cart button */
.menu-card-quantity       /* Quantity selector */
```

### Search
```css
.search-container         /* Search bar wrapper */
.search-input             /* Input field */
.search-icon              /* Search icon */
```

### Buttons
```css
.btn-primary              /* Primary button (orange) */
.btn-secondary            /* Secondary button (outline) */
.btn-outline              /* Outline button */
```

### Cart
```css
.cart-container           /* Cart wrapper */
.cart-item                /* Individual cart item */
.cart-item-image          /* Item image */
.cart-item-info           /* Item details */
.checkout-btn             /* Checkout button */
```

### Payment Success
```css
.payment-success-container /* Success page wrapper */
.success-header           /* Header section */
.success-icon             /* Success checkmark icon */
.token-card               /* Token display card */
.token-number             /* Large token number */
.token-truck-info         /* Truck info section */
```

---

## Refactoring Examples

### Before (Inline Styles)
```tsx
<div style={{ backgroundColor: "#FF6B35", color: "white", padding: "1rem" }}>
  <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>ZOKU</h1>
</div>
```

### After (CSS Classes)
```tsx
<div className="zoku-header">
  <h1 className="zoku-header-title">ZOKU</h1>
</div>
```

---

## Component Refactoring Checklist

### app/app/page.tsx
- [ ] Replace header inline styles with `.zoku-header`, `.zoku-header-title`, `.zoku-toggle-btn`
- [ ] Replace van filter styles with `.van-filters-container`, `.van-filter-pill`, `.van-filter-circle`
- [ ] Replace section titles with `.section-title`
- [ ] Replace greeting with `.greeting-text`

### components/student/menu-item-card.tsx
- [ ] Replace card styles with `.menu-card`
- [ ] Replace image styles with `.menu-card-image`
- [ ] Replace van badge styles with `.van-badge`, `.van-badge-veg`, etc.
- [ ] Replace veg indicator with `.menu-card-veg-indicator`
- [ ] Replace content styles with `.menu-card-content`
- [ ] Replace price styles with `.menu-card-price-main`, `.menu-card-price-original`
- [ ] Replace button styles with `.menu-card-add-btn`
- [ ] Replace quantity selector with `.menu-card-quantity`

### components/student/cart-summary.tsx
- [ ] Replace cart container with `.cart-container`
- [ ] Replace cart items with `.cart-item`, `.cart-item-image`, `.cart-item-info`
- [ ] Replace checkout button with `.checkout-btn`
- [ ] Replace empty state with `.cart-empty`, `.cart-empty-icon`

### components/payment/payment-success.tsx
- [ ] Replace container with `.payment-success-container`
- [ ] Replace header with `.success-header`, `.success-icon`, `.success-title`
- [ ] Replace token card with `.token-card`, `.token-number`, `.token-label`
- [ ] Replace truck info with `.token-truck-info`, `.token-truck-name`

### components/student/todays-trucks.tsx
- [ ] Replace truck card styles with appropriate classes
- [ ] Replace truck info display styles

### components/student/weekly-schedule.tsx
- [ ] Replace schedule card styles
- [ ] Replace day display styles

---

## Step-by-Step Refactoring Process

### Step 1: Identify Inline Styles
```tsx
// Find all style={{ ... }} patterns
const element = <div style={{ color: "red", fontSize: "1rem" }}>Text</div>
```

### Step 2: Map to CSS Classes
```
color: "red" → .text-primary (or specific color class)
fontSize: "1rem" → .text-base (or specific size class)
padding: "1rem" → .p-4 (Tailwind) or custom class
```

### Step 3: Replace with className
```tsx
// Before
<div style={{ color: "#FF6B35", fontSize: "1.5rem", fontWeight: 700 }}>
  ZOKU
</div>

// After
<div className="zoku-header-title">
  ZOKU
</div>
```

### Step 4: Test Visually
- Run `npm run dev`
- Check that styling looks identical
- Test hover states
- Test responsive behavior

---

## Color Reference

### Primary Colors
```css
Primary Orange: #FF6B35
Primary Hover: #E55A2B
Primary Light: #FFF7ED

Success Green: #10B981
Error Red: #EF4444
Warning Yellow: #F59E0B
Info Purple: #8B5CF6
```

### Neutral Colors
```css
Text Primary: #111827
Text Secondary: #4B5563
Text Muted: #9CA3AF
Background: #FEFEFE
Background Soft: #FAF8F5
Border: #E5E7EB
```

---

## Van Badge Color Mapping

```typescript
// Use these classes for van badges
"Veg Van" → .van-badge-veg (green)
"Non-Veg Van" → .van-badge-nonveg (red)
"Healthy Van" → .van-badge-healthy (purple)
"Dessert Van" → .van-badge-dessert (yellow)
```

---

## Common Patterns

### Conditional Classes
```tsx
// Before
<div style={{ color: item.isVeg ? "#10B981" : "#EF4444" }}>
  {item.name}
</div>

// After
<div className={item.isVeg ? "text-green-600" : "text-red-600"}>
  {item.name}
</div>
```

### Hover States
```tsx
// Before
<button
  style={{ backgroundColor: "#FF6B35" }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#E55A2B"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#FF6B35"}
>
  Click me
</button>

// After
<button className="btn-primary">
  Click me
</button>
```

### Responsive Styles
```tsx
// Before
<div style={{ 
  fontSize: window.innerWidth < 768 ? "1rem" : "1.5rem",
  padding: window.innerWidth < 768 ? "0.5rem" : "1rem"
}}>
  Content
</div>

// After
<div className="text-base md:text-xl p-2 md:p-4">
  Content
</div>
```

---

## Benefits of CSS Classes

### 1. Consistent Theming
```css
/* Change primary color globally */
:root {
  --color-primary: #FF6B35; /* Change this once */
}

/* All components using .btn-primary automatically update */
```

### 2. Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  .btn-primary {
    background-color: #FF8C5A;
  }
}
```

### 3. Better Performance
- No inline style recalculation on every render
- CSS is cached by browser
- Smaller component bundle size

### 4. TweakCN Live Preview
- Can modify CSS in real-time
- See changes instantly
- No need to restart dev server

---

## Testing After Refactoring

### Visual Testing
- [ ] All colors match original
- [ ] All spacing matches original
- [ ] All fonts match original
- [ ] Hover states work
- [ ] Active states work

### Responsive Testing
- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1440px)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Quick Reference: CSS Class Naming

### Naming Convention
```
.component-name           /* Main component */
.component-name-section   /* Section within component */
.component-name-element   /* Specific element */
.component-name.state     /* State modifier (e.g., .active) */
```

### Examples
```css
.menu-card                /* Main card */
.menu-card-image          /* Image section */
.menu-card-title          /* Title element */
.menu-card.active         /* Active state */

.van-badge                /* Main badge */
.van-badge-veg            /* Veg variant */
.van-badge-icon           /* Icon element */
```

---

## Troubleshooting

### Styles Not Applying
1. Check class name spelling
2. Verify class exists in globals.css
3. Check CSS specificity (inline styles override classes)
4. Clear browser cache

### Colors Look Different
1. Check color values in globals.css
2. Verify no conflicting Tailwind classes
3. Check for media queries affecting colors
4. Test in different browsers

### Responsive Issues
1. Check media queries in globals.css
2. Verify Tailwind breakpoints
3. Test with browser dev tools
4. Check for conflicting styles

---

## Next Steps

1. **Start with app/app/page.tsx** - Main app file with most inline styles
2. **Move to components/student/menu-item-card.tsx** - Complex card component
3. **Continue with other components** - Cart, payment, etc.
4. **Test thoroughly** - Visual, responsive, browser testing
5. **Deploy** - Push changes to production

---

## Resources

- CSS Classes: `app/globals.css`
- Component Files: `components/` directory
- Tailwind Docs: https://tailwindcss.com
- TweakCN: https://tweakcn.com

---

**Status**: CSS classes ready! Start refactoring components to use them. 🎨✨
