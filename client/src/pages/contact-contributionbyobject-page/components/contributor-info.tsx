import { Contribution } from "../../../types";
import MessagePreview from "./message-preview";

const ContributorInfo = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
}: {
  data: Contribution;
  highlightedQuery: string;
  refetch;
  allTags: string[];
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
