import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useState } from "react";
import EditModal from "../../components/edit-modal";
import ContributorRequests from "./contributor-requests";
import { useDataList } from "./data-list-context";
import { CopyButton } from "../../utils/copy-button";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import "./styles.scss";
import {
  Contribute_Production,
  MessagePreviewProductionProps,
} from "../../types";

type InfoRowProps = {
  icon: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  copyText?: string;
};

const MessagePreview = ({
  data,
  refetch,
  allTags,
  authorsData,
  landingPages,
  idrefNames,
}: MessagePreviewProductionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [idRefClicked, setIdRefClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const { dataList, setDataList } = useDataList();
  const fetchedData = idrefNames[data.objectId] || "";
  const { copiedText, copyToClipboard } = useCopyToClipboard();

  const InfoRow = ({
    icon,
    label,
    value,
    valueClassName,
    copyText,
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

  const handleExportAllClick = () => {
    setDataList((prevState) => {
      let addedToCart = false;
      const updatedList = prevState.map((item) => {
        if (item.person_id === data.objectId && !item.export) {
          addedToCart = true;
          return { ...item, export: true };
        } else {
          return item;
        }
      });

      if (addedToCart) {
        const count = dataList.filter((item) => item.export === true).length;

        const message =
          count === 1
            ? `La publication de "${data.name}" a été ajoutée au panier`
            : `Les publications de "${data.name}" ont été ajoutées au panier`;

        toast(message, {
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });
      } else {
        toast.warn(
          `Les publications de "${data.name}" sont déjà dans le panier ! Ou bien, le nom est différent de celui de la contribution. Veuillez vérifier, puis les entrer à la main`,
          {
            style: {
              backgroundColor: "#f57c00",
              color: "#fff",
            },
          }
        );
      }

      return updatedList;
    });
  };

  const formattedProductionId = data.objectId.replace(/\//g, "%2f");

  return (
    <>
      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data as unknown as Contribute_Production}
        allTags={allTags}
        dataProduction={[]}
      />

      <div className="contribution-info contribution-info--inline-copy fr-mb-2w">
        {data?.objectId && (
          <InfoRow
            icon="links-line"
            label="ID de la personne concernée"
            value={data.objectId}
            copyText={data.objectId}
          />
        )}

        <InfoRow
          icon="user-star-line"
          label="Nom sur scanR (via IdRef)"
          value={fetchedData || "Nom non existant sur scanR"}
          valueClassName={fetchedData ? "" : "fr-text-default--error"}
          copyText={fetchedData}
        />

        <InfoRow
          icon="user-line"
          label="Nom renseigné dans la contribution"
          value={data.name}
        />

        {data.email && (
          <InfoRow
            icon="mail-line"
            label="Email"
            value={data.email}
            copyText={data.email}
          />
        )}

        {data.comment && (
          <InfoRow
            icon="message-2-line"
            label={`Commentaire${data.team?.[0] ? ` (${data.team[0]})` : ""}`}
            value={data.comment}
          />
        )}
      </div>

      <div className="message-preview__actions fr-mb-3w">
        {data?.id && (
          <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left">
            <li>
              <a
                className={`fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line ${idRefClicked ? "clicked-link" : ""}`}
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://www.idref.fr/${data.objectId.replace("idref", "")}`}
                onClick={() => setIdRefClicked(true)}
              >
                Sur IdRef
              </a>
            </li>
            <li>
              <a
                className={`fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line ${scanRClicked ? "clicked-link" : ""}`}
                target="_blank"
                rel="noreferrer noopener external"
                href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${formattedProductionId}`}
                onClick={() => setScanRClicked(true)}
              >
                Sur scanR
              </a>
            </li>
          </ul>
        )}

        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left message-preview__actions-main">
          <li>
            <button
              type="button"
              className="fr-btn fr-btn--sm fr-icon-download-line"
              onClick={handleExportAllClick}
            >
              Tout exporter
            </button>
          </li>
          <li>
            <button
              type="button"
              className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-edit-line"
              onClick={() => setShowModal(true)}
            >
              Éditer la contribution
            </button>
          </li>
        </ul>
      </div>

      <ContributorRequests
        authorsData={authorsData}
        data={data}
        coloredName={data.name}
        landingPages={landingPages}
      />
    </>
  );
};

export default MessagePreview;
