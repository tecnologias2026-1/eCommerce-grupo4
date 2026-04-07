# Project Guidelines

## Build and Test
- This is a static multi-page web app (HTML + CSS + vanilla JS) with no build pipeline.
- There is no `package.json` and no automated test suite configured.
- To run locally, serve the repository root with a simple static server (example: `python3 -m http.server 5500`) and open pages from `/assets/public/`.

## Architecture
- App is multi-page under `/assets/public/`.
- Shared header/footer are injected at runtime by `/js/manager.js` using `#header-placeholder` and `#footer-placeholder`.
- Navigation step state is centralized in `/js/manager.js` + `/assets/public/header.html` (active step, blocked forward links, logo-only pages).
- Cart and reservation state are persisted in `localStorage` (for example keys such as `weddingCart`, `selectedWeddingDate`, and reservation-related keys).

## Conventions
- Follow existing BEM-style class naming already used in pages and styles.
- Reuse design tokens and spacing variables from `/css/global.css` before adding hardcoded values.
- Keep shared navigation behavior in `/js/manager.js`; avoid hardcoding per-page header logic.
- Use lowercase file names for public pages and keep route consistency with `/assets/public/*.html`.

## Frontend Quality Standards

### Semantic HTML
- Prefer semantic tags over generic wrappers when structure allows (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- Use heading levels in order; do not skip levels (for example, avoid jumping from `h1` to `h3`).
- Keep exactly one `h1` per page.
- Use `p` for regular text and semantic lists (`ul`, `ol`, `li`, `dl`) for grouped content.
- For image captions, use `figure` + `figcaption` instead of plain paragraph captions.
- Avoid `b` and `i` for meaning; use `strong` and `em` when emphasis is semantic.

### Structure and Readability
- Keep consistent indentation and proper nesting with explicit closing tags.
- Keep long markup readable by breaking long attribute lines.
- Keep HTML structure predictable and aligned with content hierarchy.
- Preserve ITCSS-style organization already present in `/css/global.css` (broad rules first, components and overrides later).

### Accessibility (WCAG-Oriented)
- Every meaningful image must have useful `alt` text; decorative images should use empty `alt` and be ignored by assistive tech when applicable.
- Form controls must be associated with `label` elements.
- Use `fieldset` and `legend` for related form groups when it improves context.
- Ensure keyboard usability (focusable controls, visible focus states, no keyboard traps).
- Do not use color or images as the only way to convey state or meaning.
- Keep typography responsive and readable across breakpoints.

### CSS Authoring Rules
- Keep styles in external stylesheets; avoid inline styles except when absolutely necessary.
- Prefer class selectors over ID selectors for styling.
- Keep specificity low and avoid `!important` unless there is no cleaner option.
- Continue using CSS custom properties for colors, spacing, and typography before introducing new hardcoded values.
- Keep BEM (`block__element--modifier`) as the primary naming methodology for this project.

### Performance and Units
- Use `loading="lazy"` for non-critical images/media below the fold.
- Prefer `rem`/`em` for scalable typography and spacing; use `px` only when fixed pixel behavior is intentional.

### Preprocessor Note
- CSS preprocessors (Sass/Less) are optional future improvements.
- Do not assume a preprocessor in current tasks because this project has no build pipeline.

## Editing Guardrails
- Prefer minimal, targeted edits; do not reformat unrelated sections.
- When fixing flow/navigation, check both anchor links and inline redirects (`window.location.href`).
- Preserve relative/absolute path style already used by surrounding code.

## Documentation
- See `/README.md` for project scope and functional context.
- Do not duplicate long documentation here; link to source docs when available.
