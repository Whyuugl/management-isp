# UI Guidelines

## Design principles

- Prioritize readable data, clear hierarchy, and task-focused controls.
- Use navy for navigation, white for surfaces, slate for supporting UI, and blue for primary actions.
- Keep borders subtle; use rounded corners consistently (`rounded-lg` for controls, `rounded-xl` for cards).
- Do not add motion or decorative effects unless they improve feedback or orientation.
- Keep every interactive control keyboard accessible and provide visible focus styling.

## Color palette

| Purpose         | Token                     | Example                         |
| --------------- | ------------------------- | ------------------------------- |
| Sidebar         | `slate-900`               | Sidebar background              |
| Primary         | `blue-600`                | Main actions, active navigation |
| Primary hover   | `blue-700`                | Hovered primary action          |
| Main background | `slate-50`                | Workspace background            |
| Surface         | `white`                   | Cards, inputs, dropdowns        |
| Primary text    | `slate-900`               | Headings and key values         |
| Supporting text | `slate-500`               | Descriptions and metadata       |
| Borders         | `slate-200` / `slate-300` | Cards / controls                |
| Success         | `green-600`               | Positive status                 |
| Warning         | `amber-700`               | Warning status                  |
| Danger          | `red-600`                 | Destructive action and errors   |

## Typography

Use Instrument Sans through the global `font-sans` theme, with system sans-serif fallbacks. Use `text-2xl font-semibold` for page titles, `text-lg font-semibold` for section headings, `text-sm` for controls and descriptions, and `text-xs` for compact status labels.

## Spacing

Use Tailwind's 4px spacing scale. Common patterns: 4–6 units between related controls, 6 units inside cards, 6–8 units between sections, 4 units page padding on small screens and 6 units on large screens. Avoid one-off values without a clear need.

## Component conventions

- UI primitives live in `resources/js/components/ui` and expose small, typed props.
- Common page patterns live in `resources/js/components/common`.
- Table primitives live in `resources/js/components/table`.
- Use `cn()` from `resources/js/lib/utils.ts` to compose and merge Tailwind classes.
- Components accept `className` only where extension is useful; preserve component defaults.
- Use native labels, buttons, inputs, and select elements. Keep error text associated with its control.
- Keep data fetching and business rules out of presentation components.
- Destructive actions require explicit confirmation. Frontend visibility is not authorization.

## Responsive rules

- Sidebar stays fixed at 16rem on large screens and becomes a dismissible overlay on smaller screens.
- Main content uses 1rem padding on small screens and 1.5rem on large screens.
- Headers stack title and actions on narrow screens.
- Tables scroll horizontally instead of squeezing important values.
- Keep dropdown and modal content within viewport width.

## Icon usage

Use Lucide React icons. Use consistent 1.25rem (`h-5 w-5`) icons for navigation and controls and 1rem (`h-4 w-4`) for compact actions. Pair icon-only buttons with an accessible name. Avoid using icons as decoration when a text label is clearer.
