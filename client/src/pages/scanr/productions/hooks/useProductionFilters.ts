import { useState } from "react";
import { useLocation } from "react-router-dom";

type FilterUpdates = {
  newStatus?: string;
  newQuery?: string[];
  newPage?: number;
  newSort?: string;
};

export const useProductionFilters = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialQuery = urlParams.get("query") || "";

  const [sort, setSortState] = useState("DESC");
  const [status, setStatusState] = useState(urlParams.get("status") || "new");
  const [query, setQuery] = useState<string[]>(
    initialQuery ? initialQuery.split(",") : []
  );
  const [page, setPageState] = useState(parseInt(urlParams.get("page") || "1"));

  const updateUrlAndState = (params: FilterUpdates) => {
    if (params.newStatus !== undefined) setStatusState(params.newStatus);
    if (params.newQuery !== undefined) setQuery(params.newQuery);
    if (params.newPage !== undefined) setPageState(params.newPage);
    if (params.newSort !== undefined) setSortState(params.newSort);

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", params.newPage?.toString() || page.toString());
    newSearchParams.set("query", params.newQuery?.join(",") || query.join(","));
    newSearchParams.set("status", params.newStatus || status);
    if (params.newSort) newSearchParams.set("sort", params.newSort);

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  const setStatus = (newStatus: string) =>
    updateUrlAndState({ newStatus, newPage: 1 });

  const setPage = (newPage: number) => updateUrlAndState({ newPage });

  const setSort = (newSort: string) => updateUrlAndState({ newSort });

  const addQuery = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      updateUrlAndState({ newQuery: [...query, trimmedValue], newPage: 1 });
    }
  };

  const removeQuery = (item: string) =>
    updateUrlAndState({
      newQuery: query.filter((q) => q !== item),
      newPage: 1,
    });

  return {
    sort,
    setSort,
    status,
    setStatus,
    query,
    addQuery,
    removeQuery,
    page,
    setPage,
  };
};
