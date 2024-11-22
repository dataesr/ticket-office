import MessagePreview from "./message-preview";
import { ContributorProductionInfoProps } from "./types";

const ContributorProductionInfo: React.FC<ContributorProductionInfoProps> = ({
  data,
  refetch,
  allTags,
}) => {
  return <MessagePreview allTags={allTags} data={data} refetch={refetch} />;
};

export default ContributorProductionInfo;
