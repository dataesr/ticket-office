import { useState } from "react";
import { useLocation } from "react-router-dom";

const updateUrlParams = (search: string, updates: Record<string, string>) => {
  const params = new URLSearchParams(search);
  Object.entries(updates).forEach(([key, value]) => params.set(key, value));
  window.history.pushState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
};

export const useContributionFilters = (withObjectType = false) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [sort, setSortState] = useState(params.get("sort") || "DESC");
  const [status, setStatusState] = useState(params.get("status") || "choose");
  const [query, setQuery] = useState(
    params.get("query")?.split(",").filter(Boolean) || []
  );
  const [page, setPageState] = useState(
    parseInt(params.get("page") || "1", 10)
  );
  const [searchInMessage, setSearchInMessageState] = useState(
    params.get("searchInMessage") !== "false"
  );
  const [highlightedQuery, setHighlightedQuery] = useState("");
  const [objectType, setObjectTypeState] = useState(
    withObjectType ? params.get("objectType") || "all" : undefined
  );

  const updateURL = (updates: Record<string, string>) =>
    updateUrlParams(location.search, updates);

  const setPage = (newPage: number) => {
    setPageState(newPage);
    updateURL({ page: newPage.toString() });
  };

  const setSort = (newSort: string) => {
    setSortState(newSort);
    updateURL({ sort: newSort });
  };

  const setStatus = (newStatus: string) => {
    setStatusState(newStatus);
    updateURL({ status: newStatus });
  };

  const setSearchInMessage = (value: boolean) => {
    setSearchInMessageState(value);
    updateURL({ searchInMessage: value.toString() });
  };

  const setObjectType = (newObjectType: string) => {
    setObjectTypeState(newObjectType);
    updateURL({ objectType: newObjectType });
  };

  const addQuery = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "" && !query.includes(trimmedValue)) {
      const newQuery = [...query, trimmedValue];
      setQuery(newQuery);
      setHighlightedQuery(trimmedValue);
      updateURL({ query: newQuery.join(",") });
    }
  };

  const removeQuery = (item: string) => {
    const newQuery = query.filter((q) => q !== item);
    setQuery(newQuery);
    updateURL({ query: newQuery.join(",") });
  };

  return {
    sort,
    setSort,
    status,
    setStatus,
    query,
    addQuery,
    removeQuery,
    highlightedQuery,
    page,
    setPage,
    searchInMessage,
    setSearchInMessage,
    objectType,
    setObjectType,
  };
};
