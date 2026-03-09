# Spacing & Layout Guide

**Version**: 1.0  
**Last Updated**: March 9, 2026  
**Status**: Production Ready ✅

---

## Table of Contents

1. [Spacing System](#spacing-system)
2. [Page Layout](#page-layout)
3. [Component Spacing](#component-spacing)
4. [Grid Patterns](#grid-patterns)
5. [Common Layouts](#common-layouts)
6. [Responsive Spacing](#responsive-spacing)

---

## Spacing System

**Base Unit**: 4px  
**Scale**: Multiples of 4px for visual harmony

### Token Reference

```
xs    = 4px   (1 unit)
sm    = 8px   (2 units)
base  = 12px  (3 units)
md    = 16px  (4 units) ← Most common
lg    = 24px  (6 units) ← Section spacing
xl    = 32px  (8 units)
2lg   = 40px  (10 units)
2xl   = 48px  (12 units)
3xl   = 64px  (16 units)
```

### Usage Pattern

| Space | Tailwind Class | Use Case |
|-------|---|---|
| 4px | `px-xs`, `py-xs`, `gap-xs` | Micro spacing |
| 8px | `px-sm`, `py-sm`, `gap-sm` | Tight spacing |
| 12px | `px-base`, `py-base`, `gap-base` | Internal spacing |
| 16px | `p-md`, `gap-md` | Standard spacing (default) |
| 24px | `p-lg` | Generous spacing, sections |
| 32px | `p-xl` | Large spacing |
| 64px | `p-3xl` | Maximum spacing |

---

## Page Layout

### Overall Page Structure

```
┌─────────────────────────────────────────┐
│         Header (DashboardLayout)         │
│  Breadcrumb / Title / Actions            │
└─────────────────────────────────────────┘
         ↓ gap-lg (24px)
┌─────────────────────────────────────────┐
│  Page Content                            │
│  • Sections with gap-lg between them     │
│  • Cards with p-lg padding               │
└─────────────────────────────────────────┘
```

### Page Padding

```tsx
// Mobile: 1rem (md), Tablet+: 1.5rem (lg)
<main className="p-md lg:p-lg">
  {/* Page content with responsive padding */}
</main>
```

**Spacing Values**:
- Mobile: 16px (p-md)
- Tablet: 16px (p-md)
- Desktop: 24px (p-lg)

---

## Component Spacing

### Button Spacing

**Interior Padding**:
```tsx
<button className="px-md py-sm">Button</button>
```

| Size | Padding | Height | Use |
|------|---------|--------|-----|
| Small | px-sm py-xs | 32px | Secondary actions |
| Medium | px-md py-sm | 40px | Primary actions (default) |
| Large | px-lg py-md | 48px | Hero actions |

**Spacing Between Buttons**:
```tsx
<div className="flex gap-md">
  <button className="btn btn-secondary">Cancel</button>
  <button className="btn btn-primary">Submit</button>
</div>
```

Use `gap-md` (16px) for button groups.

---

### Card Spacing

#### Standard Card
```tsx
<div className="bg-white rounded-lg p-lg shadow-md">
  {/* Standard padding: 24px */}
</div>
```

**Interior Spacing**:
```tsx
<div className="bg-white rounded-lg p-lg shadow-md space-y-lg">
  {/* Title */}
  <h2 className="text-h2">Card Title</h2>
  
  {/* Divider */}
  <hr className="border-neutral-200" />
  
  {/* Content */}
  <p className="text-body">Content here</p>
</div>
```

Use `space-y-lg` (24px between children).

#### Compact Card
```tsx
<div className="bg-white rounded-lg p-md shadow-sm">
  {/* Tighter padding: 16px */}
</div>
```

---

### Form Spacing

#### Form Group
```tsx
<div className="space-y-base">
  {/* 12px between label and input */}
  <label className="text-label">Email</label>
  <input type="email" className="w-full p-sm rounded-md" />
</div>
```

#### Form Section
```tsx
<form className="space-y-lg">
  {/* 24px between form groups */}
  <div className="space-y-base">
    <label>First Name</label>
    <input type="text" />
  </div>
  
  <div className="space-y-base">
    <label>Last Name</label>
    <input type="text" />
  </div>
  
  <button className="btn btn-primary">Submit</button>
</form>
```

---

### Table Spacing

#### Table Cell Padding
```tsx
<td className="px-lg py-md">
  {/* Horizontal: 24px, Vertical: 16px */}
</td>
```

#### Row Height
```
Comfortable: 48px (py-md)
Compact: 40px (py-sm)
Spacious: 56px (py-lg)
```

**Recommended**: Use `py-md` (16px) for standard tables.

---

### List Spacing

#### Vertical List
```tsx
<div className="space-y-base">
  {/* 12px between items */}
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

#### Horizontal List
```tsx
<div className="flex gap-md">
  {/* 16px between items */}
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

---

## Grid Patterns

### 2-Column Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</div>
```

**Spacing**: `gap-md` (16px)  
**Breakpoint**: Mobile → Tablet (768px)

### 3-Column Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

**Common Uses**: Cards, course listings, KPI cards

### 4-Column Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
  {/* KPI cards or similar */}
</div>
```

**Best For**: Dashboard metrics, icons grid

### Responsive Grid

| Breakpoint | Columns | Gap |
|---|---|---|
| Mobile (< 768px) | 1 | md (16px) |
| Tablet (768-1024px) | 2 | md (16px) |
| Desktop (> 1024px) | 3-4 | md (16px) |

---

## Common Layouts

### Dashboard Page

```
┌────────────────────────────────────────┐
│ Page Title                             │
│ Optional subtitle or breadcrumb        │
└────────────────────────────────────────┘
         ↓ gap-lg
┌────────────────────────────────────────┐
│ KPI Cards (1 row, 4 columns)           │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐                  │
│ │##│ │##│ │##│ │##│                  │
│ └──┘ └──┘ └──┘ └──┘                  │
└────────────────────────────────────────┘
         ↓ gap-lg
┌────────────────────────────────────────┐
│ Section: Recent Payments               │
│ ┌──────────────────────────────────┐  │
│ │ [Table with data]                │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Code**:
```tsx
<main className="p-md lg:p-lg space-y-lg">
  {/* Header */}
  <div>
    <h1 className="text-h1 font-bold">Dashboard</h1>
  </div>

  {/* KPI Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
    <KPICard />
    <KPICard />
    <KPICard />
    <KPICard />
  </div>

  {/* Payments Section */}
  <div className="bg-white rounded-lg p-lg shadow-md space-y-lg">
    <h2 className="text-h2 font-bold">Recent Payments</h2>
    <PaymentsList />
  </div>
</main>
```

---

### List/Table Page

```
┌────────────────────────────────────────┐
│ Page Title                             │
└────────────────────────────────────────┘
         ↓ gap-lg
┌────────────────────────────────────────┐
│ [Search Bar] [Filters]                 │
└────────────────────────────────────────┘
         ↓ gap-md
┌────────────────────────────────────────┐
│ [Table with data]                      │
└────────────────────────────────────────┘
         ↓ gap-md
┌────────────────────────────────────────┐
│ [Pagination Controls]                  │
└────────────────────────────────────────┘
```

**Code**:
```tsx
<main className="p-md lg:p-lg space-y-lg">
  {/* Header */}
  <h1 className="text-h1 font-bold">Payments</h1>

  {/* Filters */}
  <FilterBar
    placeholder="Search..."
    onSearch={handleSearch}
  />

  {/* Table */}
  <Table
    columns={columns}
    data={data}
    keyExtractor={(row) => row.id}
  />

  {/* Pagination */}
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</main>
```

---

### Modal Layout

```
┌─────────────────────────────────────────┐
│ Modal Title                          [X] │
├─────────────────────────────────────────┤
│                                         │
│  Form content with p-lg padding        │
│  • Inputs with space-y-base            │
│  • Labels with text-label              │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel Button]      [Submit Button]   │
└─────────────────────────────────────────┘
```

**Code**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Add Payment"
>
  <form className="space-y-lg">
    {/* Form fields with space-y-base */}
    <div className="space-y-base">
      <label>Amount</label>
      <input type="number" />
    </div>

    {/* Footer buttons */}
    <div className="flex gap-md justify-end">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-primary">Submit</button>
    </div>
  </form>
</Modal>
```

---

### Card Grid (Courses)

```
┌────────────────────────────────────────┐
│ My Courses    [All] [Active]          │
├────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│ │Course 1 │  │Course 2 │  │Course 3 │ │
│ │Progress │  │Progress │  │Progress │ │
│ └─────────┘  └─────────┘  └─────────┘ │
└────────────────────────────────────────┘
         ↓ gap-md
┌────────────────────────────────────────┐
│ ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│ │Course 4 │  │Course 5 │  │Course 6 │ │
│ └─────────┘  └─────────┘  └─────────┘ │
└────────────────────────────────────────┘
```

**Code**:
```tsx
<div className="space-y-lg">
  {/* Header */}
  <div className="flex items-center justify-between">
    <h2 className="text-h2 font-bold">My Courses</h2>
    <div className="flex gap-sm">
      <button className="btn btn-ghost">All</button>
      <button className="btn btn-secondary">Active</button>
    </div>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
    {courses.map(course => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>

  {/* Pagination */}
  <Pagination {...paginationProps} />
</div>
```

---

## Responsive Spacing

### Mobile-First Approach

**Default spacing** applies to mobile, then add responsive overrides:

```tsx
<div className="p-md lg:p-lg">
  {/* Mobile: p-md (16px) */}
  {/* Desktop: p-lg (24px) */}
</div>
```

### Breakpoint Spacing

| Breakpoint | Width | Padding | Gap |
|---|---|---|---|
| Mobile | < 768px | p-md | gap-md |
| Tablet | 768-1024px | p-md | gap-md |
| Desktop | > 1024px | p-lg | gap-lg |

### Responsive Grid

```tsx
{/* Mobile: 1 col, Tablet: 2 col, Desktop: 3 col */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  <Card />
  <Card />
  <Card />
</div>
```

### Responsive Section Spacing

```tsx
<section className="space-y-base md:space-y-md lg:space-y-lg">
  {/* Tighter on mobile, wider on desktop */}
</section>
```

---

## Spacing Mistakes to Avoid

### ❌ Too Tight
```tsx
// Bad: No breathing room
<div className="flex gap-xs">
  <button>Submit</button>
  <button>Cancel</button>
</div>
```

### ✅ Correct
```tsx
<div className="flex gap-md">
  <button>Submit</button>
  <button>Cancel</button>
</div>
```

---

### ❌ Inconsistent
```tsx
// Bad: Different spacing each place
<div className="p-sm">Card 1</div>
<div className="p-lg">Card 2</div>
<div className="p-md">Card 3</div>
```

### ✅ Correct
```tsx
// Good: Consistent spacing
<div className="p-lg">Card 1</div>
<div className="p-lg">Card 2</div>
<div className="p-lg">Card 3</div>
```

---

### ❌ Nested Spacing Conflicts
```tsx
// Bad: Conflicting space declarations
<div className="space-y-lg p-md">
  <div className="mb-lg">Item</div>
  {/* Why both space-y-lg AND mb-lg? */}
</div>
```

### ✅ Correct
```tsx
// Good: Use space-y OR individual margins
<div className="p-md space-y-lg">
  <div>Item</div>
  <div>Item</div>
</div>
```

---

## Quick Reference

### Most Used Spacing

| Scenario | Tailwind Class | Value |
|----------|---|---|
| Page padding | `p-md lg:p-lg` | 16px → 24px |
| Section gap | `space-y-lg` | 24px |
| Component gap | `gap-md` | 16px |
| Card padding | `p-lg` | 24px |
| Button gap | `gap-md` | 16px |
| Form field gap | `space-y-base` | 12px |
| Label to input | `space-y-base` | 12px |

---

## Implementation Checklist

- [ ] Use 8px grid for all spacing
- [ ] Use consistent spacing tokens (no magic numbers)
- [ ] Check responsive spacing on mobile/tablet/desktop
- [ ] Verify page padding is responsive (p-md lg:p-lg)
- [ ] Ensure section gaps are generous (gap-lg, space-y-lg)
- [ ] Verify button groups have proper spacing (gap-md)
- [ ] Check form field spacing (space-y-base)
- [ ] Verify card padding is consistent (p-lg)
- [ ] Check table cell padding (px-lg py-md)
- [ ] Test grid responsiveness (grid-cols-1 md:grid-cols-2)

---

## References

- **Design System**: `frontend/DESIGN_SYSTEM.md`
- **Tailwind Config**: `frontend/tailwind.config.ts`
- **Global Styles**: `frontend/app/globals.css`

---

**Status**: ✅ Complete  
**Last Review**: March 9, 2026  
**Maintained By**: Design System Team
