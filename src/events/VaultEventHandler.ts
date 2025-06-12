import { TFile, TAbstractFile, Plugin } from 'obsidian';
import { loggerDebug, loggerInfo, loggerWarn, loggerError } from '@/utils';
import type { PluginWithSettings } from '@/types';

export class VaultEventHandler {
	private plugin: PluginWithSettings;

	constructor(plugin: PluginWithSettings) {
		this.plugin = plugin;
	}
	initialize() {
		loggerDebug(this, 'Setting up vault event listeners - monitoring file system changes');
		
		loggerDebug(this, 'Registering file creation event handler');
		this.plugin.registerEvent(
			this.plugin.app.vault.on('create', this.onFileCreate.bind(this))
		);

		loggerDebug(this, 'Registering file deletion event handler');
		this.plugin.registerEvent(
			this.plugin.app.vault.on('delete', this.onFileDelete.bind(this))
		);

		loggerDebug(this, 'Registering file rename event handler');
		this.plugin.registerEvent(
			this.plugin.app.vault.on('rename', this.onFileRename.bind(this))
		);

		loggerDebug(this, 'Vault event handler fully initialized - all file system events monitored');
	}

	cleanup() {
		loggerDebug(this, 'Cleaning up vault event handler - Obsidian will auto-unregister events');
	}	private onFileCreate(file: TAbstractFile) {
		if (file instanceof TFile) {
			loggerDebug(this, 'Processing file creation event', { path: file.path, extension: file.extension });
			
			if (this.plugin.settings.enableFeature) {
				loggerDebug(this, 'Feature enabled - applying creation logic to new file');
				
				// Example: Log info for significant file types
				if (file.extension === 'md') {
					loggerInfo(this, 'New markdown file created', { 
						path: file.path, 
						parentFolder: file.parent?.path || 'root' 
					});
				}
				
				// Example: Warn about potentially problematic file names
				if (file.name.includes(' ')) {
					loggerWarn(this, 'File created with spaces in name - may cause linking issues', { 
						fileName: file.name, 
						path: file.path 
					});
				}
				
				// Example: Error for restricted file patterns (hypothetical business logic)
				if (file.path.includes('/.temp/') || file.name.startsWith('temp_')) {
					loggerError(this, 'File created in restricted location or with temp naming pattern', { 
						path: file.path, 
						pattern: 'temp files not allowed in this vault configuration' 
					});
				}
			} else {
				loggerDebug(this, 'Feature disabled - skipping creation logic');
			}
		}
	}
	private onFileDelete(file: TAbstractFile) {
		if (file instanceof TFile) {
			loggerDebug(this, 'Processing file deletion event', { path: file.path });
			
			// Example: Info log for tracking important deletions
			if (file.extension === 'md' && file.stat.size > 10000) {
				loggerInfo(this, 'Large markdown file deleted', { 
					path: file.path, 
					sizeBytes: file.stat.size,
					sizeMB: (file.stat.size / (1024 * 1024)).toFixed(2)
				});
			}
			
			// Example: Warn about potentially accidental deletions
			if (file.path.startsWith('Important/') || file.name.toLowerCase().includes('backup')) {
				loggerWarn(this, 'File deleted from important location or appears to be backup', { 
					path: file.path,
					reason: 'deletion from protected area detected'
				});
			}
		}
	}
	private onFileRename(file: TAbstractFile, oldPath: string) {
		if (file instanceof TFile) {
			loggerDebug(this, 'Processing file rename event', { oldPath, newPath: file.path });
			
			// Example: Info log for significant renames
			const oldName = oldPath.split('/').pop() || '';
			const newName = file.name;
			
			if (oldName !== newName) {
				loggerInfo(this, 'File renamed with name change', { 
					oldName, 
					newName, 
					oldPath, 
					newPath: file.path 
				});
				
				// Example: Warn about potential link breakage
				if (oldName.includes(' ') && !newName.includes(' ')) {
					loggerWarn(this, 'File renamed from spaced to non-spaced name - check for broken links', { 
						oldName, 
						newName,
						suggestion: 'run link update to fix references'
					});
				}
			}
		}
	}
}
