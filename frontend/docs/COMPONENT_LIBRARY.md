# Component Library

**Version**: 1.0  
**Last Updated**: March 9, 2026  
**Status**: Production Ready ✅

---

## Table of Contents

1. [Layout Components](#layout-components)
2. [Form Components](#form-components)
3. [Data Display](#data-display)
4. [Feedback Components](#feedback-components)
5. [Overlay Components](#overlay-components)
6. [Feature Components](#feature-components)

---

## Layout Components

### DashboardLayout

Responsive layout with sidebar navigation and main content area.

**Location**: `app/(dashboards)/layout.tsx`

**Features**:
- ✅ Collapsible mobile sidebar
- ✅ Active link indicator
- ✅ User profile dropdown
- ✅ Responsive header

**Usage**:
```tsx
import DashboardLayout from '@/app/(dashboards)/layout';

export default function Page() {
  return (
    // Automatically wrapped by DashboardLayout
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
}
```

**Props**: None (route-based)

**Responsive**:
- Mobile: Hamburger menu, full-width content
- Tablet+: Sidebar always visible

---

## Form Components

### Button

Reusable button component with multiple variants.

**Location**: `components/shared/Button.tsx`

**Props**:
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
```

**Variants**:

#### Primary
```tsx
<Button variant="primary">Submit</Button>
```
- Background: Brand blue
- Text: White
- Hover: Darker blue

#### Secondary
```tsx
<Button variant="secondary">Cancel</Button>
```
- Border: Brand blue
- Text: Brand blue
- Hover: Light blue background

#### Danger
```tsx
<Button variant="danger">Delete</Button>
```
- Background: Red
- Text: White
- Hover: Darker red

#### Ghost
```tsx
<Button variant="ghost">Learn More</Button>
```
- Background: Transparent
- Text: Brand blue
- Hover: Light background

**Sizes**:
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Loading State**:
```tsx
<Button loading={true}>Submitting...</Button>
```

---

### Input

Standard form input with label and validation.

**Location**: `app/(auth)/login/page.tsx` (example)

**Usage**:
```tsx
<div className="space-y-sm">
  <label className="text-label font-semibold text-neutral-700">
    Email
  </label>
  <input
    type="email"
    placeholder="you@example.com"
    className="w-full px-md py-sm rounded-md border border-neutral-300 focus:ring-2 focus:ring-brand"
  />
</div>
```

**Styles**:
- Border: Neutral 300
- Focus: Ring of brand color
- Padding: md (16px)
- Border radius: md (8px)

---

### Select

Form select input for dropdown options.

**Usage**:
```tsx
<select className="w-full px-md py-sm rounded-md border border-neutral-300">
  <option>-- Select --</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

## Data Display

### Table

Sortable, filterable data table with pagination.

**Location**: `components/shared/Table.tsx`

**Props**:
```tsx
interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onSort?: (column: string, direction: SortDirection) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  striped?: boolean;
  hoverable?: boolean;
  isLoading?: boolean;
}
```

**Features**:
- ✅ Click headers to sort (asc → desc → clear)
- ✅ Visual sort indicators (↑↓)
- ✅ Striped rows for readability
- ✅ Hover highlighting
- ✅ Loading skeletons
- ✅ Empty state

**Example**:
```tsx
const columns: TableColumn[] = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (value) => formatDate(value),
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    align: 'right',
    render: (value) => formatCurrency(value),
  },
];

<Table
  columns={columns}
  data={payments}
  keyExtractor={(p) => p.id}
  sortColumn="date"
  sortDirection="desc"
  onSort={handleSort}
  striped={true}
  hoverable={true}
/>
```

---

### Pagination

Navigation for large datasets.

**Location**: `components/shared/Pagination.tsx`

**Props**:
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
  isLoading?: boolean;
}
```

**Usage**:
```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={250}
  itemsPerPage={25}
/>
```

**Display**:
```
Showing 1 to 25 of 250   [←] 1 2 3 ... 10 [→]
```

---

### FilterBar

Search and filter controls.

**Location**: `components/shared/FilterBar.tsx`

**Props**:
```tsx
interface FilterBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  filters?: FilterOption[];
  onFilter: (filters: Record<string, string>) => void;
  searchDelay?: number;
}
```

**Usage**:
```tsx
<FilterBar
  placeholder="Search payments..."
  onSearch={handleSearch}
  filters={[
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
      ]
    }
  ]}
  onFilter={handleFilter}
/>
```

---

## Feedback Components

### Skeleton

Loading placeholder component.

**Location**: `components/shared/Skeleton.tsx`

**Basic Skeleton**:
```tsx
<Skeleton className="h-4 w-24" />
```

**Variants**:

#### Card Skeleton
```tsx
<KPICardSkeleton />
```
Simulates loading KPI card with title, value, and icon.

#### Course Card Skeleton
```tsx
<CourseCardSkeleton />
```
Simulates loading course card with progress bar.

#### Table Skeleton
```tsx
<TableSkeleton rows={5} columns={4} />
```
Simulates loading table with header and rows.

#### Full Page Skeleton
```tsx
<PageLoadingSkeleton />
```
Complete dashboard loading state.

**Features**:
- ✅ Shimmer animation
- ✅ `aria-hidden` for accessibility
- ✅ Respects `prefers-reduced-motion`

---

### EmptyState

Display when no content is available.

**Location**: `components/shared/EmptyState.tsx`

**Basic Empty State**:
```tsx
<EmptyState
  icon={BookOpen}
  title="No Courses Yet"
  description="You haven't enrolled in any courses."
  actionLabel="Browse Courses"
  onAction={() => navigate('/courses')}
/>
```

**Specialized States**:

#### No Courses
```tsx
<NoCourseState onEnroll={() => {}} />
```

#### No Payments
```tsx
<NoPaymentsState onPayNow={() => {}} />
```

#### No Attendance
```tsx
<NoAttendanceState />
```

#### Error State
```tsx
<ErrorState
  message="Failed to load data"
  onRetry={() => refetch()}
/>
```

#### No Search Results
```tsx
<NoSearchResults query="xyz" onClear={() => setQuery('')} />
```

---

### Error Boundary

Catches and displays component errors gracefully.

**Location**: `components/shared/ErrorBoundary.tsx`

**Usage**:
```tsx
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

**Features**:
- ✅ Catches React errors
- ✅ User-friendly error message
- ✅ Retry button
- ✅ Error logging
- ✅ HOC wrapper (`withErrorBoundary`)

---

## Overlay Components

### Modal

Standardized modal/dialog component.

**Location**: `components/shared/Modal.tsx`

**Props**:
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
}
```

**Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  description="Are you sure you want to continue?"
>
  <p>This action cannot be undone.</p>
</Modal>
```

**Features**:
- ✅ Backdrop click to close
- ✅ Escape key closes
- ✅ Focus trap (keyboard navigation)
- ✅ Fade-in and slide-up animations
- ✅ Smooth transitions
- ✅ ARIA attributes

**Sizes**:
```tsx
<Modal size="sm">Small modal</Modal>
<Modal size="md">Medium modal (default)</Modal>
<Modal size="lg">Large modal</Modal>
```

---

### AlertModal

Quick confirmation modal.

**Location**: `components/shared/Modal.tsx`

**Usage**:
```tsx
<AlertModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Payment"
  description="Are you sure?"
  confirmText="Delete"
  cancelText="Cancel"
  isDangerous={true}
/>
```

---

### FormModal

Modal for form submission.

**Location**: `components/shared/Modal.tsx`

**Usage**:
```tsx
<FormModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={handleSubmit}
  title="Add Payment"
  submitText="Submit"
  isSubmitting={isSubmitting}
>
  <input type="text" placeholder="Amount" />
  <input type="email" placeholder="Email" />
</FormModal>
```

---

### ConfirmDialog

Standalone confirmation dialog.

**Location**: `components/shared/ConfirmDialog.tsx`

**Usage**:
```tsx
<ConfirmDialog
  isOpen={isOpen}
  title="Delete Item"
  message="This cannot be undone."
  onConfirm={handleDelete}
  onCancel={handleCancel}
  isDangerous={true}
/>
```

---

## Feature Components

### PaymentsList

Complete payment history with sorting, filtering, pagination.

**Location**: `components/features/student/PaymentsList.tsx`

**Features**:
- ✅ Sortable columns (Date, Amount, Status)
- ✅ Search by transaction reference
- ✅ Filter by payment method and status
- ✅ Pagination (10 items/page)
- ✅ Status badges (Pending/Verified/Rejected)
- ✅ Currency formatting
- ✅ Loading skeletons
- ✅ Empty state

**Usage**:
```tsx
import { PaymentsList } from '@/components/features/student/PaymentsList';

export default function PaymentsPage() {
  return (
    <div className="p-lg lg:p-xl space-y-lg">
      <h1 className="text-h1 font-bold">Payment History</h1>
      <PaymentsList />
    </div>
  );
}
```

**Columns**:
| Column | Sortable | Format |
|--------|----------|--------|
| Date | ✓ | Mar 9, 2026 |
| Method | ✓ | M-Pesa, Bank, etc. |
| Amount | ✓ | Ksh 5,000.00 |
| Status | ✓ | Badge (green/orange/red) |
| Reference | ✗ | Raw value |

---

### CoursesList

Course grid with enrollment status filtering.

**Location**: `components/features/student/CoursesList.tsx`

**Features**:
- ✅ Card-based grid layout
- ✅ Filter by status (Active/Completed/Suspended)
- ✅ Progress indicators
- ✅ Attendance percentage
- ✅ Outstanding balance
- ✅ Pagination (6 items/page)
- ✅ Hover lift effect
- ✅ Loading skeletons
- ✅ Empty state

**Usage**:
```tsx
import { CoursesList } from '@/components/features/student/CoursesList';

export default function CoursesPage() {
  return (
    <div className="p-lg lg:p-xl space-y-lg">
      <h1 className="text-h1 font-bold">My Courses</h1>
      <CoursesList />
    </div>
  );
}
```

**Card Layout**:
```
┌─────────────────────────────┐
│ Course Name                 │
│ Batch: 2026-01              │
│ [Status Badge]              │
│                             │
│ Progress: ████░░░░ 60%      │
│ Attendance: 92% | Bal: 2000 │
└─────────────────────────────┘
```

---

### PaymentModal

Modal for processing payments.

**Location**: `components/features/student/PaymentModal.tsx`

**Features**:
- ✅ Amount input with currency formatting
- ✅ Payment method selection
- ✅ Transaction reference
- ✅ Notes field
- ✅ Form validation
- ✅ Submit/Cancel buttons
- ✅ Loading state

**Usage**:
```tsx
<PaymentModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={handlePayment}
  initialAmount={1000}
/>
```

---

### EnrollmentModal

Modal for course enrollment.

**Location**: `components/features/student/EnrollmentModal.tsx`

**Features**:
- ✅ Course selection
- ✅ Batch selection
- ✅ Amount display
- ✅ Terms acceptance checkbox
- ✅ Submit/Cancel buttons
- ✅ Validation

**Usage**:
```tsx
<EnrollmentModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={handleEnroll}
  courseId={123}
/>
```

---

## Component Composition Pattern

Components are built in layers:

### Layer 1: Shared/Base Components
```
components/shared/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Table.tsx
├── Skeleton.tsx
└── EmptyState.tsx
```

### Layer 2: Feature Components
```
components/features/student/
├── PaymentsList.tsx
├── PaymentModal.tsx
├── CoursesList.tsx
└── EnrollmentModal.tsx
```

### Layer 3: Page Components
```
app/(dashboards)/student/
├── dashboard/page.tsx
├── payments/page.tsx
└── courses/page.tsx
```

---

## Styling Pattern

All components follow this pattern:

```tsx
import { cn } from '@/lib/utils';

export function MyComponent({ variant = 'primary', children, className }) {
  return (
    <div className={cn(
      // Base styles
      'px-md py-sm rounded-md',
      
      // Conditional styles
      variant === 'primary' && 'bg-brand text-white',
      variant === 'secondary' && 'bg-brand-light text-brand',
      
      // States
      'hover:shadow-lg transition-all duration-220',
      'focus:ring-2 focus:ring-brand focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // User overrides
      className
    )}>
      {children}
    </div>
  );
}
```

---

## Testing Components

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] All variants display correctly
- [ ] Hover states work smoothly
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Dark mode (if applicable)
- [ ] Accessibility checks (axe DevTools)
- [ ] No console errors/warnings

