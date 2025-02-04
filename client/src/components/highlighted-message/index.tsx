import { makeLinksClickable } from "../../utils/make-links-clickable";

const HighlightedMessage = ({
  message,
  highlightedQuery,
}: {
  message: string;
  highlightedQuery: string;
}) => {
  const renderHighlightedMessage = () => {
    if (!highlightedQuery) return makeLinksClickable(message);
    const lowerCaseMessage = message?.toLowerCase();
    const lowerCaseQuery = highlightedQuery?.toLowerCase();
    const index = lowerCaseMessage?.indexOf(lowerCaseQuery);
    if (index === -1) return makeLinksClickable(message);

    const prefix = message?.substring(0, index);
    const highlight = message?.substring(
      index,
      index + highlightedQuery.length
    );
    const suffix = message?.substring(index + highlightedQuery.length);

    return (
      <>
        {makeLinksClickable(prefix)}
        <span style={{ backgroundColor: "#efcb3a" }}>{highlight}</span>
        {makeLinksClickable(suffix)}
      </>
    );
  };

  return (
    <span dangerouslySetInnerHTML={{ __html: renderHighlightedMessage() }} />
  );
};

export default HighlightedMessage;
