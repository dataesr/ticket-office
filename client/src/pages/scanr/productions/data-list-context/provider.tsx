import { useState } from "react";
import { DataListContext } from ".";
import { ContributionData } from "../../../../types";

export const DataListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dataList, setDataList] = useState<ContributionData[]>([]);

  return (
    <DataListContext.Provider value={{ dataList, setDataList }}>
      {children}
    </DataListContext.Provider>
  );
};
