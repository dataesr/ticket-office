import { Contribute_Production } from "../../types";
import MessagePreview from "./message-preview";

const ContributorProductionInfo = ({
  data,
}: {
  data: Contribute_Production;
}) => {
  return <MessagePreview data={data} />;
};

export default ContributorProductionInfo;
