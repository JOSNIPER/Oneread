import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useEnv } from '@/context/EnvContext';
import { useSettingsStore } from '@/store/settingsStore';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useTranslation } from '@/hooks/useTranslation';
import { useCommandPalette } from '@/components/command-palette';
import { RiFontSize, RiShareLine } from 'react-icons/ri';
import { RiDashboardLine, RiTranslate } from 'react-icons/ri';
import { VscSymbolColor } from 'react-icons/vsc';
import { PiDotsThreeVerticalBold, PiRobot, PiSpeakerHigh } from 'react-icons/pi';
import { LiaHandPointerSolid } from 'react-icons/lia';
import { IoAccessibilityOutline } from 'react-icons/io5';
import { MdArrowBackIosNew, MdArrowForwardIos, MdClose } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import { getDirFromUILanguage } from '@/utils/rtl';
import { getCommandPaletteShortcut } from '@/services/environment';
import FontPanel from './FontPanel';
import LayoutPanel from './LayoutPanel';
import ColorPanel from './ColorPanel';
import IntegrationsPanel from './IntegrationsPanel';
import Dropdown from '@/components/Dropdown';
import Dialog from '@/components/Dialog';
import DialogMenu from './DialogMenu';
import ControlPanel from './ControlPanel';
import LangPanel from './LangPanel';
import MiscPanel from './MiscPanel';
import AIPanel from './AIPanel';
import TTSPanel from './TTSPanel';
import AdvancedPanel from './AdvancedPanel';
import { LuDatabase } from 'react-icons/lu';

export type SettingsPanelType =
  | 'Font'
  | 'Layout'
  | 'Color'
  | 'Control'
  | 'TTS'
  | 'Language'
  | 'AI'
  | 'Integrations'
  | 'Custom'
  | 'Advanced';
export type SettingsPanelPanelProp = {
  bookKey: string;
  onRegisterReset: (resetFn: () => void) => void;
};

type TabConfig = {
  tab: SettingsPanelType;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
};

