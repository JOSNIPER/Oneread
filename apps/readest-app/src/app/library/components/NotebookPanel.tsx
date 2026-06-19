import React, { useEffect, useState, useMemo } from 'react';
import { Book } from '@/types/book';
import { BookNote } from '@/types/book';
import { useEnv } from '@/context/EnvContext';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'next/navigation';
import { navigateToReader } from '@/utils/nav';
import {
  LuSearch,
  LuBookmark,
  LuHighlighter,
  LuQuote,
  LuChevronRight,
  LuFileText,
} from 'react-icons/lu';

interface NotebookPanelProps {
  libraryBooks: Book[];
}

interface BookWithNotes {
  book: Book;
  notes: BookNote[];
}

const NOTE_TYPE_ICONS = {
  bookmark: LuBookmark,
  annotation: LuHighlighter,
  excerpt: LuQuote,
};

const HIGHLIGHT_COLORS: Record<string, string> = {
  red: 'bg-red-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-400',
  blue: 'bg-blue-400',
  violet: 'bg-violet-400',
};

const NotebookPanel: React.FC<NotebookPanelProps> = ({ libraryBooks }) => {
  const { appService } = useEnv();
  const { settings } = useSettingsStore();
  const router = useRouter();
  const [booksWithNotes, setBooksWithNotes] = useState<BookWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'annotation' | 'bookmark' | 'excerpt'>(
    'all',
  );

  // Load notes from all books
  useEffect(() => {
    const loadAllNotes = async () => {
      if (!appService) return;
      setLoading(true);
      const results: BookWithNotes[] = [];

      for (const book of libraryBooks) {
        try {
          const config = await appService.loadBookConfig(book, settings);
          const notes = (config?.booknotes ?? []).filter((n) => !n.deletedAt && (n.text || n.note));
          if (notes.length > 0) {
            results.push({ book, notes });
          }
        } catch {
          // Skip books that fail to load
        }
      }

      // Sort by most recent note
      results.sort((a, b) => {
        const maxA = Math.max(...a.notes.map((n) => n.updatedAt || n.createdAt));
        const maxB = Math.max(...b.notes.map((n) => n.updatedAt || n.createdAt));
        return maxB - maxA;
      });

      setBooksWithNotes(results);
      setLoading(false);
    };

    loadAllNotes();
  }, [libraryBooks, settings]);

  // Filter and search
  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return booksWithNotes
      .map(({ book, notes }) => {
        let filtered = notes;
        if (filterType !== 'all') {
          filtered = filtered.filter((n) => n.type === filterType);
        }
        if (query) {
          filtered = filtered.filter(
            (n) =>
              (n.text && n.text.toLowerCase().includes(query)) ||
              (n.note && n.note.toLowerCase().includes(query)),
          );
        }
        return { book, notes: filtered };
      })
      .filter(({ notes }) => notes.length > 0);
  }, [booksWithNotes, searchQuery, filterType]);

  const totalNotes = booksWithNotes.reduce((sum, b) => sum + b.notes.length, 0);
  const totalBooks = booksWithNotes.length;

  const toggleBook = (hash: string) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(hash)) {
        next.delete(hash);
      } else {
        next.add(hash);
      }
      return next;
    });
  };

  const handleNoteClick = (book: Book, _note: BookNote) => {
    // Navigate to the reader with the book and note location
    navigateToReader(router, [book.hash]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-base-content/50 text-sm'>加载笔记中...</div>
      </div>
    );
  }

  if (totalNotes === 0) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-4'>
        <LuFileText className='text-base-content/30' size={48} />
        <div className='text-base-content/50 text-center'>
          <div className='text-base font-medium'>暂无笔记</div>
          <div className='mt-1 text-sm'>阅读时添加的标注和书签会显示在这里</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Header stats */}
      <div className='flex items-center gap-3 px-4 py-3'>
        <span className='text-base-content/60 text-sm'>
          {totalBooks} 本书 · {totalNotes} 条笔记
        </span>
      </div>

      {/* Search and filter bar */}
      <div className='flex gap-2 px-4 pb-3'>
        <div className='relative flex-1'>
          <LuSearch className='text-base-content/40 absolute left-3 top-1/2 size-4 -translate-y-1/2' />
          <input
            type='text'
            className='input input-bordered input-sm w-full pl-9'
            placeholder='搜索笔记内容...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className='select select-bordered select-sm'
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
        >
          <option value='all'>全部</option>
          <option value='annotation'>标注</option>
          <option value='bookmark'>书签</option>
          <option value='excerpt'>摘录</option>
        </select>
      </div>

      {/* Notes list */}
      <div className='flex-1 overflow-y-auto px-4 pb-4'>
        {filteredBooks.map(({ book, notes }) => (
          <div key={book.hash} className='mb-3'>
            {/* Book header */}
            <button
              className='hover:bg-base-200 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors'
              onClick={() => toggleBook(book.hash)}
            >
              <LuChevronRight
                className={`text-base-content/50 shrink-0 transition-transform ${
                  expandedBooks.has(book.hash) ? 'rotate-90' : ''
                }`}
                size={14}
              />
              <div className='min-w-0 flex-1'>
                <div className='text-sm font-medium truncate'>{book.title}</div>
                <div className='text-base-content/50 text-xs truncate'>
                  {book.author || '未知作者'} · {notes.length} 条笔记
                </div>
              </div>
            </button>

            {/* Notes for this book */}
            {expandedBooks.has(book.hash) && (
              <div className='ml-2 space-y-1 border-l-2 border-base-300 pl-3'>
                {notes
                  .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
                  .map((note) => {
                    const Icon = NOTE_TYPE_ICONS[note.type] || LuHighlighter;
                    const colorClass = note.color
                      ? HIGHLIGHT_COLORS[note.color] || 'bg-gray-400'
                      : 'bg-gray-400';

                    return (
                      <button
                        key={`${note.id}-${note.cfi}`}
                        className='hover:bg-base-200 flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors'
                        onClick={() => handleNoteClick(book, note)}
                      >
                        <div className='mt-0.5 flex shrink-0 items-center gap-1.5'>
                          {note.type === 'annotation' && note.color ? (
                            <div className={`h-3 w-3 rounded-sm ${colorClass}`} />
                          ) : (
                            <Icon className='text-base-content/50 size-3.5' />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          {note.text && (
                            <div className='text-base-content/80 line-clamp-2 text-sm'>
                              "{note.text}"
                            </div>
                          )}
                          {note.note && (
                            <div className='text-base-content/60 mt-0.5 line-clamp-1 text-xs'>
                              📝 {note.note}
                            </div>
                          )}
                          <div className='text-base-content/40 mt-1 text-xs'>
                            {formatTime(note.updatedAt || note.createdAt)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotebookPanel;
