import { Plugin } from 'obsidian';
import { initLogger, debug, info, warn, error, registerLoggerClass } from '@/utils';
import { SettingsManager } from '@/settings';
import { VaultEventHandler } from '@/events';
import type { TemplatePluginSettings } from '@/types';

const DEFAULT_SETTINGS: TemplatePluginSettings = {
	enableFeature: true,
	exampleSetting: 'default value'
};

export default class TemplatePlugin extends Plugin {
	settings: TemplatePluginSettings;
	settingsManager: SettingsManager;
	vaultEventHandler: VaultEventHandler;	async onload() {
		debug(this, 'Initializing logger system');
		initLogger(this);
		registerLoggerClass(this, 'TemplatePlugin');

		info(this, 'Template Plugin starting initialization', { version: this.manifest.version });

		try {
			debug(this, 'Loading plugin settings from storage');
			this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

			debug(this, 'Creating settings manager and vault event handler instances');
			this.settingsManager = new SettingsManager(this, this.settings);
			this.vaultEventHandler = new VaultEventHandler(this);

			debug(this, 'Registering components with logger for enhanced debugging');
			registerLoggerClass(this.settingsManager, 'SettingsManager');
			registerLoggerClass(this.vaultEventHandler, 'VaultEventHandler');

			debug(this, 'Initializing settings manager and event handler');
			await this.settingsManager.initialize();
			this.vaultEventHandler.initialize();

			debug(this, 'Adding ribbon icon for quick plugin access');
			this.addRibbonIcon('dice', 'Template Plugin', (evt: MouseEvent) => {
				debug(this, 'User clicked ribbon icon', { mouseEvent: evt.type });
				this.handleRibbonClick();
			});

			debug(this, 'Registering template plugin command');
			this.addCommand({
				id: 'example-command',
				name: 'Example Command',
				callback: () => {
					info(this, 'User executed example command');
					this.executeExampleCommand();
				}
			});

			info(this, 'Template Plugin successfully loaded and ready', { 
				settingsLoaded: !!this.settings,
				componentsInitialized: !!(this.settingsManager && this.vaultEventHandler)
			});
		} catch (initError) {
			error(this, 'Failed to initialize Template Plugin', { 
				error: initError instanceof Error ? initError.message : String(initError),
				stack: initError instanceof Error ? initError.stack : undefined
			});
			throw initError;
		}
	}
	async onunload() {
		debug(this, 'Beginning plugin unload sequence');
		
		if (this.vaultEventHandler) {
			debug(this, 'Cleaning up vault event handler resources');
			this.vaultEventHandler.cleanup();
		}

		debug(this, 'Plugin unload completed - all resources cleaned up');
	}
	async saveSettings() {
		debug(this, 'Attempting to save settings to vault storage');
		try {
			await this.saveData(this.settings);
			info(this, 'Settings successfully saved to vault storage', { 
				settingsKeys: Object.keys(this.settings),
				enableFeature: this.settings.enableFeature 
			});
		} catch (saveError) {
			error(this, 'Failed to save plugin settings to storage', { 
				error: saveError instanceof Error ? saveError.message : String(saveError),
				settings: this.settings 
			});
			throw saveError;
		}
	}

	private handleRibbonClick() {
		debug(this, 'Processing ribbon icon click');
		
		try {
			if (!this.settings.enableFeature) {
				warn(this, 'User clicked ribbon but feature is disabled', { 
					featureEnabled: this.settings.enableFeature 
				});
				// Could show a notice to user here
				return;
			}
			
			info(this, 'Ribbon click processed successfully - feature is enabled');
			// Additional ribbon click logic would go here
		} catch (ribbonError) {
			error(this, 'Error handling ribbon click', { 
				error: ribbonError instanceof Error ? ribbonError.message : String(ribbonError) 
			});
		}
	}

	private executeExampleCommand() {
		debug(this, 'Executing example command with current settings');
		
		try {
			const activeFile = this.app.workspace.getActiveFile();
			
			if (!activeFile) {
				warn(this, 'No active file available for command execution', { 
					workspace: 'no active file in workspace' 
				});
				return;
			}
			
			info(this, 'Example command executed successfully', { 
				activeFile: activeFile.path,
				fileExtension: activeFile.extension,
				settingsEnabled: this.settings.enableFeature
			});
			
			// Example command logic would go here
		} catch (commandError) {
			error(this, 'Failed to execute example command', { 
				error: commandError instanceof Error ? commandError.message : String(commandError),
				hasActiveFile: !!this.app.workspace.getActiveFile()
			});
		}
	}
}
