import MessagePreview from "./message-preview";

const ContributorInfo = ({
  data,
  renderMessage,
  showDetails,
}: {
  data: any;
  renderMessage: any;
  showDetails: any;
}) => {
  return (
    <MessagePreview
      data={data}
      renderMessage={renderMessage}
      showDetails={showDetails}
    />
  );
};

export default ContributorInfo;
