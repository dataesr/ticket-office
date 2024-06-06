import { Contribute_Production } from "../../types";
import MessagePreview from "./message-preview";

const ContributorProductionInfo = ({
  data,
  refetch,
  setDataList,
}: {
  data: Contribute_Production;
  refetch;
  setDataList;
}) => {
  return (
    <MessagePreview data={data} refetch={refetch} setDataList={setDataList} />
  );
};

export default ContributorProductionInfo;