### Keyboard Navigation

- [ ] Tab moves through interactive elements
- [ ] Shift+Tab moves backwards
- [ ] Enter activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in menus

### Screen Reader Testing

- [ ] Component announced correctly
- [ ] Labels associated with inputs
- [ ] Icons have aria-labels
- [ ] Loading states announced
- [ ] Form validation messages read

---

## Performance Tips

1. **Memoize Components**: Use `React.memo()` for performance
   ```tsx
   export const Card = React.memo(function Card({ children }) {
     return <div className="card">{children}</div>;
   });
   ```

2. **Lazy Load**: Use `React.lazy()` for large components
   ```tsx
   const PaymentsList = React.lazy(() => import('./PaymentsList'));
   ```

3. **Virtualize Lists**: For large data sets
   ```tsx
   // Consider: react-virtual, react-window
   ```

4. **Optimize Rendering**: Use `useMemo` for expensive operations
   ```tsx
   const sortedData = useMemo(() => {
     return sortBy(data, sortColumn, sortDirection);
   }, [data, sortColumn, sortDirection]);
   ```

---

## Migration Guide

### From Old Components

If migrating from older components:

1. **Before**:
   ```tsx
   import { OldButton } from '@/components/old/Button';
   <OldButton onClick={...}>Submit</OldButton>
   ```

2. **After**:
   ```tsx
   <Button variant="primary" onClick={...}>Submit</Button>
   ```

3. **Find & Replace**:
   - `OldButton` → `Button`
   - `OldInput` → Use native `<input>` with proper classes
   - `OldTable` → `Table` from shared components

---

## Support & Troubleshooting

### Common Issues

**Q: Component not responsive?**  
A: Check that you're using responsive Tailwind classes (`md:`, `lg:`)

**Q: Styling not applying?**  
A: Verify the class is in Tailwind content array in `tailwind.config.ts`

**Q: Accessibility warnings?**  
A: Run `axe DevTools` to check ARIA labels, contrast ratios

**Q: Modal not closing?**  
A: Ensure `onClose` is properly connected to state update

---

## References

- **Design System**: `frontend/DESIGN_SYSTEM.md`
- **Spacing Guide**: `frontend/SPACING_GUIDE.md`
- **Tailwind Config**: `frontend/tailwind.config.ts`
- **Global Styles**: `frontend/app/globals.css`

---

**Status**: ✅ Complete  
**Last Review**: March 9, 2026  
**Maintained By**: Design System Team
