# Design System

Reusable UI components (Button, Dropdown, Input, Loader, Toast, Tooltip) and their styles.

## Folder structure

```
design-system/
│
├── components/
│   │
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── button.styles.ts
│   │   ├── button.types.ts
│   │   └── index.ts
│   │
│   ├── dropdown/
│   │   └── .gitkeep
│   │
│   ├── input/
│   │   ├── Input.tsx
│   │   ├── input.styles.ts
│   │   ├── input.types.ts
│   │   └── index.ts
│   │
│   ├── loader/
│   │   ├── Loader.tsx
│   │   ├── loader.styles.ts
│   │   └── index.ts
│   │
│   ├── toast/
│   │   ├── Toast.tsx
│   │   ├── toast.styles.ts
│   │   ├── use-toast.ts
│   │   └── index.ts
│   │
│   └── tooltip/
│       ├── Tooltip.tsx
│       ├── tooltip.styles.ts
│       └── index.ts
│
├── utils/
│   ├── cn.ts
│   └── variants.ts
│
└── index.ts
```

**What each file does**

- `Button.tsx` / `Input.tsx` etc. — the React component
- `*.styles.ts` — CSS classes (Tailwind)
- `*.types.ts` — TypeScript props
- `index.ts` — export so other files can import easily
- `cn.ts` — helper to join CSS class names
- `variants.ts` — helper for size/color variants (primary, small, etc.)

## Packages to install

Run these inside the `frontend` folder.

**Main packages**

```bash
npm install clsx tailwind-merge class-variance-authority
npm install -D tailwindcss @tailwindcss/vite
```

- **tailwindcss** — styling
- **clsx** + **tailwind-merge** — used in `cn.ts`
- **class-variance-authority** — used for button/input variants

## Import example

```ts
import { Button, Input, Loader, Tooltip, ToastProvider, useToast } from "../design-system";
```
