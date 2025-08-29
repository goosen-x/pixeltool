# Available Keyboard Shortcuts in PixelTool

This document lists all keyboard shortcuts organized by safety level and
potential browser conflicts.

## 🚫 Browser Conflicting Shortcuts (DO NOT USE)

These shortcuts conflict with browser/OS functionality:

### Critical Conflicts

- `Ctrl/Cmd + R` → Browser reload
- `Ctrl/Cmd + T` → New tab
- `Ctrl/Cmd + W` → Close tab
- `Ctrl/Cmd + Q` → Quit browser
- `Ctrl/Cmd + N` → New window
- `Ctrl/Cmd + O` → Open file
- `Ctrl/Cmd + S` → Save page
- `Ctrl/Cmd + P` → Print
- `Ctrl/Cmd + F` → Find
- `Ctrl/Cmd + G` → Find next
- `Ctrl/Cmd + H` → History
- `Ctrl/Cmd + L` → Address bar
- `Ctrl/Cmd + K` → Search bar (Firefox)
- `Ctrl/Cmd + D` → Bookmark
- `Ctrl/Cmd + U` → View source
- `Ctrl/Cmd + A` → Select all
- `Ctrl/Cmd + E` → Search (some browsers)
- `Ctrl/Cmd + J` → Downloads

### Function Key Conflicts

- `F1` → Help
- `F3` → Search
- `F5` → Reload
- `F11` → Fullscreen
- `F12` → Developer tools

## ✅ Safe Shortcut Patterns

### Safe Primary Patterns

```typescript
// Numbers (generally safe)
Cmd/Ctrl + 1-9  // Tab switching in browsers but acceptable for actions
Cmd/Ctrl + 0    // Reset zoom but can be overridden

// Safe with Shift modifier
Cmd/Ctrl + Shift + [Letter]  // Most are safe
Cmd/Ctrl + Shift + [Number]  // Generally safe

// Alt/Option combinations
Alt/Option + [Letter]  // Most are safe
Alt/Option + Shift + [Letter]  // Very safe

// Special keys
Space  // For play/pause actions
Enter  // For submit/confirm actions
Escape  // For cancel/close actions
Arrow keys  // For navigation
```

## 📋 Currently Used Shortcuts by Widget

### CSS Clamp Calculator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌘+0` → Reset
- `⌘+⇧+U` → Switch Units
- `⌘+⇧+P` → Switch Property

### Flexbox Generator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌘+⇧+R` → Reset
- `⌘+⇧+A` → Add Item
- `⌘+⇧+D` → Remove Item

### Grid Generator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌘+⇧+R` → Reset
- `⌘+⇧+A` → Add Column
- `⌘+⇧+D` → Remove Column

### Team Randomizer ⚠️

- `⌘+Enter` → Generate Teams ✅
- `⌘+⇧+R` → Reset ✅
- `⌘+⇧+C` → Copy Result ✅

### Random Number Generator ⚠️

- `⌘+G` → Generate ❌ (conflicts with Find Next)
- `⌘+R` → Regenerate ❌ (conflicts with Reload)
- `⌘+⇧+C` → Copy Result ✅
- `⌘+D` → Download ❌ (conflicts with Bookmark)
- `U` → Toggle Unique ❓ (might conflict with View Source)

### BMI Calculator ⚠️

- `⌘+Enter` → Calculate ✅
- `⌘+⇧+R` → Reset Form ✅
- `⌘+⇧+C` → Copy Result ✅
- `⌘+E` → Load Example ❌ (conflicts with search in some browsers)
- `⌘+A` → Toggle Advanced ❌ (conflicts with Select All)
- `⌘+U` → Switch Units ❌ (conflicts with View Source)

### Password Generator ⚠️

- `⌘+G` → Generate ❌
- `⌘+⇧+C` → Copy Password ✅
- `⌘+R` → Regenerate ❌
- `⌘+S` → Save Settings ❌ (conflicts with Save Page)

## 🔧 Type-Safe Shortcut Definition

```typescript
// Available modifier combinations
type ModifierCombination =
	| { primary: true } // Cmd on Mac, Ctrl on Windows
	| { primary: true; shift: true }
	| { primary: true; alt: true }
	| { primary: true; shift: true; alt: true }
	| { alt: true }
	| { alt: true; shift: true }
	| { shift: true }
	| {} // No modifiers (for Space, Enter, etc.)

// Safe key values
type SafeKey =
	// Numbers
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	// Letters (use carefully)
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'
	// Special keys
	| 'Enter'
	| 'Space'
	| 'Escape'
	| 'Tab'
	| 'ArrowUp'
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight'
	| 'Home'
	| 'End'
	| 'PageUp'
	| 'PageDown'
	| 'Insert'
	| 'Delete'
	| 'Backspace'

interface SafeShortcut {
	key: SafeKey
	modifiers: ModifierCombination
	action: string
}
```

## 🎯 Actually Safe Shortcuts (Browser Tested)

### ❌ NOT SAFE (Despite seeming safe)

