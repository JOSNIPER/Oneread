// Stub: Supabase removed

// Minimal chainable mock so server-side code (e.g. shareServer.ts) compiles.
// Every query returns empty data with no error; nothing executes at runtime.
const chain: Record<string, unknown> = {};
const chainFn = () => chain;
const queryResult = { data: null, error: null };
[
  'select',
  'insert',
  'update',
  'upsert',
  'delete',
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'is',
  'in',
  'contains',
  'containedBy',
  'range',
  'order',
  'limit',
  'single',
  'maybeSingle',
  'abortSignal',
  'throwOnError',
  'filter',
  'not',
  'or',
  'match',
  'textSearch',
  'rpc',
].forEach((m) => {
  chain[m] = chainFn;
});
// make the chain thenable so `await supabase.from(...).select(...)` resolves
(chain as Record<string, unknown>)['then'] = (resolve: (v: typeof queryResult) => void) =>
  resolve(queryResult);

const mockClient = {
  from: () => chain as never,
  auth: { getUser: async () => ({ data: { user: null }, error: null }) },
  rpc: async () => ({ data: null, error: null }),
};

export const supabase = null;
export const createSupabaseClient = () => mockClient as never;
export const createSupabaseAdminClient = () => mockClient as never;
