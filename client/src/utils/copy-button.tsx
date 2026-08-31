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
}) => {
  const isCopied = copiedText === text;
  const classes = [
    "fr-btn",
    "fr-btn--tertiary-no-outline",
    "fr-btn--sm",
    isCopied ? "fr-icon-check-line" : "fr-icon-clipboard-line",
  ];
  if (isCopied) classes.push("fr-btn--icon-left");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={() => onCopy(text)}
      title={ariaLabel || "Copier"}
      aria-label={ariaLabel || (isCopied ? "Copié" : "Copier")}
      disabled={disabled}
    >
      {isCopied ? "Copié" : "Copier"}
    </button>
  );
};
