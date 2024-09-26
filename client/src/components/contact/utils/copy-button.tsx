import { FaCopy } from "react-icons/fa";

export const CopyButton = ({
  text,
  copiedText,
  onCopy,
}: {
  text: string;
  copiedText: string | null;
  onCopy: (text: string) => void;
}) => (
  <button
    className={`copy-button ${copiedText === text ? "copied" : ""}`}
    onClick={() => onCopy(text)}
  >
    {copiedText === text && <span className="copied-text">Copié</span>}
    <FaCopy size={14} color="#2196f3" className="copy-icon" />
  </button>
);
