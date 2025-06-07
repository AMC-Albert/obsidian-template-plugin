// Main barrel exports for the plugin
export { default as TemplatePlugin } from './main';
export * from '@/settings';
export * from '@/events';
export * from '@/utils';

// Re-export types explicitly to avoid conflicts
export type {
	TemplatePluginSettings,
	PluginWithSettings,
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	TAbstractFile,
	Vault,
	Notice
} from '@/types';
