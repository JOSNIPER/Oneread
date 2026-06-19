import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MdCheckCircle, MdCheckCircleOutline } from 'react-icons/md';
import { LiaInfoCircleSolid } from 'react-icons/lia';
import { PiHeart, PiHeartFill } from 'react-icons/pi';

import { Book } from '@/types/book';
import { useEnv } from '@/context/EnvContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { LibraryCoverFitType, LibraryViewModeType } from '@/types/settings';
import { formatAuthors, formatDescription } from '@/utils/book';
import ReadingProgress from './ReadingProgress';
import BookCover from '@/components/BookCover';

interface BookItemProps {
  book: Book;
  mode: LibraryViewModeType;
  coverFit: LibraryCoverFitType;
  isSelectMode: boolean;
  bookSelected: boolean;
  transferProgress?: number | null;
  handleBookUpload?: (book: Book, syncBooks?: boolean) => Promise<boolean>;
  handleBookDownload?: (
    book: Book,
    options?: { redownload?: boolean; queued?: boolean },
  ) => Promise<boolean>;
  showBookDetailsModal: (book: Book) => void;
  handleToggleFavorite?: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = ({
  book,
  mode,
  coverFit,
  isSelectMode,
  bookSelected,
  showBookDetailsModal,
  handleToggleFavorite,
}) => {
  const _ = useTranslation();
  const { appService } = useEnv();
  const iconSize15 = useResponsiveSize(15);

  const [coverAspect, setCoverAspect] = useState<number | null>(null);
  useEffect(() => {
    setCoverAspect(null);
  }, [book.hash, book.metadata?.coverImageUrl, book.coverImageUrl]);

  const CELL_ASPECT_RATIO = 28 / 41;
  const fitCoverInGrid = mode === 'grid' && coverFit === 'fit' && coverAspect !== null;
  const shouldShrinkWidth = fitCoverInGrid && coverAspect! < CELL_ASPECT_RATIO;
  const bookitemMainStyle = fitCoverInGrid
    ? {
        aspectRatio: coverAspect!,
        ...(shouldShrinkWidth ? { width: `${(coverAspect! / CELL_ASPECT_RATIO) * 100}%` } : {}),
      }
    : undefined;

  return (
    <div
      role='none'
      className={clsx(
        'book-item flex',
        mode === 'grid' && 'h-full flex-col justify-end',
        mode === 'list' && 'h-28 flex-row gap-4 overflow-hidden',
        mode === 'list' ? 'library-list-item' : 'library-grid-item',
        appService?.hasContextMenu ? 'cursor-pointer' : '',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={clsx(
          'bookitem-main relative flex justify-center overflow-hidden rounded',
          !fitCoverInGrid && 'aspect-[28/41]',
          coverFit === 'crop' && 'shadow-md',
          mode === 'grid' && 'items-end',
          mode === 'list' && 'min-w-20 items-center',
        )}
        style={bookitemMainStyle}
      >
        <BookCover
          mode={mode}
          book={book}
          coverFit={coverFit}
          showSpine={false}
          imageClassName='rounded shadow-md'
          onAspectRatioChange={setCoverAspect}
        />
        {bookSelected && (
          <div className='absolute inset-0 bg-black opacity-30 transition-opacity duration-300'></div>
        )}
        {isSelectMode && (
          <div className='absolute bottom-1 right-1'>
            {bookSelected ? (
              <MdCheckCircle className='fill-blue-500' />
            ) : (
              <MdCheckCircleOutline className='fill-gray-300 drop-shadow-sm' />
            )}
          </div>
        )}
        {/* Favorite heart icon */}
        {!isSelectMode && handleToggleFavorite && (
          <button
            className='favorite-button absolute top-1 right-1 rounded-full p-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 bg-black/20 dark:bg-black/30'
            style={{ opacity: book.favorite ? 1 : undefined }}
            aria-label={book.favorite ? _('Remove from Favorites') : _('Add to Favorites')}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(book);
            }}
          >
            {book.favorite ? (
              <PiHeartFill className='text-red-500 drop-shadow-sm' size={16} />
            ) : (
              <PiHeart className='text-base-content/60 dark:text-white drop-shadow-md' size={16} />
            )}
          </button>
        )}
      </div>
      <div
        className={clsx(
          'flex w-full flex-col p-0',
          mode === 'grid' && 'pt-2',
          mode === 'list' && 'gap-2 py-0',
        )}
      >
        <div className={clsx('min-w-0 flex-1', mode === 'list' && 'flex flex-col gap-2')}>
          <h4
            className={clsx(
              'overflow-hidden text-ellipsis font-semibold',
              mode === 'grid' && 'block whitespace-nowrap text-[0.6em] text-xs',
              mode === 'list' && 'line-clamp-2 text-base',
            )}
          >
            {book.title}
          </h4>
          {mode === 'list' && (
            <p className='text-neutral-content line-clamp-1 text-sm'>
              {formatAuthors(book.author, book.primaryLanguage) || ''}
            </p>
          )}
        </div>
        {mode === 'list' && (
          <h4 className='text-neutral-content line-clamp-1 text-sm'>
            {formatDescription(book.metadata?.description)}
          </h4>
        )}
        <div
          className={clsx(
            'flex items-center',
            book.progress || book.readingStatus ? 'justify-between' : 'justify-end',
          )}
          style={{
            height: `${iconSize15}px`,
            minHeight: `${iconSize15}px`,
          }}
        >
          {(book.progress || book.readingStatus) && <ReadingProgress book={book} />}
          <div className='flex items-center justify-center gap-x-2'>
            {!appService?.isMobile && (
              <button
                aria-label={_('Show Book Details')}
                className='show-detail-button -m-2 p-2 sm:opacity-0 sm:group-hover:opacity-100'
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  showBookDetailsModal(book);
                }}
              >
                <div className='pt-[2px] sm:pt-[1px]'>
                  <LiaInfoCircleSolid size={iconSize15} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
