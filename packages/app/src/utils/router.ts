export const queryToArray = (
  query: string | string[] | null,
): string[] | null => {
  return query ? (typeof query === "string" ? query.split(",") : query) : null;
};
