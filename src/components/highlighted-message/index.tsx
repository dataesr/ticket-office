const HighlightedMessage = ({
  message,
  highlightedQuery,
}: {
  message: string;
  highlightedQuery: string;
}) => {
  const renderHighlightedMessage = () => {
    if (!highlightedQuery) return message;

    const lowerCaseMessage = message?.toLowerCase();
    const lowerCaseQuery = highlightedQuery?.toLowerCase();
    const index = lowerCaseMessage.indexOf(lowerCaseQuery);
    if (index === -1) return message;

    const prefix = message.substring(0, index);
    const highlight = message.substring(index, index + highlightedQuery.length);
    const suffix = message.substring(index + highlightedQuery.length);

    return (
      <>
        {prefix}
        <span style={{ backgroundColor: "#efcb3a" }}>{highlight}</span>
        {suffix}
      </>
    );
  };

  return <>{renderHighlightedMessage()}</>;
};

export default HighlightedMessage;
