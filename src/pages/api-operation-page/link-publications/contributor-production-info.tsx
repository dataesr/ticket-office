import { Contribute_Production } from "../../../types";
import MessagePreview from "./message-preview";

const ContributorProductionInfo = ({
  data,
  refetch,
  setDataList,
  dataList,
}: {
  data: Contribute_Production;
  refetch;
  setDataList;
  dataList;
}) => {
  return (
    <MessagePreview
      dataList={dataList}
      data={data}
      refetch={refetch}
      setDataList={setDataList}
    />
  );
};

export default ContributorProductionInfo;
