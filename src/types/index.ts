// Export all types from this barrel file
import type { Plugin } from 'obsidian';

// Settings types - forward declaration to avoid circular imports
export interface TemplatePluginSettings {
	enableFeature: boolean;
	exampleSetting: string;
}

// Plugin interface for components
export interface PluginWithSettings extends Plugin {
	settings: TemplatePluginSettings;
	settingsManager: any; // Use any to avoid circular reference
	saveData(data: any): Promise<void>;
}

// Re-export Obsidian types for convenience
export type {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	TAbstractFile,
	Vault,
	Notice
} from 'obsidian';
