export const queryToArray = (query: string | string[] | undefined): string[] | null => {
  return query ? (typeof query === 'string' ? query.split(',') : query) : null;
};
