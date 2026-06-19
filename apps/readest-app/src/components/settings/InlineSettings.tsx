import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from '@/hooks/useTranslation';
import { RiFontSize, RiShareLine } from 'react-icons/ri';
import { RiDashboardLine, RiTranslate } from 'react-icons/ri';
import { VscSymbolColor } from 'react-icons/vsc';
import { PiRobot, PiSpeakerHigh } from 'react-icons/pi';
import { LiaHandPointerSolid } from 'react-icons/lia';
import { IoAccessibilityOutline } from 'react-icons/io5';
import { LuDatabase, LuInfo } from 'react-icons/lu';
import { SettingsPanelType } from './SettingsDialog';
import FontPanel from './FontPanel';
import LayoutPanel from './LayoutPanel';
import ColorPanel from './ColorPanel';
import IntegrationsPanel from './IntegrationsPanel';
import ControlPanel from './ControlPanel';
import LangPanel from './LangPanel';
import MiscPanel from './MiscPanel';
import AIPanel from './AIPanel';
import TTSPanel from './TTSPanel';
import AdvancedPanel from './AdvancedPanel';
import AboutPanel from './AboutPanel';

type TabConfig = {
  tab: SettingsPanelType | 'About';
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
};

const InlineSettings: React.FC = () => {
  const _ = useTranslation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { setFontPanelView, requestedPanel, setRequestedPanel } = useSettingsStore();

  const tabConfig = [
    { tab: 'Font' as const, icon: RiFontSize, label: _('Font') },
    { tab: 'Layout' as const, icon: RiDashboardLine, label: _('Layout') },
    { tab: 'Color' as const, icon: VscSymbolColor, label: _('Color') },
    { tab: 'Control' as const, icon: LiaHandPointerSolid, label: _('Behavior') },
    { tab: 'Language' as const, icon: RiTranslate, label: _('Language') },
    { tab: 'Integrations' as const, icon: RiShareLine, label: _('Integrations') },
    {
      tab: 'AI' as const,
      icon: PiRobot,
      label: _('AI Assistant'),
      disabled: process.env.NODE_ENV === 'production',
    },
    { tab: 'TTS' as const, icon: PiSpeakerHigh, label: _('TTS') },
    { tab: 'Custom' as const, icon: IoAccessibilityOutline, label: _('Custom') },
    { tab: 'Advanced' as const, icon: LuDatabase, label: _('Advanced') },
    { tab: 'About' as const, icon: LuInfo, label: _('About OneRead') },
  ] as TabConfig[];

  const [activePanel, setActivePanel] = useState<SettingsPanelType | 'About'>(() => {
    if (requestedPanel && tabConfig.some((tab) => tab.tab === requestedPanel)) {
      return requestedPanel as SettingsPanelType | 'About';
    }
    const lastPanel = localStorage.getItem('lastConfigPanel');
    if (lastPanel && tabConfig.some((tab) => tab.tab === lastPanel)) {
      return lastPanel as SettingsPanelType | 'About';
    }
    return 'Font';
  });

  useEffect(() => {
    if (requestedPanel) setRequestedPanel(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetActivePanel = (tab: SettingsPanelType | 'About') => {
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

  const [, setResetFunctions] = useState<Record<SettingsPanelType, (() => void) | null>>({
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

  useEffect(() => {
    setFontPanelView('main-fonts');
  }, [setFontPanelView]);

  const currentPanel = tabConfig.find((tab) => tab.tab === activePanel);
  const bookKey = ''; // No book context in library settings

  return (
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
          <TTSPanel bookKey={bookKey} onRegisterReset={(fn) => registerResetFunction('TTS', fn)} />
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
        {activePanel === 'About' && <AboutPanel />}
      </div>
    </div>
  );
};

export default InlineSettings;
