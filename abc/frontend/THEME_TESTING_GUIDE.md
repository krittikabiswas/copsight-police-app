# Theme Feature - Testing Guide

## ✅ Manual Testing Checklist

### Basic Functionality Tests

#### Test 1: Toggle Visibility
- [ ] Open app in browser
- [ ] Look for Sun/Moon icon in header
- [ ] Icon is visible and accessible
- [ ] Icon is positioned correctly between Register and Login buttons

#### Test 2: Dark to Light Toggle
- [ ] Click theme toggle icon
- [ ] App immediately switches to light mode
- [ ] Icon changes from Moon (🌙) to Sun (☀️)
- [ ] All text remains readable
- [ ] All buttons remain visible and clickable

#### Test 3: Light to Dark Toggle
- [ ] Click theme toggle icon again
- [ ] App immediately switches back to dark mode
- [ ] Icon changes from Sun (☀️) to Moon (🌙)
- [ ] All text remains readable
- [ ] All buttons remain visible and clickable

#### Test 4: Multiple Toggles
- [ ] Click toggle 5-10 times quickly
- [ ] App remains stable
- [ ] No errors in console
- [ ] Colors update instantly each time

### Persistence Tests

#### Test 5: Refresh Page - Same Theme
- [ ] Set theme to light mode
- [ ] Note the current theme
- [ ] Press F5 or click refresh
- [ ] Page reloads with light mode preserved
- [ ] Theme toggle shows correct icon

#### Test 6: Close and Reopen Browser
- [ ] Set theme to light mode
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Go to app URL
- [ ] Light theme is still active
- [ ] Preference persisted correctly

#### Test 7: localStorage Verification
- [ ] Set theme to dark
- [ ] Open browser DevTools (F12)
- [ ] Go to Application → localStorage
- [ ] Find entry with key: "theme"
- [ ] Value should be "dark"
- [ ] Toggle to light
- [ ] Value should now be "light"

