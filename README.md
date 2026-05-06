# Nimbus UI

Nimbus UI is a lightweight React component library built with TypeScript. It contains common business UI components such as Button, Input, Select, Modal, Table, and Upload.

## Tech Stack

- React + TypeScript
- Vite library build
- pnpm workspace monorepo
- Storybook documentation site
- Less
- Jest + React Testing Library
- ESLint + Prettier + Husky + lint-staged

## Monorepo Structure

```text
.
├── packages/
│   ├── nimbus-ui/      # component library package
│   ├── utils/          # shared utility package
│   └── docs/           # Storybook documentation package
├── docs/               # dumi/notes pages kept for project notes
├── scripts/            # component scaffolding scripts
└── templates/          # plop component templates
```

## Local Development

```bash
pnpm install
pnpm dev
```

## Common Commands

- `pnpm dev`: start Storybook documentation site
- `pnpm build`: build utils and component library packages
- `pnpm build:site`: build the Storybook static site
- `pnpm test`: run unit tests
- `pnpm test:coverage`: run unit tests with coverage
- `pnpm new`: create a new component from templates
- `pnpm mcp:server`: start the MCP stdio governance server
- `pnpm scan:components`: scan component API, stories, tests, demos, and docs
- `pnpm scan:governance`: generate the combined component and token governance report
- `pnpm scan:tokens`: scan component styles and suggest design token replacements
- `pnpm scan:tokens -- --fix`: safely replace mapped hardcoded colors with CSS variables

## Theme Tokens

Nimbus UI exposes theme variables through `packages/nimbus-ui/src/theme/css-vars.less`.
Components consume semantic CSS variables such as `--nimbus-color-primary` instead of hardcoded colors, so brand themes and dark mode can be implemented by overriding the same variables.

## Technical Notes

- [MCP-based component governance design](./docs/mcp-governance.md)

## Package Output

`packages/nimbus-ui` builds both module formats:

- `lib/index.cjs`: CommonJS entry
- `esm/index.js`: ES module entry
- `lib/index.d.ts`: TypeScript declarations

The package supports full imports from `nimbus-ui` and can be combined with `babel-plugin-import` for style-level on-demand usage.
