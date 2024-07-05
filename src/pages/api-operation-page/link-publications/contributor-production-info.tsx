import { Contribute_Production } from "../../../types";
import MessagePreview from "./message-preview";

const ContributorProductionInfo = ({
  data,
  refetch,
  allTags,
}: {
  data: Contribute_Production;
  refetch;
  allTags;
}) => {
  return <MessagePreview allTags={allTags} data={data} refetch={refetch} />;
};

export default ContributorProductionInfo;
