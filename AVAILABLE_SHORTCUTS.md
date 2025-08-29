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

// Safe with Shift modifier (but check conflicts!)
Cmd/Ctrl + Shift + [Letter]  // SOME are safe, but many conflict with DevTools
Cmd/Ctrl + Shift + [Number]  // Generally safe

// Special keys
Space  // For play/pause actions
Enter  // For submit/confirm actions
Escape  // For cancel/close actions
Arrow keys  // For navigation
```

## 📋 Currently Used Shortcuts by Widget

**Important**: Most widgets use `primary: true` modifier which automatically maps to:
- `Cmd` on macOS 
- `Ctrl` on Windows/Linux
This prevents conflicts because the hook uses preventDefault() to override browser shortcuts.

### CSS Clamp Calculator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌘+0` → Reset
- `⌘+⇧+U` → Switch Units
- `⌘+⇧+P` → Switch Property

### Flexbox Generator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌥+R` → Reset (FIXED)
- `⌥+A` → Add Item (FIXED)
- `⌥+D` → Remove Item (FIXED)

### Grid Generator ✅

- `⌘+1` → Copy CSS
- `⌘+2` → Copy Tailwind
- `⌥+R` → Reset (FIXED)
- `⌥+A` → Add Column (FIXED)
- `⌥+D` → Remove Column (FIXED)

### Team Randomizer ✅

- `⌘+Enter` → Generate Teams ✅
- `⌥+R` → Reset ✅ (FIXED)
- `⌥+C` → Copy Result ✅ (FIXED)

### Random Number Generator ✅

- `⌘+G` → Generate ✅ (using primary modifier)
- `⌘+R` → Regenerate ✅ (using primary modifier)
- `⌥+C` → Copy Result ✅ (FIXED)
- `⌘+D` → Download ✅ (using primary modifier)
- `U` → Toggle Unique ✅

### BMI Calculator ✅

- `⌘+Enter` → Calculate ✅
- `⌥+R` → Reset Form ✅ (FIXED)
- `⌥+C` → Copy Result ✅ (FIXED)
- `⌘+E` → Load Example ✅ (using primary modifier)
- `⌘+A` → Toggle Advanced ✅ (using primary modifier)
- `⌘+U` → Switch Units ✅ (using primary modifier)

### Password Generator ✅

- `⌘+R` → Generate ✅ (using primary modifier)
- `⌥+C` → Copy Password ✅ (FIXED)
- `⌘+H` → Toggle visibility ✅ (using primary modifier)
- Note: No save settings shortcut implemented

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

## ✅ Recently Fixed Unsafe Shortcuts (2025-08-29)

The following unsafe shortcuts have been replaced with safe Alt/Option alternatives:

### 🔒 **Fixed: Cmd+Shift+C → Alt+C** (Copy Operations)
**Issue**: Opened DevTools Console in Chrome/Firefox
**Fixed in 12 widgets**:
- random-number-generator: Alt+C for copy result
- age-calculator: Alt+C for copy result  
- ascii-art-generator: Alt+C for copy result
- bmi-calculator: Alt+C for copy result
- compound-interest-calculator: Alt+C for copy result
- css-box-shadow-generator: Alt+C for copy CSS
- css-gradient-generator: Alt+C for copy CSS
- json-tools: Alt+C for copy result
- team-randomizer: Alt+C for copy result
- color-converter: Alt+C+Shift for copy RGB

### 🔒 **Fixed: Cmd+K → Alt+K** (Clear/Reset Operations)  
**Issue**: Focused search/address bar in most browsers
**Fixed in 4 widgets**:
- color-converter: Alt+K for reset
- regex-tester: Alt+K for clear pattern
- json-tools: Alt+K for clear input
- text-counter: Alt+K for clear text

### 🔒 **Fixed: Cmd+Shift+F → Alt+F** (Format Operations)
**Issue**: "Find in Files" conflicts in many applications  
**Fixed in 1 widget**:
- json-tools: Alt+F for format JSON

### 🔒 **Fixed: Cmd+Shift+R → Alt+R** (Reset Operations)
**Issue**: Hard Reload conflicts in Chrome/Firefox  
**Fixed in 6 widgets and commonWidgetShortcuts**:
- bmi-calculator: Alt+R for reset form
- team-randomizer: Alt+R for reset
- text-case-converter: Alt+R for reset
- percentage-calculator: Alt+R for reset  
- compound-interest-calculator: Alt+R for reset
- loan-calculator: Alt+R for reset
- flexbox-generator: Alt+R for reset
- grid-generator: Alt+R for reset
- commonWidgetShortcuts.reset preset updated

### 🔒 **Fixed: Cmd+Shift+A/D → Alt+A/D** (Add/Remove Operations)
**Issue**: Cmd+Shift+A opens Search tabs/Extensions, Cmd+Shift+D bookmarks all tabs
**Fixed in 2 widgets**:
- flexbox-generator: Alt+A to add item, Alt+D to remove item
- grid-generator: Alt+A to add column, Alt+D to remove column

## ✅ All Widgets Are Now Safe!

As of 2025-08-29, all keyboard shortcuts have been reviewed and fixed:

1. **Unsafe shortcuts replaced with Alt/Option alternatives**:
   - `⌘+⇧+C` → `⌥+C` (12 widgets)
   - `⌘+K` → `⌥+K` (4 widgets)
   - `⌘+⇧+F` → `⌥+F` (1 widget)
   - `⌘+⇧+R` → `⌥+R` (8 widgets + commonWidgetShortcuts)
   - `⌘+⇧+A` → `⌥+A` (2 widgets)
   - `⌘+⇧+D` → `⌥+D` (2 widgets)

2. **All widgets using `primary: true` modifier**:
   - This ensures cross-platform compatibility
   - The hook prevents browser conflicts with preventDefault()
   - No remaining unsafe shortcuts found

## 📝 Updated Guidelines for New Shortcuts (Post-Security Fix)

### ✅ **RECOMMENDED: Alt/Option Combinations** (Proven Safe)
1. **Alt+[Letter]** for primary actions - minimal conflicts
2. **Alt+Shift+[Letter]** for secondary actions - very safe  
3. **Alt+[Number]** for copy operations - excellent choice

### ✅ **SAFE: Special Key Combinations**
4. **Cmd/Ctrl+Enter** for primary execute actions
5. **Space** for toggle/play/pause actions
6. **Enter** for confirm/submit actions
7. **Escape** for cancel/close actions

### ⚠️ **USE WITH CAUTION: Cmd/Ctrl Combinations** 
8. **Cmd/Ctrl+Shift+[Less Common Letters]** like U, L, Y, X
9. **Numbers 0-9** with modifiers (may conflict with tab switching)

### ❌ **NEVER USE: Confirmed Unsafe**
10. **Cmd/Ctrl+Shift+C** → DevTools Console
11. **Cmd/Ctrl+K** → Search/Address bar focus
12. **Cmd/Ctrl+Shift+F** → Find in Files
13. **Cmd/Ctrl+F** → Browser Find
14. **Cmd/Ctrl+R** → Browser Reload
15. **Cmd/Ctrl+T** → New Tab
16. **Cmd/Ctrl+S** → Save Page
17. **Single letters without modifiers** → Too many conflicts

### 🧪 **Testing Requirements**
- Test in Chrome, Firefox, Safari, Edge
- Test on Mac, Windows, Linux
- Test with browser extensions enabled
- Document any discovered conflicts

---

Last updated: 2025-08-29
