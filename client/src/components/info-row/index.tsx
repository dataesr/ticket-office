import { Col, Text } from "@dataesr/dsfr-plus";
import { CopyButton } from "../copy-button";

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
  <Col xs={12} md={6}>
    <Text size="xs" className="fr-text-mention--grey fr-mb-0">
      <span
        className={`fr-icon-${icon} fr-icon--sm fr-mr-1v`}
        aria-hidden="true"
      />
      {label}
    </Text>
    <Text size="sm" className={`fr-mb-0 ${valueClassName || ""}`}>
      {value}
      {copyText && (
        <CopyButton
          text={copyText}
          copiedText={copiedText}
          onCopy={copyToClipboard}
          ariaLabel={`Copier : ${label.toLowerCase()}`}
        />
      )}
    </Text>
  </Col>
);

export default InfoRow;
