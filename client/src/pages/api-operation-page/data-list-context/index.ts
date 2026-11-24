import { createContext, useContext } from "react";
import { ContributionData } from "../../../types";

type DataListContextType = {
  dataList: ContributionData[];
  setDataList: React.Dispatch<React.SetStateAction<ContributionData[]>>;
};

export const DataListContext = createContext<DataListContextType>({
  dataList: [],
  setDataList: () => {},
});

export const useDataList = () => useContext(DataListContext);
