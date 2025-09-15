# Synapse Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Notion's clean interface and Linear's adaptive design patterns, optimized for neurodivergent users with cognitive-state-aware UI adaptations.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 218 70% 60% (indigo #6366F1)
- Secondary: 160 84% 39% (emerald #10B981) 
- Background: 210 40% 98% (slate-50 #F8FAFC)
- Text: 222 84% 5% (slate-900 #0F172A)
- Accent: 38 92% 50% (amber #F59E0B)

**Energy State Colors:**
- Low Energy: 0 84% 60% (red #EF4444)
- Medium Energy: 38 92% 50% (amber #F59E0B)
- High Energy: 160 84% 39% (emerald #10B981)
- Hyperfocus: 258 90% 66% (purple #8B5CF6)

**Dark Mode:** Maintain same hues with adjusted lightness for accessibility.

### B. Typography
- **Primary:** Inter (clean, readable)
- **Monospace:** JetBrains Mono (code/data display)
- **Hierarchy:** h1(2xl), h2(xl), h3(lg), body(base), small(sm)

### C. Layout System
**Adaptive Spacing Units:** 2, 4, 6, 8, 12, 16
- **Low Energy:** Increased spacing (p-8, m-6) for reduced cognitive load
- **High Energy:** Compact spacing (p-4, m-2) for information density
- **Hyperfocus:** Minimal distractions, single-column layouts

### D. Component Library

**Core Components:**
- **Brain Dump Interface:** Full-width textarea with energy state selector
- **Framework Tabs:** Horizontal tab navigation (Agile/Kanban/GTD/PARA/Custom)
- **Energy State Selector:** Visual radio buttons with color-coded states
- **Task Cards:** Rounded corners, subtle shadows, framework-specific styling
- **Progress Orchestration:** Interactive flowchart with connecting lines

**Navigation:** Clean header with logo, energy indicator, and framework switcher

**Forms:** Consistent input styling with focus states matching energy colors

**Data Display:** Card-based layouts with clear typography hierarchy

### E. Adaptive UI Behavior

**Energy State Adaptations:**
- **Low Energy:** Larger touch targets, simplified layouts, warm colors
- **Medium Energy:** Balanced density, standard interactions
- **High Energy:** Compact views, quick actions, cooler colors
- **Hyperfocus:** Distraction-free mode, single-task focus
- **Scattered:** Gentle transitions, organized sections, calming colors

**Transitions:** Smooth 200ms ease-in-out for state changes

## Images
No large hero images required. Use subtle icons from Heroicons for framework indicators, energy states, and navigation elements. Maintain clean, minimal aesthetic focused on content over decoration.

## Key Principles
1. **Cognitive Load Awareness:** UI complexity adapts to user's energy state
2. **Framework Agnostic:** Same data, multiple productive views
3. **Accessibility First:** High contrast, clear focus states, keyboard navigation
4. **Distraction-Free:** Minimal animations, purposeful color usage
5. **Responsive Adaptation:** Mobile-first with desktop enhancements