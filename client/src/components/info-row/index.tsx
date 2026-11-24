import { CopyButton } from "../copy-button";
import "./styles.scss";

type InfoRowProps = {
  icon: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  copyText?: string;
  copiedText: string | null;
  copyToClipboard: (text: string) => void;
};

const InfoRow = ({
  icon,
  label,
  value,
  valueClassName,
  copyText,
  copiedText,
  copyToClipboard,
}: InfoRowProps) => (
  <div
    className={`contribution-info__row${copyText ? " contribution-info__row--pinned" : ""}`}
  >
    <span
      className={`fr-icon-${icon} contribution-info__icon`}
      aria-hidden="true"
    />
    <div className="contribution-info__text">
      <p className="fr-text--xs fr-text-mention--grey fr-mb-0">{label}</p>
      <p
        className={`fr-text--sm fr-mb-0 contribution-info__value ${valueClassName || ""}`}
      >
        <span className="contribution-info__value-text">{value}</span>
        {copyText && (
          <CopyButton
            text={copyText}
            copiedText={copiedText}
            onCopy={copyToClipboard}
            ariaLabel={`Copier : ${label.toLowerCase()}`}
          />
        )}
      </p>
    </div>
  </div>
);

export default InfoRow;
