import { useContext, createContext, useState } from "react"
import { useLocation } from "react-router-dom"
import useUrl from "../hooks/useUrl"
import { buildURL } from "../../../api/utils/buildURL"
import ContributionData from "../../../api/contribution-api/getData"

const Context = createContext(null)

export function useVariationsContext() {
  return useContext(Context)
}

export function VariationsContext({ children }) {
  const location = useLocation()
  const { currentSort, currentQuery, currentPage, currentStatus } = useUrl()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checkedIds, setCheckedIds] = useState<Array<string>>([])

  const checkId = (id: string) => {
    checkedIds.includes(id)
      ? setCheckedIds([...checkedIds.filter((checkId) => checkId !== id)])
      : setCheckedIds([...checkedIds, id])
  }
  const checkAllIds = (ids: Array<string>) => setCheckedIds(ids)

  const url = buildURL(location, currentSort, currentStatus, currentQuery.join(" "), currentPage, null, null)
  const data = ContributionData(url)

  return (
    <Context.Provider value={{ data, selectedId, setSelectedId, checkedIds, checkId, checkAllIds }}>
      {children}
    </Context.Provider>
  )
}