const SettingsDialog: React.FC<{ bookKey: string }> = ({ bookKey }) => {
  const _ = useTranslation();
  const { appService } = useEnv();
  const closeIconSize = useResponsiveSize(16);
  const [isRtl] = useState(() => getDirFromUILanguage() === 'rtl');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const {
    setFontPanelView,
    setSettingsDialogOpen,
    activeSettingsItemId,
    setActiveSettingsItemId,
    requestedPanel,
    setRequestedPanel,
  } = useSettingsStore();
  const { open: openCommandPalette } = useCommandPalette();

  const handleOpenCommandPalette = () => {
    openCommandPalette();
    setSettingsDialogOpen(false);
  };

  const tabConfig = [
    {
      tab: 'Font',
      icon: RiFontSize,
      label: _('Font'),
    },
    {
      tab: 'Layout',
      icon: RiDashboardLine,
      label: _('Layout'),
    },
    {
      tab: 'Color',
      icon: VscSymbolColor,
      label: _('Color'),
    },
    {
      tab: 'Control',
      icon: LiaHandPointerSolid,
      label: _('Behavior'),
    },
    {
      tab: 'Language',
      icon: RiTranslate,
      label: _('Language'),
    },
    {
      tab: 'Integrations',
      icon: RiShareLine,
      label: _('Integrations'),
    },
    {
      tab: 'AI',
      icon: PiRobot,
      label: _('AI Assistant'),
      disabled: process.env.NODE_ENV === 'production',
    },
    {
      tab: 'TTS',
      icon: PiSpeakerHigh,
      label: _('TTS'),
    },
    {
      tab: 'Custom',
      icon: IoAccessibilityOutline,
      label: _('Custom'),
    },
    {
      tab: 'Advanced',
      icon: LuDatabase,
      label: _('Advanced'),
    },
  ] as TabConfig[];

  const [activePanel, setActivePanel] = useState<SettingsPanelType>(() => {
    if (requestedPanel && tabConfig.some((tab) => tab.tab === requestedPanel)) {
      return requestedPanel as SettingsPanelType;
    }
    const lastPanel = localStorage.getItem('lastConfigPanel');
    if (lastPanel && tabConfig.some((tab) => tab.tab === lastPanel)) {
      return lastPanel as SettingsPanelType;
    }
    return 'Font' as SettingsPanelType;
  });

  useEffect(() => {
    if (requestedPanel) setRequestedPanel(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetActivePanel = (tab: SettingsPanelType) => {
    setActivePanel(tab);
    setFontPanelView('main-fonts');
    localStorage.setItem('lastConfigPanel', tab);
  };

  const activePanelRef = useRef(activePanel);
  useEffect(() => {
    if (activePanelRef.current !== activePanel) {
      activePanelRef.current = activePanel;
      setFontPanelView('main-fonts');
      localStorage.setItem('lastConfigPanel', activePanel);
    }
  }, [activePanel, setFontPanelView]);

  const [resetFunctions, setResetFunctions] = useState<
    Record<SettingsPanelType, (() => void) | null>
  >({
    Font: null,
    Layout: null,
    Color: null,
    Control: null,
    TTS: null,
    Language: null,
    AI: null,
    Integrations: null,
    Custom: null,
    Advanced: null,
  });

  const registerResetFunction = (panel: SettingsPanelType, resetFn: () => void) => {
    setResetFunctions((prev) => ({ ...prev, [panel]: resetFn }));
  };

  const handleResetCurrentPanel = () => {
    const resetFn = resetFunctions[activePanel];
    if (resetFn) {
      resetFn();
    }
  };

  const handleClose = () => {
    setSettingsDialogOpen(false);
  };

  // handle activeSettingsItemId: switch to correct panel and scroll to item
  useEffect(() => {
    if (!activeSettingsItemId) return;

    const parts = activeSettingsItemId.split('.');
    if (parts.length >= 2) {
      const panelMap: Record<string, SettingsPanelType> = {
        font: 'Font',
        layout: 'Layout',
        color: 'Color',
        control: 'Control',
        tts: 'TTS',
        language: 'Language',
        ai: 'AI',
        integrations: 'Integrations',
        custom: 'Custom',
      };
      const panelKey = parts[1]?.toLowerCase();
      const targetPanel = panelMap[panelKey || ''];
      if (targetPanel && targetPanel !== activePanel) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- panel switch based on external navigation is intended
        setActivePanel(targetPanel);
      }
    }

    const timeoutId = setTimeout(() => {
      const element = panelRef.current?.querySelector(
        `[data-setting-id="${activeSettingsItemId}"]`,
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('settings-highlight');
        setTimeout(() => element.classList.remove('settings-highlight'), 2000);
      }
      setActiveSettingsItemId(null);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeSettingsItemId, activePanel, setActiveSettingsItemId]);

  useEffect(() => {
    setFontPanelView('main-fonts');
  }, [setFontPanelView]);

  const currentPanel = tabConfig.find((tab) => tab.tab === activePanel);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const windowControls = (
    <div className='flex h-full items-center justify-end gap-x-2'>
      <button
        onClick={handleOpenCommandPalette}
        aria-label={_('Search Settings')}
        title={`${_('Search Settings')} (${getCommandPaletteShortcut()})`}
        className='btn btn-ghost flex h-8 min-h-8 w-8 items-center justify-center p-0'
      >
        <FiSearch />
      </button>
      <Dropdown
        label={_('Settings Menu')}
        className='dropdown-bottom dropdown-end'
        buttonClassName='btn btn-ghost h-8 min-h-8 w-8 p-0 flex items-center justify-center'
        toggleButton={<PiDotsThreeVerticalBold />}
      >
        <DialogMenu
          bookKey={bookKey}
          activePanel={activePanel}
          onReset={handleResetCurrentPanel}
          resetLabel={
            currentPanel ? _('Reset {{settings}}', { settings: currentPanel.label }) : undefined
          }
        />
      </Dropdown>
      <button
        onClick={handleClose}
        aria-label={_('Close')}
        className={'bg-base-300/65 btn btn-ghost btn-circle hidden h-6 min-h-6 w-6 p-0 sm:flex'}
      >
        <MdClose size={closeIconSize} />
      </button>
    </div>
  );

  // Mobile: render horizontal tab strip (original behavior)
  const mobileHeader = isMobile ? (
    <div className='flex w-full flex-col items-center'>
      <div className='-mt-2 flex w-full items-center justify-center pb-2 sm:hidden'>
        <button
          tabIndex={-1}
          aria-label={_('Close')}
          onClick={handleClose}
          className={
            'btn btn-ghost btn-circle absolute left-3 flex h-8 min-h-8 w-8 hover:bg-transparent focus:outline-none'
          }
        >
          {isRtl ? <MdArrowForwardIos /> : <MdArrowBackIosNew />}
        </button>
        <div className='tab-title flex text-base font-semibold'>{currentPanel?.label || ''}</div>
        <div className='absolute right-3'>{windowControls}</div>
      </div>
      <div
        role='group'
        aria-label={_('Settings Panels')}
        className='dialog-tabs ms-1 flex h-10 w-full items-center gap-1 overflow-x-auto sm:ms-0'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabConfig
          .filter((t) => !t.disabled)
          .map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              data-tab={tab}
              tabIndex={0}
              title={label}
              className={clsx(
                'btn btn-ghost text-base-content btn-sm gap-1 px-2',
                activePanel === tab ? 'btn-active' : '',
              )}
              onClick={() => handleSetActivePanel(tab)}
            >
              <Icon className='mr-0' />
            </button>
          ))}
      </div>
    </div>
  ) : null;

  // Desktop: simple header with title + controls
  const desktopHeader = !isMobile ? (
    <div className='flex w-full items-center justify-between'>
      <div className='text-base-content text-sm font-medium ps-1'>{_('Settings')}</div>
      <div className='hidden sm:flex'>{windowControls}</div>
    </div>
  ) : null;

  return (
    <Dialog
      isOpen={true}
      onClose={handleClose}
      className='modal-open !z-[10050]'
      bgClassName={bookKey ? 'sm:!bg-black/20' : 'sm:!bg-black/50'}
      boxClassName={clsx(
        'overflow-hidden not-eink:bg-base-200',
        // Desktop: wider dialog to accommodate sidebar + content
        'sm:min-w-[720px] sm:max-w-[900px] sm:w-2/3',
        appService?.isMobile && 'sm:max-w-[90%] sm:w-3/4',
      )}
      snapHeight={appService?.isMobile ? 0.7 : undefined}
      useOverlayScroll
      header={mobileHeader || desktopHeader}
      // On desktop, disable the default OverlayScroll for the outer dialog
      // because the content panel handles its own scrolling
      contentClassName={!isMobile ? 'overflow-hidden !px-0 !my-0' : undefined}
    >
      {isMobile ? (
        // Mobile: just render the panel content (tabs are in header)
        <div
          ref={panelRef}
          role='group'
          aria-label={`${_(currentPanel?.label || '')} - ${_('Settings')}`}
        >
          {activePanel === 'Font' && (
            <FontPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Font', fn)}
            />
          )}
          {activePanel === 'Layout' && (
            <LayoutPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Layout', fn)}
            />
          )}
          {activePanel === 'Color' && (
            <ColorPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Color', fn)}
            />
          )}
          {activePanel === 'Control' && (
            <ControlPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Control', fn)}
            />
          )}
          {activePanel === 'TTS' && (
            <TTSPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('TTS', fn)}
            />
          )}
          {activePanel === 'Language' && (
            <LangPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Language', fn)}
            />
          )}
          {activePanel === 'AI' && <AIPanel />}
          {activePanel === 'Integrations' && <IntegrationsPanel />}
          {activePanel === 'Custom' && (
            <MiscPanel
              bookKey={bookKey}
              onRegisterReset={(fn) => registerResetFunction('Custom', fn)}
            />
          )}
          {activePanel === 'Advanced' && <AdvancedPanel />}
        </div>
      ) : (
        // Desktop: left sidebar + right content
        <div className='flex h-full min-h-0'>
          {/* Left sidebar navigation */}
          <nav
            className='settings-sidebar bg-base-100/50 flex w-[180px] min-w-[180px] flex-col border-r border-base-300 py-2'
            aria-label={_('Settings Panels')}
          >
            {tabConfig
              .filter((t) => !t.disabled)
              .map(({ tab, icon: Icon, label }) => (
                <button
                  key={tab}
                  data-tab={tab}
                  tabIndex={0}
                  className={clsx(
                    'settings-sidebar-item mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    activePanel === tab
                      ? 'settings-sidebar-item-active bg-base-300 text-base-content font-medium'
                      : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
                  )}
                  onClick={() => handleSetActivePanel(tab)}
                >
                  <Icon className='shrink-0 text-base' />
                  <span className='truncate'>{label}</span>
                </button>
              ))}
          </nav>

          {/* Right content area */}
          <div
            ref={panelRef}
            role='group'
            aria-label={`${_(currentPanel?.label || '')} - ${_('Settings')}`}
            className='settings-panel-content flex-1 overflow-y-auto px-6 py-4'
          >
            <div className='mb-4 text-base font-semibold text-base-content'>
              {currentPanel?.label || ''}
            </div>
            {activePanel === 'Font' && (
              <FontPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Font', fn)}
              />
            )}
            {activePanel === 'Layout' && (
              <LayoutPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Layout', fn)}
              />
            )}
            {activePanel === 'Color' && (
              <ColorPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Color', fn)}
              />
            )}
            {activePanel === 'Control' && (
              <ControlPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Control', fn)}
              />
            )}
            {activePanel === 'TTS' && (
              <TTSPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('TTS', fn)}
              />
            )}
            {activePanel === 'Language' && (
              <LangPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Language', fn)}
              />
            )}
            {activePanel === 'AI' && <AIPanel />}
            {activePanel === 'Integrations' && <IntegrationsPanel />}
            {activePanel === 'Custom' && (
              <MiscPanel
                bookKey={bookKey}
                onRegisterReset={(fn) => registerResetFunction('Custom', fn)}
              />
            )}
            {activePanel === 'Advanced' && <AdvancedPanel />}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default SettingsDialog;