#### Test 8: New Incognito/Private Window
- [ ] Open app in incognito/private window
- [ ] Should start with system preference
- [ ] Set theme to light
- [ ] Refresh page
- [ ] Theme persists in incognito window
- [ ] Close window
- [ ] Open new incognito window
- [ ] Starts fresh (doesn't remember from previous)

### Visual Tests

#### Test 9: Dark Mode Colors
- [ ] Background is deep blue (#021625)
- [ ] Text is bright white (#fbfcfe)
- [ ] Cards have dark blue background
- [ ] Buttons have blue accent color
- [ ] All text is easily readable
- [ ] No low contrast elements

#### Test 10: Light Mode Colors
- [ ] Background is light gray (#f5f6f8)
- [ ] Text is dark gray (#1a1f29)
- [ ] Cards are white (#ffffff)
- [ ] Buttons still have blue accent
- [ ] All text is easily readable
- [ ] No low contrast elements

#### Test 11: Component Rendering
- [ ] Home page displays correctly in both modes
- [ ] Dashboard displays correctly in both modes
- [ ] Register page displays correctly in both modes
- [ ] All UI components render properly
- [ ] No broken layouts or overlaps

### Cross-Page Tests

#### Test 12: Theme Persistence Across Pages
- [ ] Set theme to light mode
- [ ] Navigate to /dashboard
- [ ] Theme remains light
- [ ] Navigate to /register
- [ ] Theme remains light
- [ ] Toggle to dark
- [ ] Theme changes across all pages
- [ ] Navigate back to home
- [ ] Theme is still dark

#### Test 13: Toggle on Each Page
- [ ] On home page: toggle works
- [ ] On dashboard: toggle appears (if header shown)
- [ ] On register: toggle appears (if header shown)
- [ ] On not found (404): toggle works
- [ ] All toggles work consistently

### Accessibility Tests

#### Test 14: Keyboard Navigation
- [ ] Tab to theme toggle button
- [ ] Button is focusable
- [ ] Outline appears on focus
- [ ] Press Enter/Space
- [ ] Theme toggles successfully
- [ ] Focus remains on button

#### Test 15: Screen Reader
- [ ] Open with screen reader (if available)
- [ ] Button has aria-label
- [ ] Label is read correctly
- [ ] Purpose is clear to user
- [ ] Theme change is announced

#### Test 16: ARIA Attributes
- [ ] Open DevTools
- [ ] Inspect toggle button
- [ ] Check for aria-label="Toggle theme"
- [ ] Attribute is present
- [ ] Attribute is descriptive

### Browser Compatibility Tests

#### Test 17: Chrome/Edge
- [ ] Open in Chrome/Edge
- [ ] Toggle works
- [ ] Persistence works
- [ ] No console errors
- [ ] Colors display correctly

#### Test 18: Firefox
- [ ] Open in Firefox
- [ ] Toggle works
- [ ] Persistence works
- [ ] No console errors
- [ ] Colors display correctly

#### Test 19: Safari
- [ ] Open in Safari
- [ ] Toggle works
- [ ] Persistence works
- [ ] No console errors
- [ ] Colors display correctly

#### Test 20: Mobile Browsers
- [ ] Test on mobile Chrome
- [ ] Test on mobile Safari
- [ ] Toggle button is tappable
- [ ] Toggle works on mobile
- [ ] Persistence works on mobile
- [ ] Colors look good on small screens

### Edge Cases

#### Test 21: Clear Storage
- [ ] Set theme to light
- [ ] Open DevTools → Application → Storage → Clear All
- [ ] Refresh page
- [ ] App loads with system preference (or default dark)
- [ ] Toggle functionality still works

#### Test 22: Multiple Tabs
- [ ] Open app in Tab 1 (dark mode)
- [ ] Open app in Tab 2 (same app URL)
- [ ] Toggle to light in Tab 1
- [ ] Tab 2 should still show dark (until refresh)
- [ ] Refresh Tab 2
- [ ] Tab 2 now shows light mode
- [ ] Storage is shared but rendering is independent

#### Test 23: System Preference Change
- [ ] Close browser
- [ ] Change OS theme preference
- [ ] Open app in fresh tab
- [ ] App respects new OS preference (if no stored preference)
- [ ] This test is OS-dependent

#### Test 24: Rapid Toggling
- [ ] Click toggle 20+ times rapidly
- [ ] App doesn't crash
- [ ] No memory leaks
- [ ] Theme updates correctly each time
- [ ] No lag or slowdown

### Performance Tests

#### Test 25: Load Time
- [ ] Measure page load time with theme
- [ ] Should not add significant delay
- [ ] Time should be <100ms additional
- [ ] DevTools → Network shows small overhead

#### Test 26: Memory Usage
- [ ] Open DevTools → Memory
- [ ] Take heap snapshot
- [ ] Toggle theme 10 times
- [ ] Take another heap snapshot
- [ ] Memory should be stable
- [ ] No memory leaks detected

#### Test 27: Battery Usage (Mobile)
- [ ] Open app on mobile device
- [ ] Toggle theme multiple times
- [ ] App should not drain battery faster
- [ ] UI updates should be smooth (60 FPS)

### Console Tests

#### Test 28: Console Errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Interact with theme toggle
- [ ] No errors should appear
- [ ] No warnings about theme

#### Test 29: localStorage Errors
- [ ] Toggle theme
- [ ] Check console
- [ ] No localStorage errors
- [ ] No permission errors
- [ ] No quota exceeded errors

---

## 🧪 Automated Test Examples

### React Testing Library Example

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import App from '@/App';

describe('Theme Toggle', () => {
  it('toggles theme on button click', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    const toggleButton = screen.getByLabelText('Toggle theme');
    
    // Initially dark
    expect(container.firstChild).not.toHaveClass('light');
    
    // Click to toggle
    await user.click(toggleButton);
    
    // Should be light now
    expect(container.firstChild).toHaveClass('light');
    
    // Click again
    await user.click(toggleButton);
    
    // Should be dark again
    expect(container.firstChild).not.toHaveClass('light');
  });

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    const toggleButton = screen.getByLabelText('Toggle theme');
    await user.click(toggleButton);

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('restores theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    
    const { container } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('light');
  });
});
```

### E2E Test Example (Cypress)

```javascript
describe('Theme Toggle Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('toggles theme from dark to light', () => {
    cy.get('[aria-label="Toggle theme"]').click();
    cy.get('html').should('have.class', 'light');
    cy.get('[aria-label="Toggle theme"]').should('contain', '☀️');
  });

  it('persists theme preference', () => {
    cy.get('[aria-label="Toggle theme"]').click();
    cy.reload();
    cy.get('html').should('have.class', 'light');
  });

  it('works across multiple pages', () => {
    cy.get('[aria-label="Toggle theme"]').click();
    cy.visit('http://localhost:8080/dashboard');
    cy.get('html').should('have.class', 'light');
  });
});
```

---

## 📊 Test Results Template

```
TEST EXECUTION REPORT
=====================

Date: ________________
Browser: ________________
OS: ________________
Device: ________________

BASIC FUNCTIONALITY:
✓ Toggle Visibility                [PASS/FAIL]
✓ Dark to Light Toggle             [PASS/FAIL]
✓ Light to Dark Toggle             [PASS/FAIL]
✓ Multiple Toggles                 [PASS/FAIL]

PERSISTENCE:
✓ Refresh Page - Same Theme        [PASS/FAIL]
✓ Close & Reopen Browser           [PASS/FAIL]
✓ localStorage Verification        [PASS/FAIL]
✓ Incognito Window                 [PASS/FAIL]

VISUAL:
✓ Dark Mode Colors                 [PASS/FAIL]
✓ Light Mode Colors                [PASS/FAIL]
✓ Component Rendering              [PASS/FAIL]

CROSS-PAGE:
✓ Theme Persistence Across Pages   [PASS/FAIL]
✓ Toggle on Each Page              [PASS/FAIL]

ACCESSIBILITY:
✓ Keyboard Navigation              [PASS/FAIL]
✓ Screen Reader                    [PASS/FAIL]
✓ ARIA Attributes                  [PASS/FAIL]

BROWSER COMPATIBILITY:
✓ Chrome/Edge                      [PASS/FAIL]
✓ Firefox                          [PASS/FAIL]
✓ Safari                           [PASS/FAIL]
✓ Mobile Browsers                  [PASS/FAIL]

EDGE CASES:
✓ Clear Storage                    [PASS/FAIL]
✓ Multiple Tabs                    [PASS/FAIL]
✓ System Preference Change         [PASS/FAIL]
✓ Rapid Toggling                   [PASS/FAIL]

PERFORMANCE:
✓ Load Time                        [PASS/FAIL]
✓ Memory Usage                     [PASS/FAIL]
✓ Battery Usage                    [PASS/FAIL]

CONSOLE:
✓ Console Errors                   [PASS/FAIL]
✓ localStorage Errors              [PASS/FAIL]

OVERALL RESULT: [PASS/FAIL]

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

Tester: ________________
```

---

## 🚀 Testing Best Practices

1. **Test on Real Devices**
   - Use physical phones/tablets
   - Don't rely only on browser emulation

2. **Test on Multiple Browsers**
   - Test on all major browsers
   - Test on different versions if possible

3. **Test User Workflows**
   - Simulate real user interactions
   - Test common user paths

4. **Test Edge Cases**
   - Storage issues
   - Rapid interactions
   - System preference changes

5. **Automate Repetitive Tests**
   - Use unit tests for logic
   - Use E2E tests for workflows

6. **Test Accessibility**
   - Use keyboard only
   - Test with screen readers
   - Verify ARIA attributes

---

## 📝 Test Documentation

Keep records of:
- Date tested
- Browser and version
- Operating system
- Device type
- Test results
- Any issues found
- Screenshots of failures

This helps track issues and ensures consistent testing.
