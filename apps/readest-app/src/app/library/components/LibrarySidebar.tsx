import clsx from 'clsx';
import React, { useState } from 'react';
import {
  LuBookOpen,
  LuStar,
  LuNotebookPen,
  LuTrash2,
  LuSettings,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu';
import { useTranslation } from '@/hooks/useTranslation';

export type LibraryViewType = 'shelf' | 'favorites' | 'notebook' | 'trash' | 'settings';

interface LibrarySidebarProps {
  activeView: LibraryViewType;
  onViewChange: (view: LibraryViewType) => void;
  bookCount: { shelf: number; favorites: number; trash: number };
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ activeView, onViewChange, bookCount }) => {
  const _ = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'shelf' as LibraryViewType,
      icon: LuBookOpen,
      label: _('Shelf'),
      count: bookCount.shelf,
    },
    {
      key: 'favorites' as LibraryViewType,
      icon: LuStar,
      label: _('Favorites'),
      count: bookCount.favorites,
    },
    {
      key: 'notebook' as LibraryViewType,
      icon: LuNotebookPen,
      label: _('Notebook'),
      count: null,
    },
    {
      key: 'trash' as LibraryViewType,
      icon: LuTrash2,
      label: _('Trash'),
      count: bookCount.trash,
    },
  ];

  const bottomMenuItems = [
    {
      key: 'settings' as LibraryViewType,
      icon: LuSettings,
      label: _('Settings'),
      count: null,
    },
  ];

  return (
    <nav
      className={clsx(
        'library-sidebar bg-base-100/50 flex flex-col border-r border-base-300 py-3 transition-all duration-200',
        collapsed ? 'w-[50px] min-w-[50px]' : 'w-[180px] min-w-[180px]',
      )}
      aria-label={_('Library Navigation')}
    >
      {/* Header with collapse toggle */}
      <div className='flex items-center justify-between px-3 pb-3'>
        {!collapsed && (
          <span className='text-xs font-medium uppercase tracking-wider text-base-content/50'>
            {_('Library')}
          </span>
        )}
        <button
          className='hover:bg-base-200 text-base-content/50 hover:text-base-content rounded-md p-1 transition-colors'
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? _('Expand Sidebar') : _('Collapse Sidebar')}
          aria-label={collapsed ? _('Expand Sidebar') : _('Collapse Sidebar')}
        >
          {collapsed ? <LuPanelLeftOpen size={16} /> : <LuPanelLeftClose size={16} />}
        </button>
      </div>

      {/* Menu items */}
      {menuItems.map(({ key, icon: Icon, label, count }) => (
        <button
          key={key}
          className={clsx(
            'mx-2 flex items-center rounded-lg py-2.5 text-left text-sm transition-colors',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            activeView === key
              ? 'bg-base-300 text-base-content font-medium'
              : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
          )}
          onClick={() => onViewChange(key)}
          title={collapsed ? label : undefined}
        >
          <Icon className='shrink-0 text-base' />
          {!collapsed && (
            <>
              <span className='flex-1 truncate'>{label}</span>
              {count !== null && count > 0 && (
                <span className='text-base-content/50 text-xs'>{count}</span>
              )}
            </>
          )}
        </button>
      ))}

      {/* Bottom section */}
      <div className='flex-1' />
      <hr className='border-base-300 mx-4 my-1' />
      {bottomMenuItems.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          className={clsx(
            'mx-2 flex items-center rounded-lg py-2.5 text-left text-sm transition-colors',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            activeView === key
              ? 'bg-base-300 text-base-content font-medium'
              : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
          )}
          onClick={() => onViewChange(key)}
          title={collapsed ? label : undefined}
        >
          <Icon className='shrink-0 text-base' />
          {!collapsed && <span className='flex-1 truncate'>{label}</span>}
        </button>
      ))}
    </nav>
  );
};

export default LibrarySidebar;
