# Design System

Reusable UI components (Button, Input, Select, Modal) and their styles.

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
│   ├── input/
│   │   ├── Input.tsx
│   │   ├── input.styles.ts
│   │   ├── input.types.ts
│   │   └── index.ts
│   │
│   ├── select/
│   │   ├── Select.tsx
│   │   ├── select.styles.ts
│   │   ├── select.types.ts
│   │   └── index.ts
│   │
│   └── modal/
│       ├── Modal.tsx
│       ├── modal.styles.ts
│       ├── modal.types.ts
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

**For Modal and Select (keyboard, focus, overlay)**

```bash
npm install @radix-ui/react-dialog @radix-ui/react-select
```


## Import example

```ts
import { Button, Input, Select, Modal } from "../design-system";
```
