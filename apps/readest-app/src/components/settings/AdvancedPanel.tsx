import React, { useState } from 'react';
import { isTauriAppPlatform } from '@/services/environment';
import { useEnv } from '@/context/EnvContext';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from '@/hooks/useTranslation';
import { saveSysSettings } from '@/helpers/settings';
import { BoxedList, SettingsSwitchRow, SettingsRow } from './primitives';
import { setBackupDialogVisible } from '@/app/library/components/BackupWindow';
import { setCacheManagerDialogVisible } from '@/app/library/components/CacheManagerWindow';
import { setMigrateDataDirDialogVisible } from '@/app/library/components/MigrateDataWindow';
import { type AppLockDialogMode, useAppLockStore } from '@/store/appLockStore';

const AdvancedPanel: React.FC = () => {
  const _ = useTranslation();
  const { envConfig, appService } = useEnv();
  const { settings } = useSettingsStore();
  const { openDialog: openAppLockDialogInStore } = useAppLockStore();

  const [isRefreshingMetadata, setIsRefreshingMetadata] = useState(false);
  const [refreshMetadataProgress, setRefreshMetadataProgress] = useState('');
  const [isAutoImportBooksOnOpen, setIsAutoImportBooksOnOpen] = useState(
    settings.autoImportBooksOnOpen,
  );
  const [isOpenLastBooks, setIsOpenLastBooks] = useState(settings.openLastBooks);
  const isPinEnabled = !!settings.pinCodeEnabled;

  const openAppLockDialog = (mode: AppLockDialogMode) => {
    openAppLockDialogInStore(mode);
  };

  const toggleAutoImportBooksOnOpen = () => {
    const newValue = !settings.autoImportBooksOnOpen;
    saveSysSettings(envConfig, 'autoImportBooksOnOpen', newValue);
    setIsAutoImportBooksOnOpen(newValue);
  };

  const toggleOpenLastBooks = () => {
    const newValue = !settings.openLastBooks;
    saveSysSettings(envConfig, 'openLastBooks', newValue);
    setIsOpenLastBooks(newValue);
  };

  const handleBackupRestore = () => {
    setBackupDialogVisible(true);
  };

  const handleSetRootDir = () => {
    setMigrateDataDirDialogVisible(true);
  };

  const handleManageCache = () => {
    setCacheManagerDialogVisible(true);
  };

  const handleRefreshMetadata = async () => {
    if (!appService || isRefreshingMetadata) return;
    setIsRefreshingMetadata(true);
    setRefreshMetadataProgress(_('Loading library...'));
    try {
      const books = await appService.loadLibraryBooks();
      const activeBooks = books.filter((b) => !b.deletedAt);
      let refreshed = 0;
      for (let i = 0; i < activeBooks.length; i++) {
        setRefreshMetadataProgress(`${i + 1} / ${activeBooks.length}`);
        try {
          if (await appService.refreshBookMetadata(activeBooks[i]!)) {
            refreshed++;
          }
        } catch {
          // Skip books whose files can't be opened
        }
      }
      await appService.saveLibraryBooks(books);
      setRefreshMetadataProgress(_('{{count}} books refreshed', { count: refreshed }));
      setTimeout(() => {
        setIsRefreshingMetadata(false);
        setRefreshMetadataProgress('');
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh metadata:', error);
      setRefreshMetadataProgress(_('Failed to refresh metadata'));
      setTimeout(() => {
        setIsRefreshingMetadata(false);
        setRefreshMetadataProgress('');
      }, 2000);
    }
  };

  return (
    <div className='my-4 w-full space-y-6'>
      {/* Startup */}
      {isTauriAppPlatform() && (
        <BoxedList title={_('Startup')}>
          {isTauriAppPlatform() && !appService?.isMobile && (
            <SettingsSwitchRow
              label={_('Auto Import on File Open')}
              checked={isAutoImportBooksOnOpen}
              onChange={toggleAutoImportBooksOnOpen}
            />
          )}
          {isTauriAppPlatform() && (
            <SettingsSwitchRow
              label={_('Open Last Book on Start')}
              checked={isOpenLastBooks}
              onChange={toggleOpenLastBooks}
            />
          )}
        </BoxedList>
      )}

      {/* Data Management */}
      <BoxedList title={_('Data Management')}>
        <SettingsRow
          label={_('Backup & Restore')}
          description={_('Export or import your library data and settings')}
        >
          <button className='btn btn-ghost btn-sm text-primary' onClick={handleBackupRestore}>
            {_('Open')}
          </button>
        </SettingsRow>
        {appService?.canCustomizeRootDir && (
          <SettingsRow
            label={_('Change Data Location')}
            description={_('Move your data folder to a different location')}
          >
            <button className='btn btn-ghost btn-sm text-primary' onClick={handleSetRootDir}>
              {_('Change')}
            </button>
          </SettingsRow>
        )}
        <SettingsRow
          label={_('Refresh Metadata')}
          description={
            refreshMetadataProgress || _('Re-scan book files to update cover and title info')
          }
          disabled={isRefreshingMetadata}
        >
          <button
            className='btn btn-ghost btn-sm text-primary'
            onClick={handleRefreshMetadata}
            disabled={isRefreshingMetadata}
          >
            {isRefreshingMetadata ? _('Working…') : _('Refresh')}
          </button>
        </SettingsRow>
        {appService?.isMobileApp && (
          <SettingsRow
            label={_('Manage Cache')}
            description={_('Clear cached data to free up space')}
          >
            <button className='btn btn-ghost btn-sm text-primary' onClick={handleManageCache}>
              {_('Open')}
            </button>
          </SettingsRow>
        )}
      </BoxedList>

      {/* Security */}
      <BoxedList title={_('Security')}>
        {!isPinEnabled && (
          <SettingsRow
            label={_('Set PIN')}
            description={_('Require a 4-digit PIN to open OneRead')}
          >
            <button
              className='btn btn-ghost btn-sm text-primary'
              onClick={() => openAppLockDialog('set')}
            >
              {_('Set')}
            </button>
          </SettingsRow>
        )}
        {isPinEnabled && (
          <SettingsRow label={_('Change PIN')} description={_('Update your existing PIN')}>
            <button
              className='btn btn-ghost btn-sm text-primary'
              onClick={() => openAppLockDialog('change')}
            >
              {_('Change')}
            </button>
          </SettingsRow>
        )}
        {isPinEnabled && (
          <SettingsRow label={_('Disable PIN')} description={_('Remove PIN protection')}>
            <button
              className='btn btn-ghost btn-sm text-primary'
              onClick={() => openAppLockDialog('disable')}
            >
              {_('Disable')}
            </button>
          </SettingsRow>
        )}
      </BoxedList>
    </div>
  );
};

export default AdvancedPanel;
