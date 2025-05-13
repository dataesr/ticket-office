import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Text } from "@dataesr/dsfr-plus";
import { cleanResponseMessage } from "./clean-response";

const convertUrlsToMarkdownLinks = (content) => {
  if (!content) return "";

  const urlRegex = /(?<![\[\(])(https?:\/\/[^\s\)]+)(?![\]\)])/g;
  return content.replace(urlRegex, (url) => `[${url}](${url})`);
};

const preprocessContent = (content) => {
  if (!content) return "";

  let processed = content.replace(/<br\s*\/?>/gi, "\n");

  processed = processed.replace(
    /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi,
    (_, url, text) => `[${text}](${url})`
  );

  processed = cleanResponseMessage(processed);

  processed = convertUrlsToMarkdownLinks(processed);

  return processed;
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
  link({ node, ...props }) {
    return (
      <a target="_blank" rel="noopener noreferrer" {...props}>
        {props.children}
      </a>
    );
  },
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const processedContent = preprocessContent(content);
  return (
    <Text>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
        {processedContent}
      </ReactMarkdown>
    </Text>
  );
};

export default MarkdownRenderer;
