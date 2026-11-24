import { Button } from "@dataesr/dsfr-plus";

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

  return (
    <Button
      type="button"
      variant="text"
      size="sm"
      icon={isCopied ? "check-line" : "clipboard-line"}
      iconPosition="left"
      onClick={() => onCopy(text)}
      title={ariaLabel || "Copier"}
      aria-label={ariaLabel || (isCopied ? "Copié" : "Copier")}
      disabled={disabled}
    >
      {isCopied ? "Copié" : undefined}
    </Button>
  );
};
