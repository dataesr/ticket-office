import { useState } from "react";

export const useCopyToClipboard = (resetDelay = 2000) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), resetDelay);
    });
  };

  return { copiedText, copyToClipboard };
};