- `⌘+1-9` → Tab switching in browsers
- `⌘+⇧+C` → DevTools console (Chrome/Firefox)
- `⌘+⇧+N` → New incognito/private window
- `⌘+⇧+R` → Hard reload (Chrome/Firefox)
- `⌘+⇧+A` → Search tabs (Firefox) / Extensions (Chrome)
- `⌘+⇧+D` → Bookmark all tabs
- `⌘+⇧+M` → Switch user (Chrome) / Responsive mode (Firefox)
- `⌘+⇧+T` → Reopen closed tab
- `⌘+⇧+I` → DevTools (Chrome/Firefox)
- `⌘+⇧+S` → Save as (some browsers)

### ✅ TRULY Safe Shortcuts

#### For Primary Actions

- `⌘+Enter` → Execute/Calculate/Submit ✅
- `Space` → Play/Pause/Toggle ✅
- `Enter` → Confirm/Select ✅
- `Escape` → Cancel/Close ✅

#### For Copy Operations (Alternative approaches)

- `⌘+⇧+1` → Copy format 1 (still conflicts with some extensions)
- `⌘+⌥+C` → Copy result (Option/Alt combinations safer) - not safe
- `⌥+1`, `⌥+2`, `⌥+3` → Copy formats (macOS safe)
- Double-click to copy (UI pattern)

#### For Modifications

- `⌘+⇧+K` → Clear/Reset (safer than R) - not safe
- `⌘+⇧+X` → Cut/Remove item
- `⌘+⇧+Y` → Redo/Add item
- `⌘+⇧+U` → Toggle units ✅
- `⌘+⇧+L` → Toggle feature (safer than T)
- `⌘+⇧+O` → Options/Settings (conflicts with "Open symbols")

#### For Navigation

- `⌘+⇧+P` → Previous ✅ (but conflicts with command palette in VSCode)
- `⌘+⇧+]` → Next tab/item ✅ - not safe
- `⌘+⇧+[` → Previous tab/item ✅ - not safe
- `Arrow keys` → Move selection ✅
- `Tab` / `Shift+Tab` → Navigate fields ✅ - not safe

#### For File Operations

- `⌘+⇧+E` → Export ✅ (but conflicts with Explorer in VSCode)
- `⌘+⌥+S` → Save/Download (Alt safer)
- `⌘+⌥+E` → Export (Alt safer)

### 🎯 TRULY SAFE Patterns (Confirmed)

### ✅ SAFEST Combinations

1. **Use Alt/Option as primary modifier** (minimal conflicts)
   - `⌥+1`, `⌥+2`, `⌥+3` → Copy operations ✅
   - `⌥+C` → Copy ✅
   - `⌥+R` → Reset ✅
   - `⌥+A` → Add ✅
   - `⌥+D` → Delete ✅
   - `⌥+S` → Save ✅

2. **Safe Cmd+Shift combinations** (very limited)
   - `⌘+⇧+U` → Units/Toggle ✅
   - `⌘+⇧+X` → Cut/Remove ✅
   - `⌘+⇧+Y` → Add/Redo ✅
   - `⌘+⇧+L` → Toggle ✅

3. **Safe special keys without modifiers**
   - `Space` → Primary action ✅
   - `Enter` → Confirm ✅
   - `Escape` → Cancel ✅
   - `Delete` → Remove ✅

4. **Safe with Cmd modifier**
   - `⌘+Enter` → Execute/Submit ✅

### ❌ UNSAFE (Despite appearing safe)

- `⌘+⌥+C` → Conflicts on some systems
- `⌘+⇧+K` → Console clear in DevTools
- `⌘+⇧+[` / `⌘+⇧+]` → Tab navigation
- `⌘+⇧+\` → Multiple conflicts
- `⌘+⇧+/` → Help in various apps
- `Tab` / `Shift+Tab` → System navigation
- `Insert` → System specific conflicts
- Function keys → Too many conflicts

## 🚨 Widgets Needing Fixes

These widgets have conflicting shortcuts that need to be updated:

1. **Random Number Generator**
   - Change `⌘+G` → `⌘+Enter`
   - Change `⌘+R` → `⌘+⇧+R`
   - Change `⌘+D` → `⌘+⇧+D` or `⌘+⇧+E`
   - Change `U` → `⌘+⇧+U`

2. **BMI Calculator**
   - Keep `⌘+Enter` ✅
   - Keep `⌘+⇧+R` ✅
   - Change `⌘+E` → `⌘+⇧+E`
   - Change `⌘+A` → `⌘+⇧+A`
   - Change `⌘+U` → `⌘+⇧+U`

3. **Password Generator**
   - Change `⌘+G` → `⌘+Enter`
   - Keep `⌘+⇧+C` ✅
   - Change `⌘+R` → `⌘+⇧+R`
   - Change `⌘+S` → `⌘+⇧+S`

4. **Age Calculator**
   - Keep all (already safe)

5. **Draw Lots**
   - Change `⌘+R` → `⌘+⇧+R`

6. **JSON Tools**
   - Keep `⌘+⇧+F` ✅
   - Change `⌘+M` → `⌘+⇧+M`
   - Change `⌘+K` → `⌘+⇧+K`

## 📝 Guidelines for New Shortcuts

1. **Always prefer Shift modifier** for safety
2. **Use numbers** for copy operations (1, 2, 3...)
3. **Use Enter** for primary actions
4. **Use Space** for toggle/play/pause
5. **Avoid single letter** shortcuts without modifiers
6. **Test in multiple browsers** (Chrome, Firefox, Safari, Edge)
7. **Document any exceptions** clearly

---

Last updated: 2025-08-29
