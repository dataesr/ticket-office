import { createContext, useCallback, useContext, useState } from "react"
import { useLocation } from "react-router-dom"

import ContributionData from "../../../api/contribution-api/getData"
import { buildURL } from "../../../api/utils/buildURL"
import useBsoConfig from "../hooks/useBsoConfig"
import useUrl from "../hooks/useUrl"

const Context = createContext(null)

export function useVariationsContext() {
  return useContext(Context)
}

export function VariationsContext({ children }) {
  const location = useLocation()
  const api = location.pathname.split("-").pop()
  const { currentSort, currentQuery, currentPage, currentStatus, currentFile, currentIndex, currentNotification } = useUrl()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checkedIds, setCheckedIds] = useState<Array<string>>([])
  const bsoConfig = useBsoConfig()

  const checkId = (id: string) => {
    checkedIds.includes(id)
      ? setCheckedIds([...checkedIds.filter((checkId) => checkId !== id)])
      : setCheckedIds([...checkedIds, id])
  }
  const checkAllIds = (ids: Array<string>) => setCheckedIds(ids)

  const url = buildURL(location, currentSort, currentStatus, currentQuery.join(" "), currentPage, null, null, "20", {
    file: currentFile,
    index: currentIndex,
    notification: currentNotification,
  })
  const data = ContributionData(url)

  const getCodeFromBSO = useCallback(
    (id: string): string => {
      if (bsoConfig?.main && Object.keys(bsoConfig.main).includes(id)) return "production"
      if (bsoConfig?.staging && Object.keys(bsoConfig.staging).includes(id)) return "staging"
      return "none"
    },
    [bsoConfig]
  )

  const getCommentsNameFromBSO = useCallback((id: string): string => bsoConfig?.main?.[id]?.commentsName, [bsoConfig])

  return (
    <Context.Provider
      value={{
        api,
        data,
        selectedId,
        setSelectedId,
        checkedIds,
        checkId,
        checkAllIds,
        getCodeFromBSO,
        getCommentsNameFromBSO,
      }}
    >
      {children}
    </Context.Provider>
  )
}
