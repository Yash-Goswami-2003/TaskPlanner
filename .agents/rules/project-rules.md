---
trigger: always_on
---

Pick the Task AI — Landing Page Rules
Product identity
Product name: Pick the Task AI
AI-powered task management platform.
Users can create tasks, assign tasks to others, track progress, and manage team work.
Position it as a modern alternative to traditional Jira-style task management.
Overall visual direction
Light theme only.
Pure/near-white background.
Black and dark-gray typography.
Minimal use of accent colors.
No dark mode, gradients-heavy visuals, neon colors, or overly decorative elements.
Clean, premium SaaS aesthetic.
Minimalism
Every element must have a purpose.
Avoid unnecessary cards, borders, icons, badges, and visual noise.
Prefer whitespace over decorative separators.
Keep the interface visually calm.
Breathing space
Give the AI and primary UI demonstration plenty of whitespace.
Don't cram multiple sections into the viewport.
Use generous but controlled padding.
Maintain clear visual hierarchy between headline, supporting text, CTA, and product preview.
Hero section
Extremely strong, concise headline.
One short supporting sentence explaining the product.
One primary CTA.
One secondary/light CTA if necessary.
Large product UI preview underneath or beside the hero.
The product UI should immediately communicate tasks + AI + collaboration.
Product-first design
The actual application interface should be the visual hero.
Don't rely on stock illustrations.
Show realistic task cards, assignees, status, priorities, AI suggestions, etc.
The UI preview should look like an actual working product, not a generic SaaS mockup.
Typography
Modern sans-serif typography.
Strong, large headline.
Compact supporting text.
Clear contrast between heading, body, metadata, and labels.
Avoid excessive font weights and typography styles.
Layout
Compact overall composition.
Strong alignment/grid system.
Everything should feel intentionally positioned.
Consistent spacing scale.
No oversized sections that exist only to fill space.
Desktop-first but responsive.
Color system
Primary: white.
Text: black / near-black.
Secondary text: muted gray.
Borders: extremely subtle gray.
Accent color should be used sparingly and only where it improves interaction hierarchy.
The page should still look excellent almost entirely in black and white.
AI positioning
AI should feel like a core part of the product, not a chatbot bolted onto Jira.
Show AI helping with things such as:
Creating tasks from natural language.
Breaking large tasks into subtasks.
Assigning/recommending owners.
Prioritizing work.
Summarizing project progress.
Keep the AI interaction visually lightweight.
Task UI
Task cards should be compact.
Show only useful metadata.
Clear hierarchy:
Task → Description → Assignee → Priority → Status
Avoid excessive Jira-like complexity.
Visual hierarchy
The user's eye should naturally follow:
Brand → Headline → Product value → CTA → Product UI → AI capability → Features → CTA
There should be one obvious primary action per section.
Animations
Subtle only.
Smooth entrance animations.
Small hover/micro-interactions.
No excessive parallax, bouncing elements, or flashy transitions.
Motion should reinforce the product rather than distract from it.
Architecture / visual language
Think Apple + Linear + modern AI SaaS, rather than traditional Jira.
Crisp grids.
Fine borders.
Precise spacing.
Compact components.
Strong typography.
Lots of white space.
Very deliberate composition.
What to avoid
❌ Dark theme
❌ Generic gradient SaaS landing page
❌ Huge colorful blobs
❌ Stock illustrations
❌ Excessive glassmorphism
❌ Overloaded dashboards
❌ Jira clone aesthetic
❌ Too many cards
❌ Excessive rounded corners
❌ Unnecessary animations
❌ Graph database terminology
❌ Graph visualization as the main product concept
❌ Anything related to the take-home assignment being presented as the landing-page purpose

And let me clarify one thing more, which I just noticed here, and it should be targeted. I don't know why it is not targeting. What you have to do is for every page if the page requires any components there will be a dedicated components folder for it and the comp. Inside the component there will be the list of component files which will be used in that page. That's easy, right? The utils, the components, all that.

Here is a list of 8 UI/UX guidelines based on this design system that you can add directly to your project rules:

### Dashboard UI/UX Design System Rules

1. **Strict Monochromatic Palette with Semantic Tints**
   * Primary background: `#ffffff` (`bg-white`).
   * Main text & primary buttons: `zinc-900` (`#18181b`).
   * Secondary/metadata text: `zinc-400` / `zinc-500`.
   * Borders & dividers: `zinc-100` / `zinc-200`.
   * Color tints (emerald, red, orange, yellow) must be muted and reserved strictly for priority badges, status indicators, and live pills.

2. **Compact & Standardized Vertical Heights**
   * Headers should be compact (`h-[56px]`).
   * Subheaders and section bars should use tight, purposeful padding (`py-4` to `py-5`).
   * Avoid large unnecessary vertical spacer boxes to keep essential content visible above the fold.

3. **Full-Bleed Edge Alignment**
   * Align top headers, subheaders, and sidebars flush to consistent horizontal padding (`px-5` or `px-6`).
   * Do not wrap edge-to-edge dashboard banners or subheaders in arbitrary `max-w-7xl` container constraints unless specifically building centered document views.

4. **Crisp Fine Borders over Drop Shadows**
   * Use thin, subtle borders (`border-zinc-100` / `border-zinc-200`) to define cards, sidebars, and structural dividers.
   * Avoid heavy drop shadows or glow effects. Reserve subtle elevation (`shadow-xs` / `shadow-sm`) only for primary action buttons or floating popovers.

5. **Clean SVG Iconography (No Emojis)**
   * Use minimal, vector SVG icons (`12px` to `16px`, `strokeWidth={2}`) for all workspace navigation, primary actions, and status indicators.
   * Do not use standard unicode emojis for UI icons.

6. **Structured Card Information Hierarchy**
   * Task and data cards must follow a strict vertical hierarchy:
     1. Top row: Item ID (mono text) + Title (semibold) + Priority tag (top right badge) + Arrow indicator.
     2. Middle: Description (`line-clamp-2`, muted text).
     3. Footer divider (`border-t border-zinc-100`): Stacked user avatar initials + Due date / metadata.

7. **Refined Typography & Micro Scales**
   * Metadata & section labels: `text-[10px]` uppercase tracking-wide (`tracking-wider` / `tracking-widest`).
   * Body copy & navigation links: `text-xs` (`12px`).
   * Card titles: `text-sm` (`14px`) font-semibold.
   * Section headers: `text-base` / `text-lg` with tight leading (`leading-none` or `leading-snug`).

8. **Subtle Micro-Interactions & Hover States**
   * Interactive rows and navigation items must have smooth color transitions (`transition-colors` / `transition-all`).
   * Buttons should feature subtle click feedback (`active:scale-[0.98]`).
   * Cards should respond on hover with a subtle border darkening (`hover:border-zinc-400`).