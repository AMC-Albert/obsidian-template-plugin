import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { loggerDebug, loggerInfo, loggerWarn, loggerError } from '@/utils';
import type { PluginWithSettings, TemplatePluginSettings } from '@/types';

export type { TemplatePluginSettings } from '@/types';

export class SettingsManager {
	private plugin: PluginWithSettings;
	private settings: TemplatePluginSettings;

	constructor(plugin: PluginWithSettings, settings: TemplatePluginSettings) {
		this.plugin = plugin;
		this.settings = settings;
	}
	async initialize() {
		loggerDebug(this, 'Initializing settings manager - preparing UI components');
		
		loggerDebug(this, 'Registering settings tab with Obsidian app');
		this.plugin.addSettingTab(new TemplatePluginSettingTab(this.plugin.app, this.plugin));
		
		loggerDebug(this, 'Settings manager fully initialized and ready for user interactions');
	}

	getSettings(): TemplatePluginSettings {
		loggerDebug(this, 'Retrieving current settings configuration');
		return this.settings;
	}
	async updateSetting<K extends keyof TemplatePluginSettings>(
		key: K, 
		value: TemplatePluginSettings[K]
	): Promise<void> {
		loggerDebug(this, `Updating setting: ${String(key)}`, { oldValue: this.settings[key], newValue: value });
		
		// Validate setting value before applying
		if (key === 'exampleSetting' && typeof value === 'string' && value.length > 100) {
			loggerWarn(this, 'Setting value exceeds recommended length', { 
				key: String(key), 
				length: value.length, 
				maxRecommended: 100 
			});
		}
		
		try {
			this.settings[key] = value;
			this.plugin.settings[key] = value;
			
			loggerDebug(this, 'Persisting updated settings to storage');
			await this.plugin.saveData(this.plugin.settings);
			loggerDebug(this, 'Setting update completed successfully');
			
			loggerInfo(this, 'Setting successfully updated', { 
				key: String(key), 
				newValue: typeof value === 'string' && value.length > 50 ? `${value.substring(0, 50)}...` : value 
			});
		} catch (updateError) {
			loggerError(this, 'Failed to update plugin setting', { 
				key: String(key), 
				error: updateError instanceof Error ? updateError.message : String(updateError),
				attemptedValue: value 
			});
			throw updateError;
		}
	}
}

class TemplatePluginSettingTab extends PluginSettingTab {
	plugin: PluginWithSettings;

	constructor(app: App, plugin: PluginWithSettings) {
		super(app, plugin);
		this.plugin = plugin;
	}
	display(): void {
		loggerDebug(this, 'Rendering settings tab UI - building user interface elements');
		const { containerEl } = this;

		loggerDebug(this, 'Clearing existing settings container content');
		containerEl.empty();

		loggerDebug(this, 'Creating enable feature toggle setting');
        new Setting(containerEl)
			.setName('Enable feature')
			.setDesc('Enable the main feature of this plugin.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableFeature)
				.onChange(async (value) => {
					loggerDebug(this, 'User toggled feature enable setting', { newValue: value });
					await this.plugin.settingsManager.updateSetting('enableFeature', value);
				}));

		loggerDebug(this, 'Creating example text input setting');
		new Setting(containerEl)
			.setName('Example setting')
			.setDesc('An example text setting.')
			.addText(text => text
				.setPlaceholder('Enter some text')
				.setValue(this.plugin.settings.exampleSetting)
				.onChange(async (value) => {
					loggerDebug(this, 'User modified example setting text', { newValue: value });
					await this.plugin.settingsManager.updateSetting('exampleSetting', value);
				}));
		
		loggerDebug(this, 'Settings tab UI rendering completed - all controls configured');
	}
}
