import { useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export default function useUrl() {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSort: string = searchParams.get("sort") || "DESC"
  const currentQuery: string[] = String(searchParams.get("query") || "").split(",")
  const currentPage: number = Number(searchParams.get("page") || "1")
  const currentStatus: string = searchParams.get("status") || "choose"

  const handleSortChange = useCallback(
    (sort: "ASC" | "DESC") => {
      searchParams.set("sort", sort)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handleQueryChange = useCallback(
    (query: string) => {
      searchParams.set("query", [...currentQuery.filter((item) => item), query].join(","))
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const removeQueryItem = useCallback(
    (query: string) => {
      const removedQuery = currentQuery.filter((item) => item !== query)
      console.log("removedQuery", removedQuery)
      if (removedQuery.length === 0) searchParams.delete("query")
      else searchParams.set("query", removedQuery.join(","))
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      searchParams.set("page", page.toFixed(0))
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      searchParams.set("status", status)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const values = useMemo(() => {
    return {
      currentSort,
      handleSortChange,
      currentQuery,
      handleQueryChange,
      removeQueryItem,
      currentPage,
      handlePageChange,
      currentStatus,
      handleStatusChange,
    }
  }, [
    currentSort,
    handleSortChange,
    currentQuery,
    handleQueryChange,
    removeQueryItem,
    currentPage,
    handlePageChange,
    currentStatus,
    handleStatusChange,
  ])
  return values
}
