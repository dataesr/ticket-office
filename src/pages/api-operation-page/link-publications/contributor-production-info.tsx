import { Contribute_Production } from "../../../types";
import MessagePreview from "./message-preview";

const ContributorProductionInfo = ({
  data,
  refetch,
}: {
  data: Contribute_Production;
  refetch;
}) => {
  return <MessagePreview data={data} refetch={refetch} />;
};

export default ContributorProductionInfo;
