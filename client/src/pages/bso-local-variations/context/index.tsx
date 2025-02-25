import { useContext, createContext, useState } from "react"

const Context = createContext(null)

export function useVariationsContext() {
  return useContext(Context)
}

export function VariationsContext({ children }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checkedIds, setCheckedIds] = useState<Array<string>>([])

  const checkId = (id: string) => {
    checkedIds.includes(id)
      ? setCheckedIds([...checkedIds.filter((checkId) => checkId !== id)])
      : setCheckedIds([...checkedIds, id])
  }
  const checkAllIds = (ids: Array<string>) => setCheckedIds(ids)

  return (
    <Context.Provider value={{ selectedId, setSelectedId, checkedIds, checkId, checkAllIds }}>{children}</Context.Provider>
  )
}
