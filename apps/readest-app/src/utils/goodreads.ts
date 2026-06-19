import { Book } from '@/types/book';

const BING_SEARCH_URL = 'https://www.bing.com/search';

/** Build a Bing search URL for an arbitrary query string. */
export const getGoodreadsSearchUrl = (query: string): string =>
  `${BING_SEARCH_URL}?q=${encodeURIComponent(query.trim())}`;

/**
 * Compose the search query for a book from its title and author.
 * The author improves match precision; it's dropped when empty.
 */
export const getBookGoodreadsQuery = (book: Pick<Book, 'title' | 'author'>): string =>
  [book.title, book.author]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
