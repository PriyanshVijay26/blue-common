# Dispatch Company - Privacy Policy Page Context

## Current Status
We have successfully built the `contact.html` page and now we are starting fresh on the Privacy Policy page. All work in this new chat should **strictly focus on `privacy.html` and `css/pages/privacy.css`** unless explicitly requested otherwise.

## Architecture & Layout Rules
1. **Component-Driven:** We use `components/header.html` and `components/footer.html`, dynamically fetched and injected via `js/main.js` (Requires Live Server due to CORS).
2. **Hero Component:** The privacy page will use the simple hero component: `<div id="subpage-hero-simple-placeholder" data-title="プライバシーポリシー" data-subtitle="Privacy Policy" data-breadcrumb="プライバシーポリシー"></div>`.
3. **Global CSS:** `global.css` handles CSS variables (`--primary-color`: `#0ABAB5`), resets, and the base `.container` (which has a `1200px` max-width).
4. **CSS Organization:** Component styles go in `css/components/` (like `subpage-hero-simple.css`), and page-specific styles go in `css/pages/` (like `privacy.css`).

## What was built in `contact.html` & `contact.css` (For reference)
- Built a highly customized form matching Figma specs.
- Form labels (`font-weight: 500`) and custom checkboxes (`font-weight: 400`) were balanced for readability.
- We used `flex-wrap: wrap;` and `justify-content: space-between;` for checkbox grid layouts to prevent overlaps and ensure they spanned widely and cleanly across the screen.
- Used `#BA0000` for required badges and privacy link text.

## Guidelines for the Next Agent
- **Scope:** Create `privacy.html` and `css/pages/privacy.css`.
- **Aesthetics:** Maintain the primary cyan/teal color (`#0ABAB5`), use ample white space, and ensure modern typography.
- **Structure:** The page content must be wrapped inside `<main class="main-content">` and a `<div class="container">` to maintain the `1200px` max-width.
- **Typography:** The privacy policy will likely be text-heavy. Focus on readable line-heights (e.g., `1.8`), good paragraph spacing, and clear, bold headings (H2, H3).

Let's begin building `privacy.html`!
