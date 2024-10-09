export const validateQueryParams = (query: any) => {
  const { sort, page, max_results, where } = query;

  if (sort && typeof sort !== "string") {
    return false;
  }

  if (page && (!Number.isInteger(parseInt(page)) || parseInt(page) < 1)) {
    return false;
  }

  if (
    max_results &&
    (!Number.isInteger(parseInt(max_results)) || parseInt(max_results) < 1)
  ) {
    return false;
  }

  if (where) {
    try {
      JSON.parse(where);
    } catch (e) {
      return false;
    }
  }

  return true;
};
