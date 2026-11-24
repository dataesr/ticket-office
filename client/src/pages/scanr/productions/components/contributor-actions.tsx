import { useState } from "react";
import { toast } from "react-toastify";
import EditModal from "../../../../components/edit-modal";
import { useDataList } from "../data-list-context";
import { Contribute_Production } from "../../../../types";

type ContributorActionsProps = {
  contribution: Contribute_Production;
  refetch: () => void;
  allTags: string[];
};

const ContributorActions = ({
  contribution,
  refetch,
  allTags,
}: ContributorActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [idRefClicked, setIdRefClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const { dataList, setDataList } = useDataList();

  const handleExportAllClick = () => {
    setDataList((prevState) => {
      let addedToCart = false;
      const updatedList = prevState.map((item) => {
        if (item.person_id === contribution.objectId && !item.export) {
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
            ? `La publication de "${contribution.name}" a été ajoutée au panier`
            : `Les publications de "${contribution.name}" ont été ajoutées au panier`;

        toast(message, {
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });
      } else {
        toast.warn(
          `Les publications de "${contribution.name}" sont déjà dans le panier ! Ou bien, le nom est différent de celui de la contribution. Veuillez vérifier, puis les entrer à la main`,
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

  return (
    <div className="message-preview__actions fr-mb-3w">
      {contribution.id && (
        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--icon-left">
          <li>
            <a
              className={`fr-btn fr-btn--tertiary fr-btn--sm fr-icon-external-link-line ${idRefClicked ? "clicked-link" : ""}`}
              target="_blank"
              rel="noreferrer noopener external"
              href={`https://www.idref.fr/${contribution.objectId.replace("idref", "")}`}
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
              href={`https://scanr.enseignementsup-recherche.gouv.fr/authors/${contribution.objectId.replace(/\//g, "%2f")}`}
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

      <EditModal
        refetch={refetch}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={contribution}
        allTags={allTags}
        apiRoute="production"
      />
    </div>
  );
};

export default ContributorActions;
