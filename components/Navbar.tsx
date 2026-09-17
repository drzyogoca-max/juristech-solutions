/**
 * components/Navbar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Re-export bridge for the Next.js app/ directory.
 * The real Navbar lives in src/components/Navbar.tsx
 *
 * NOTE: This file is imported by app/[locale]/layout.tsx.
 * The src/components/Navbar uses react-router-dom which is incompatible
 * with Next.js. When the Next.js layer is activated in the future,
 * this stub must be replaced with a Next.js-compatible Navbar.
 * For now this correctly points to the actual production Navbar.
 */
export { default } from '../src/components/Navbar';
