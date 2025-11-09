# Theme System Architecture

## Component Hierarchy

```
App
└── ThemeProvider (wraps entire app)
    ├── QueryClientProvider
    ├── TooltipProvider
    ├── BrowserRouter
    │   └── Layout
    │       ├── Header
    │       │   └── ThemeToggle (← Toggle button here)
    │       ├── Main Content (all pages)
    │       └── Footer
    │       └── Routes
```

## Data Flow

```
User clicks toggle
        ↓
ThemeToggle.tsx calls toggleTheme()
        ↓
useTheme hook updates theme state
        ↓
ThemeContext broadcasts new theme
        ↓
applyTheme() updates:
  1. Document root class
  2. localStorage
        ↓
CSS variables update
        ↓
All components re-render with new colors
```

## File Structure

```
src/
├── contexts/
│   └── ThemeContext.tsx
│       ├── ThemeProvider (component)
│       ├── useTheme (hook)
│       ├── Theme (type: "light" | "dark")
│       └── ThemeContextType (interface)
│
├── components/
│   └── ThemeToggle.tsx
│       └── Uses: useTheme, Sun/Moon icons
│
├── components/layout/
│   ├── Header.tsx
│   │   └── Imports: ThemeToggle
│   ├── Layout.tsx
│   └── Footer.tsx
│
├── App.tsx
│   └── Wraps app with ThemeProvider
│
└── index.css
    ├── :root (dark mode variables)
    ├── .light (light mode variables)
    └── All gradients and utilities
```

## CSS Variable System

### Color Variables

Each theme mode defines:

```css
/* Core Colors */
--background        /* Main background */
--foreground        /* Main text */
--card              /* Card backgrounds */
--card-foreground   /* Card text */
--primary           /* Primary actions */
--secondary         /* Secondary elements */
--accent            /* Accent highlights */
--muted             /* Muted/disabled states */
--border            /* Border colors */
--input             /* Input field colors */

/* Extras */
--gold              /* Gold/special colors */
--destructive       /* Danger/delete actions */
--radius            /* Border radius */

/* Effects */
--gradient-primary  /* Primary gradient */
--gradient-card     /* Card gradient */
--gradient-hero     /* Hero section gradient */
--glow-primary      /* Primary glow effect */
--glow-accent       /* Accent glow effect */

/* Sidebar Colors */
--sidebar-*         /* Sidebar-specific colors */
```

## State Management

### ThemeContext

```typescript
interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}
```

### Storage

```javascript
// Saved in localStorage as
localStorage.getItem("theme") // "light" or "dark"
```

### System Detection

```javascript
// Uses prefers-color-scheme
window.matchMedia("(prefers-color-scheme: dark)").matches
```

## Theme Switching Flow

### Initial Load

```
1. Check localStorage.getItem("theme")
   ├─ Found? → Use saved theme
   └─ Not found? → Check system preference
   
2. Check window.matchMedia("prefers-color-scheme")
   ├─ System prefers dark? → Use dark
   ├─ System prefers light? → Use light
   └─ Unknown? → Default to dark

3. Apply theme
   ├─ Add/remove CSS class
   ├─ CSS variables update
   └─ Components re-render
```

### User Toggle

```
1. User clicks toggle button
   ↓
2. toggleTheme() called
   ├─ Calculate new theme
   ├─ Update state
   └─ Call applyTheme()

3. applyTheme(newTheme)
   ├─ Update document.documentElement.classList
   ├─ Save to localStorage
   └─ CSS variables switch immediately

4. Components using CSS variables
   └─ Update with new colors (no code change needed)
```

## Color Palette Comparison

### Dark Mode (Default)
| Element | Color | HSL |
|---------|-------|-----|
| Background | Deep Blue | 220 30% 8% |
| Foreground | Bright Blue-White | 210 100% 98% |
| Card | Dark Blue-Gray | 220 25% 12% |
| Primary | Sky Blue | 220 90% 55% |
| Accent | Cyan | 195 100% 50% |
| Border | Dark Gray | 220 20% 20% |

### Light Mode
| Element | Color | HSL |
|---------|-------|-----|
| Background | Light Gray | 220 14% 96% |
| Foreground | Dark Blue-Gray | 220 13% 20% |
| Card | White | 220 20% 100% |
| Primary | Sky Blue | 220 90% 55% |
| Accent | Cyan | 195 100% 50% |
| Border | Light Gray | 220 13% 91% |

## CSS Class Application

```html
<!-- Dark Mode -->
<html class="dark">
  <style>
    :root { --background: 220 30% 8%; }
  </style>
</html>

<!-- Light Mode -->
<html class="light">
  <style>
    .light { --background: 220 14% 96%; }
  </style>
</html>
```

## Component Usage Pattern

```tsx
// Any component can use theme-aware styling
import { useTheme } from "@/contexts/ThemeContext";

export function Component() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      {/* All Tailwind utilities automatically use theme variables */}
      {/* No need to conditionally render - CSS handles it! */}
    </div>
  );
}
```

## Performance Characteristics

- **Bundle Size**: ~2KB (minified)
- **Runtime Impact**: Negligible (single context provider)
- **CSS Variables**: Native browser support (IE 11+)
- **localStorage**: ~20 bytes per user
- **Re-renders**: Only on toggle (not on every page load)

## Browser APIs Used

1. **React Context API**
   - Used for: State management
   - Fallback: Props drilling (not implemented)

2. **localStorage**
   - Used for: Persistence
   - Fallback: Session storage (if localStorage blocked)
   - Size: ~20 bytes

3. **CSS Custom Properties**
   - Used for: Dynamic colors
   - Support: ~95% of browsers

4. **window.matchMedia()**
   - Used for: System preference detection
   - Fallback: Default to dark mode

## Accessibility

- ✅ ARIA label on toggle button
- ✅ Proper color contrast in both modes
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ No flashing on load
- ✅ Respects prefers-color-scheme

## Future Enhancement Ideas

1. **Theme Options**: Add more themes (e.g., "auto", "blue", "green")
2. **Animations**: Add smooth CSS transitions between themes
3. **Per-Page Themes**: Different themes for different pages
4. **Accessibility Themes**: High contrast mode
5. **Time-Based Themes**: Auto-switch at sunset/sunrise
6. **Cloud Sync**: Sync theme preference across devices
