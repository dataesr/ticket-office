import { useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export default function useUrl() {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSort: string = searchParams.get("sort") || "DESC"
  const currentQuery: string[] = String(searchParams.get("query") || "").split(",")
  const currentPage: number = Number(searchParams.get("page") || "1")
  const currentStatus: string = searchParams.get("status") || "choose"
  const currentFile: string = searchParams.get("file") || "choose"
  const currentCode: string = searchParams.get("code") || "choose"
  const currentIndex: string = searchParams.get("index") || "choose"
  const currentNotification: string = searchParams.get("notification") || "choose"

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

  const handleFileChange = useCallback(
    (file: string) => {
      searchParams.set("file", file)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handleCodeChange = useCallback(
    (code: string) => {
      searchParams.set("code", code)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handleIndexChange = useCallback(
    (index: string) => {
      searchParams.set("index", index)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const handleNotificationChange = useCallback(
    (notification: string) => {
      searchParams.set("notification", notification)
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
      currentFile,
      handleFileChange,
      currentCode,
      handleCodeChange,
      currentIndex,
      handleIndexChange,
      currentNotification,
      handleNotificationChange,
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
    currentFile,
    handleFileChange,
    currentCode,
    handleCodeChange,
    currentIndex,
    handleIndexChange,
    currentNotification,
    handleNotificationChange,
  ])
  return values
}
