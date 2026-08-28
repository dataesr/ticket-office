import { FaCopy } from "react-icons/fa";

export const CopyButton = ({
  text,
  copiedText,
  onCopy,
  ariaLabel,
  disabled,
}: {
  text: string;
  copiedText: string | null;
  onCopy: (text: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
}) => (
  <button
    className={`copy-button ${copiedText === text ? "copied" : ""}`}
    onClick={() => onCopy(text)}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {copiedText === text && <span className="copied-text">Copié</span>}
    <FaCopy size={14} color="#2196f3" className="copy-icon" />
  </button>
);
