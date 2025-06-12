# Obsidian Plugin Template

A template for creating Obsidian plugins with best practices and the obsidian-logger pre-configured.

## Features

- Pre-configured with [obsidian-logger](https://github.com/AMC-Albert/obsidian-logger) for debugging
- Clean architecture with separate classes for different concerns
- Settings management with UI
- Vault event handling
- ESBuild configuration optimized for readable stack traces
- TypeScript setup with proper types
- Follows Obsidian plugin guidelines and security best practices

## Quick Start

1. **Clone or download this template**
2. **Update plugin details:**
   - Edit `manifest.json` with your plugin details
   - Update `package.json` with your information
   - Replace this README with your plugin's documentation

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── index.ts                 # Main barrel export
├── main.ts                  # Main plugin class
├── types/
│   └── index.ts             # Type definitions barrel
├── settings/
│   ├── index.ts             # Settings barrel export
│   └── SettingsManager.ts   # Settings management and UI
├── events/
│   ├── index.ts             # Events barrel export
│   └── VaultEventHandler.ts # Vault event handling
└── utils/
    ├── index.ts             # Utils barrel export
    └── obsidian-logger/     # Logger submodule (git submodule)
```

## Barrel Exports & Alias Imports

This template uses barrel exports and "@" alias imports for clean code organization:

### Alias Imports
- `@/*` resolves to `src/*`
- `@/settings/*` resolves to `src/settings/*`
- `@/events/*` resolves to `src/events/*`
- `@/utils/*` resolves to `src/utils/*`
- `@/types` resolves to `src/types/index.ts`

### Example Usage
```typescript
// Clean imports using aliases and barrels
import { SettingsManager } from '@/settings';
import { VaultEventHandler } from '@/events';
import { initLogger, debug } from '@/utils';
import type { TemplatePluginSettings } from '@/types';

// All components can be imported from the main barrel
import { 
	TemplatePlugin,
	SettingsManager,
	VaultEventHandler,
	initLogger 
} from '@/index';
```

## Logging Levels and Usage

The template demonstrates proper usage of all four logging levels available in obsidian-logger:

#### `loggerDebug(this, message, data?)` 
- **Purpose**: Development and troubleshooting information
- **When**: Every significant code step, variable state, and execution flow
- **Example**: `loggerDebug(this, 'Loading plugin settings from storage');`
- **Best Practice**: Use for all routine operations and state tracking

#### `loggerInfo(this, message, data?)` 
- **Purpose**: Important user actions and system events  
- **When**: User interactions, successful operations, notable state changes
- **Example**: `loggerInfo(this, 'Settings successfully updated', { key, newValue });`
- **Best Practice**: Track significant business logic events and user workflows

#### `loggerWarn(this, message, data?)` 
- **Purpose**: Potentially problematic situations that don't prevent operation
- **When**: Validation concerns, deprecated usage, potential user mistakes
- **Example**: `loggerWarn(this, 'File created with spaces in name - may cause linking issues');`
- **Best Practice**: Alert about conditions that should be reviewed or corrected

#### `loggerError(this, message, data?)` 
- **Purpose**: Failures and exceptions that prevent normal operation
- **When**: Caught exceptions, failed operations, critical problems
- **Example**: `loggerError(this, 'Failed to save plugin settings to storage', { error, settings });`
- **Best Practice**: Always include error details and relevant context for debugging

**Log Level Guidelines:**
- Use structured data objects to provide context
- Include relevant IDs, paths, values, and error details
- Choose appropriate level based on operational impact
- Truncate large values in logs to prevent console spam
- Always log errors with sufficient detail for troubleshooting

## Debug-Driven Development Style

This template demonstrates a **debug-driven coding style** where debug statements serve as both human-readable documentation and optional runtime logging. This approach:

- **Eliminates duplicate comments** - Debug statements describe what code is doing
- **Provides rich context** - Include relevant data and state information  
- **Stays up-to-date** - Documentation can't get out of sync with implementation
- **Enables powerful troubleshooting** - Detailed logging available when needed

### Core Principles

**1. Debug Instead of Comments**
```typescript
// ❌ Traditional approach
// Initialize settings manager
const settings = new SettingsManager(this);
// Load settings from disk
await settings.load();

// ✅ Debug-driven approach
loggerDebug(this, 'Initializing settings manager - preparing UI components');
const settings = new SettingsManager(this);
loggerDebug(this, 'Loading saved settings from vault storage');
await settings.load();
```

**2. Include Contextual Data**
```typescript
// ❌ Limited context
loggerDebug(this, 'File processed');

// ✅ Rich context
loggerDebug(this, 'File processing completed', { 
	path: file.path,
	size: file.stat.size,
	processingTime: Date.now() - startTime
});
```

**3. Natural Language Messages**
Write debug messages as if explaining to a colleague:
```typescript
loggerDebug(this, 'Starting plugin initialization');
loggerDebug(this, 'Registering command palette entries');
loggerDebug(this, 'Setting up vault event listeners');
loggerDebug(this, 'Plugin ready - all components initialized');
```

### Logger Usage Patterns

**Class Methods (with 'this' context):**
```typescript
import { initLogger, debug, registerLoggerClass } from '@/utils';

export class MyClass {
	constructor() {
		registerLoggerClass(this, 'MyClass');
	}

	processData(data: any) {
		loggerDebug(this, 'Processing user data', { dataType: typeof data });
		// → [plugin-id] MyClass.processData: Processing user data {dataType: "object"}
	}
}
```

**Static/Utility Functions:**
```typescript
function parseDate(text: string): Date {
	loggerDebug('DateUtils', 'parseDate', 'Parsing date string', { input: text });
	// → [plugin-id] DateUtils.parseDate: Parsing date string {input: "2025-06-08"}
}
```

**Error Handling:**
```typescript
try {
	await riskyOperation();
} catch (error) {
	loggerDebug(this, 'Operation failed, attempting fallback', { error: error.message });
	return fallbackStrategy();
}
```

### Runtime Debugging

Users can control debug output via Developer Console (`Ctrl+Shift+I`):

```javascript
// Enable debugging for your plugin
window.DEBUG.enable('your-plugin-id');

// Set log levels: 'debug', 'info', 'warn', 'error'
window.DEBUG.setLevel('your-plugin-id', 'debug');

// Disable debugging
window.DEBUG.disable('your-plugin-id');
```

### Benefits

1. **Self-documenting code** - Debug statements explain execution flow
2. **Always up-to-date** - Documentation moves with the code
3. **Rich debugging** - Comprehensive logging when issues occur
4. **Cleaner codebase** - Fewer redundant comments
5. **Better troubleshooting** - Users get detailed context for issues

## Architecture

- **`main.ts`**: Entry point, initializes components and logger
- **`SettingsManager`**: Handles plugin settings and settings UI
- **`VaultEventHandler`**: Manages vault events (file create/delete/rename)
- **Logger**: Pre-configured for readable output with class/method names preserved

## Build Configuration

The `esbuild.config.mjs` is optimized to preserve class and method names for better logging:

- **Development**: No minification, inline sourcemaps
- **Production**: Minifies whitespace and syntax, but preserves identifiers for debugging

## Development Tips

1. **Register all your classes with the logger** for better debugging context
2. **Use the settings manager** for any configurable options
3. **Handle vault events** through the VaultEventHandler class
4. **Keep related functionality** in separate classes/modules

## Obsidian Plugin Guidelines Compliance

This template follows [Obsidian's Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) and security best practices:

### Code Organization
- ✅ **Organized folder structure** - Code is separated into logical folders (`settings/`, `events/`, `utils/`)
- ✅ **Use `this.app` instead of global `app`** - All code uses the plugin instance's app reference
- ✅ **Proper TypeScript types** - Strong typing throughout, avoiding `any` where possible
- ✅ **Modern JavaScript patterns** - Uses `const`/`let`, `async`/`await`, and ES6+ features

### Security Best Practices

**DOM Manipulation Security:**
```typescript
// ❌ DANGEROUS - Can execute malicious scripts
containerElement.innerHTML = `<div>${userInput}</div>`;

// ✅ SAFE - Use Obsidian's DOM helpers
const div = containerElement.createDiv();
div.setText(userInput);
```

**Type Safety:**
```typescript
// ❌ DANGEROUS - No guarantee it's actually a TFile
const file = abstractFile as TFile;
await this.app.vault.read(file);

// ✅ SAFE - Verify type before using
if (abstractFile instanceof TFile) {
	await this.app.vault.read(abstractFile);
}
```

**Avoid Unsafe Type Casting:**
```typescript
// ❌ POOR - Loses type safety
const data = response as any;
return data.someProperty;

// ✅ BETTER - Maintain type safety
interface ApiResponse {
	someProperty: string;
}
const data = response as ApiResponse;
return data.someProperty;
```

### UI Best Practices  
- ✅ **Sentence case in UI** - Settings use sentence case ("Enable feature" not "Enable Feature")
- ✅ **No "settings" in headings** - Settings tab doesn't include redundant "settings" text
- ✅ **Use Obsidian's DOM API** - Settings use `setHeading()` and `createEl()` instead of raw HTML
- ✅ **No `innerHTML`/`outerHTML`** - Uses safe DOM helpers to prevent XSS vulnerabilities

### Performance & Resource Management
- ✅ **Proper resource cleanup** - Event listeners registered with `registerEvent()`
- ✅ **Use Vault API over Adapter** - File operations use `this.app.vault` methods
- ✅ **No console logging** - Uses debug statements instead of `console.log()`
- ✅ **Efficient event handling** - Debounced operations where appropriate

### Mobile Compatibility
- ✅ **No Node.js/Electron APIs** - Only uses Obsidian and browser APIs
- ✅ **Touch-friendly UI** - Responsive design patterns
- ✅ **Modern JavaScript engines** - Compatible with mobile browsers

## License

MIT
