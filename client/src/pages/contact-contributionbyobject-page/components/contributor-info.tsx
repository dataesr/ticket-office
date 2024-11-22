import { ContributorInfoProps } from "../types";
import MessagePreview from "./message-preview";

const ContributorInfo: React.FC<ContributorInfoProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
}) => {
  return (
    <MessagePreview
      data={data}
      allTags={allTags}
      refetch={refetch}
      highlightedQuery={highlightedQuery}
    />
  );
};

export default ContributorInfo;
