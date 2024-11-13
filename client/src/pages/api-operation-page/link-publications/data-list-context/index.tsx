import { createContext, useState, useContext } from "react";

interface DataListContextType {
  dataList: any[];
  setDataList: React.Dispatch<React.SetStateAction<any[]>>;
}

const DataListContext = createContext<DataListContextType>({
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
