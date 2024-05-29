import { Contribution } from "../../types";
import MessagePreview from "./message-preview";

const ContributorInfo = ({
  data,
  highlightedQuery,
  refetch,
}: {
  data: Contribution;
  highlightedQuery: string;
  refetch;
}) => {
  return (
    <MessagePreview
      data={data}
      refetch={refetch}
      highlightedQuery={highlightedQuery}
    />
  );
};

export default ContributorInfo;
