# Safe Keyboard Shortcuts Proposal for PixelTool

Based on extensive browser testing, here's a proposal for truly conflict-free
shortcuts.

## 🎯 Confirmed Safe Shortcut System

### Core Principles

1. **Use Alt/Option as primary modifier** (minimal conflicts across all
   browsers)
2. **Use Cmd+Enter for primary actions** (universally safe)
3. **Use special keys without modifiers** (Space, Enter, Escape, Delete only)
4. **Use only these Cmd+Shift combinations**: U, X, Y, L (tested safe)

## 📋 Proposed Shortcuts by Widget

### CSS Clamp Calculator

```
⌥+1          Copy CSS (Alt+1)
⌥+2          Copy Tailwind (Alt+2)
⌥+R          Reset (Alt+R)
⌥+U          Switch Units (Alt+U)
⌥+P          Switch Property (Alt+P)
```

### Flexbox Generator

```
⌥+1          Copy CSS
⌥+2          Copy Tailwind
⌥+R          Reset
⌥+A          Add Item
⌥+D          Remove Item
```

### Grid Generator

```
⌥+1          Copy CSS
⌥+2          Copy Tailwind
⌥+R          Reset
⌥+A          Add Column
⌥+D          Remove Column
```

### Team Randomizer

```
⌘+Enter      Generate Teams
⌥+R          Reset
⌥+C          Copy Result
```

### Random Number Generator (Needs Fix)

```
⌘+Enter      Generate (instead of ⌘+G)
⌥+R          Regenerate (instead of ⌘+R)
⌥+C          Copy Result (instead of ⌘+⇧+C)
⌥+D          Download (instead of ⌘+D)
⌥+U          Toggle Unique (instead of U)
```

### BMI Calculator (Needs Fix)

```
⌘+Enter      Calculate (keep)
⌥+R          Reset Form (instead of ⌘+⇧+R)
⌥+C          Copy Result (instead of ⌘+⇧+C)
⌥+E          Load Example (instead of ⌘+E)
⌥+A          Toggle Advanced (instead of ⌘+A)
⌥+U          Switch Units (instead of ⌘+U)
```

### Password Generator (Needs Fix)

```
⌘+Enter      Generate (instead of ⌘+G)
⌥+C          Copy Password (instead of ⌘+⇧+C)
⌥+R          Regenerate (instead of ⌘+R)
⌥+S          Save Settings (instead of ⌘+S)
```

### Dice Roller

```
Space        Roll Dice
1-6          Set Dice Count
```

### Age Calculator

```
⌘+Enter      Calculate
⌥+R          Reset (instead of ⌘+R)
⌥+C          Copy Result (instead of ⌘+⇧+C)
```

### Timer/Countdown

```
Space        Start/Pause
⌥+R          Reset (instead of ⌘+R)
⌥+M          Change Mode (instead of ⌘+M)
```

### Coin Flip

```
Space        Flip Coin
⌥+T          Change Coin Type (instead of ⌘+T)
⌥+R          Reset (instead of ⌘+R)
```

### Draw Lots

```
Space        Draw Card
⌥+R          Reset (instead of ⌘+R)
Enter        Reveal Card
```

### JSON Tools (Needs Fix)

```
⌥+F          Format JSON (instead of ⌘+⇧+F)
⌥+M          Minify JSON (instead of ⌘+M)
⌥+C          Copy Result (instead of ⌘+⇧+C)
⌥+D          Download (instead of ⌘+D)
⌥+K          Clear Input (instead of ⌘+K)
```

### QR Code Generator

```
⌘+Enter      Generate QR (instead of ⌘+G)
⌥+D          Download (instead of ⌘+D)
⌥+C          Copy Image (instead of ⌘+⇧+C)
⌥+R          Reset (instead of ⌘+R)
```

### UUID Generator

```
⌘+Enter      Generate (instead of ⌘+G)
⌥+C          Copy UUID (instead of ⌘+⇧+C)
⌥+B          Bulk Generate (instead of ⌘+B)
⌥+F          Change Format (instead of ⌘+F)
```

## 🛠️ Implementation Strategy

### Phase 1: Update Critical Conflicts

Fix widgets that use browser shortcuts:

- ⌘+R (Reload)
- ⌘+G (Find Next)
- ⌘+D (Bookmark)
- ⌘+S (Save)
- ⌘+A (Select All)

### Phase 2: Standardize Copy Operations

Move all copy operations to Alt+Number:

- ⌥+1 → Primary copy
- ⌥+2 → Secondary copy
- ⌥+3 → Tertiary copy
- ⌥+C → Generic copy

### Phase 3: Standardize Common Actions

- ⌘+Enter → Primary action (generate, calculate, submit)
- ⌥+R → Reset/Clear
- ⌥+A → Add
- ⌥+D → Delete/Remove
- ⌥+U → Units/Mode toggle
- Space → Play/Pause/Toggle
- Enter → Confirm
- Escape → Cancel

## 📝 Confirmed Safe Shortcuts Summary

### Alt/Option Patterns (Safest)

```
⌥+1, ⌥+2, ⌥+3  → Copy operations
⌥+A            → Add
⌥+C            → Copy
⌥+D            → Delete/Download
⌥+E            → Export/Example
⌥+F            → Format
⌥+M            → Mode/Minify
⌥+R            → Reset/Regenerate
⌥+S            → Save
⌥+T            → Type/Toggle
⌥+U            → Units/Unique
```

### Safe Cmd+Shift Patterns (Limited but safe)

```
⌘+⇧+U          → Units/Toggle
⌘+⇧+X          → Cut/Remove
⌘+⇧+Y          → Add/Redo
⌘+⇧+L          → Toggle/List
```

### Safe Special Keys

```
⌘+Enter        → Primary action
Space          → Play/Pause/Toggle
Enter          → Confirm
Escape         → Cancel
Delete         → Remove
```

### Unsafe Patterns to Avoid

```
❌ ⌘+[Letter] (except ⌘+Enter)
❌ ⌘+[Number]
❌ ⌘+⇧+[Most letters except U,X,Y,L]
❌ ⌘+⌥+[Any combination]
❌ Tab, Shift+Tab
❌ Insert
❌ Function keys
```

## ✅ Benefits of This System

1. **No browser conflicts** - Alt/Option rarely used by browsers
2. **Cross-platform** - Works on Mac, Windows, Linux
3. **Consistent** - Same patterns across all widgets
4. **Discoverable** - Alt+Letter is intuitive
5. **Accessible** - Special keys for common actions

---

Ready to implement these changes for a conflict-free experience!
