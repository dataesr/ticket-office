import { Contribution } from "../../types";
import MessagePreview from "./message-preview";

const ContributorInfo = ({
  data,
  highlightedQuery,
}: {
  data: Contribution;
  highlightedQuery: string;
}) => {
  return <MessagePreview data={data} highlightedQuery={highlightedQuery} />;
};

export default ContributorInfo;
