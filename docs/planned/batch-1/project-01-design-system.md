# Project 1: Own Design System + NPM Package

The "Source of Truth" for the Ecosystem.

## 📁 Folder-Level Architecture

This is not just a `src` folder; it is a professional library structure designed for distribution.

```text
apps/01-design-system/
├── .storybook/                   # Storybook configuration (main.js, preview.js)
├── src/
│   ├── tokens/                   # Design Tokens (The "Atomic" values)
│   │   ├── colors.ts             # Primary, Secondary, Semantic colors
│   │   ├── spacing.ts            # Padding, Margin scales
│   │   └── typography.ts         # Font-sizes, Line-heights
│   │
│   ├── components/               # The Component Library
│   │   ├── atoms/                # Button, Input, Badge, Spinner, Avatar
│   │   │   └── Button/
│   │   │       ├── Button.tsx
│   │   │       ├── Button.styles.ts
│   │   │       └── Button.stories.tsx
│   │   │
│   │   ├── molecules/            # FormField, SearchInput, Tooltip
│   │   └── organisms/            # DataTable, Modal, Sidebar
│   │
│   ├── themes/                   # Theme provider and logic
│   │   │   └── ThemeContext.tsx
│   │
│   └── index.ts                  # Public API (Barrel file)
│
├── scripts/                      # Automation scripts
│   └── publish.sh                # Semantic versioning & publishing script
│
├── rollup.config.mjs             # Build config for ESM and CJS
├── .changeset                    # Changesets folder for automated versioning
├── package.json                  # Defined as @yourorg/design-system
└── tsconfig.json
```

---

# 📄 Engineering Specification

## 1. Purpose & Problem Statement

In a micro-frontend world, "UI Drift" is the enemy.

If three different developers build a "Button" in three different apps, the product looks unprofessional, and a brand change (e.g., changing Blue to Indigo) requires 20 separate pull requests.

Project 1 solves this by creating a single versioned source of truth.

---

## 2. Tech Stack & Justification

### React 18

The base for the entire ecosystem.

### Rollup

Used over Webpack because it is designed specifically for libraries.

It produces cleaner, tree-shakeable ESM (ES Modules) and CJS (CommonJS) bundles, ensuring that an app only downloads the components it actually imports.

### Storybook 8

Serves as the "Living Documentation."

It allows developers to browse components, interact with props in real-time, and verify accessibility without running a full application.

### CSS Variables (Custom Properties)

Used instead of a JS-based theme object.

This allows the CSS to be updated instantly in the browser without a React re-render, enabling seamless "Dark Mode" or "White-labeling" for different tenants.

### Changesets

Used for automated semantic versioning.

It manages the "changelog" and decides if a change is a patch, minor, or major update.

---

## 3. Design Patterns & Application

### Compound Component Pattern

Applied to Modal and Select.

Instead of one giant component with 20 props, we use:

```tsx
<Modal.Header />
<Modal.Body />
<Modal.Footer />
```

This gives the consumer full control over the internal layout.

### Polymorphic Component Pattern

Every component implements the `as` prop.

This allows a Button to be rendered as a `div`, a `span`, or a `next/link` while keeping the Button's styles.

### Atomic Design

The architecture is strictly divided into:

```text
Atoms
  ↓
Molecules
  ↓
Organisms
```

---

## 4. Detailed Design

### Token System

Every value (color, spacing, radius) is a token.

No hardcoded hex codes (e.g., `#FFFFFF`) are allowed in components.

They must use:

```css
var(--color-white)
```

### Component Requirements

#### Button

Must handle:

- Loading states (spinner)
- Disabled states
- Multiple variants

#### DataTable

Must implement Virtualization (via `react-window`) to handle 10,000+ rows without lagging the browser.

#### Modal

Must implement Focus Trapping (so a user cannot tab out of the modal into the background page).

---

## 5. API Design (Component Props)

### Button

```ts
{
  variant: 'primary' | 'secondary' | 'ghost',
  size: 'sm' | 'md' | 'lg',
  isLoading: boolean,
  as?: React.ElementType
}
```

### DataTable

```ts
{
  data: any[],
  columns: ColumnDef[],
  virtualize: boolean,
  onRowClick: (row: any) => void
}
```

---

## 6. Core Logic Flow: The Publishing Pipeline

```text
Developer creates component
          ↓
Writes .stories.tsx file
          ↓
Runs Storybook to verify
          ↓
Runs 'npx changeset'
to document the change
          ↓
CI/CD runs Rollup
          ↓
NPM Publish
          ↓
Consuming App runs
'npm update @yourorg/design-system'
```

---

## 7. E2E Expectation

### Scenario 1

```text
Open Storybook
      ↓
Change Primary Color Token
      ↓
All Components Update Instantly
```

### Scenario 2

```text
Install Package
in Fresh Next.js App
      ↓
Import <Button />
      ↓
Verify Styling
      ↓
Verify Tree-Shaking
(DataTable Code Not Imported)
```

### Scenario 3

```text
Change Version
1.0.1 → 1.1.0
      ↓
Changesets Runs
      ↓
CHANGELOG.md
Automatically Updated
```
