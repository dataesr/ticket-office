import { createContext, useState, useContext } from "react";

const DataListContext = createContext<{
  dataList: any[];
  setDataList: React.Dispatch<React.SetStateAction<any[]>>;
}>({
  dataList: [],
  setDataList: () => {},
});

export const DataListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataList, setDataList] = useState<any[]>([]);

  return (
    <DataListContext.Provider value={{ dataList, setDataList }}>
      {children}
    </DataListContext.Provider>
  );
};

export const useDataList = () => {
  return useContext(DataListContext);
};
