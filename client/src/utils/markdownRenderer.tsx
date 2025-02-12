import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Text } from "@dataesr/dsfr-plus";
import { cleanResponseMessage } from "./clean-response";

const convertBrTagsToNewlines = (content) => {
  return content?.replace(/<br\s*\/?>/g, "\n");
};

const convertATagsToLinks = (content) => {
  return content?.replace(
    /<a\s+href="([^"]+)"\s+target="_blank"\s+rel="noopener noreferrer">([^<]+)<\/a>/g,
    (_, url, text) => `[${text}](${url})`
  );
};

const renderers = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div>
        <SyntaxHighlighter
          style={solarizedlight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children)?.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const cleanedContent = cleanResponseMessage(content);

  const processedContent = convertBrTagsToNewlines(
    convertATagsToLinks(cleanedContent)
  );

  return (
    <Text size="sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={renderers}
        skipHtml
      >
        {processedContent}
      </ReactMarkdown>
    </Text>
  );
};

export default MarkdownRenderer;
