import { useId, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../modal";
import { DismissibleTag } from "../tag";
import { postHeaders } from "../../config/api";
import TagSelectionModal from "./modal-select-tags";
import { EditModalProps, Inputs } from "../../types";

const getBasePath = (pathname: string) => {
  if (pathname.includes("contributionPage")) return "contribute";
  if (pathname.includes("scanr-removeuser")) return "remove-user";
  if (pathname.includes("scanr-namechange")) return "update-user-data";
  if (pathname.includes("apioperations")) return "production";
  return "contacts";
};

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
  allTags,
}) => {
  const statusSelectId = useId();
  const tagsInputId = useId();
  const extraTextareaId = useId();
  const commentTextareaId = useId();

  const [showTagModal, setShowTagModal] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const selectedProfile = localStorage.getItem("selectedProfile");

  const filteredTags = Array.isArray(allTags)
    ? [
        ...new Set(
          allTags
            .flat()
            .filter((tag) => typeof tag === "string" && tag.trim() !== "")
            .map((tag) => tag.toUpperCase())
        ),
      ].sort()
    : [];

  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile || ""],
    status: "treated",
    tags: data?.tags || [],
    comment: data?.comment || "",
    extra: data?.extra
      ? Object.entries(data.extra)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
      : "",
    contributionType: data?.contributionType || "",
  });

  const url = `/api/${getBasePath(window.location.pathname)}/${data?.id}`;

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const extraEntries = inputs.extra.split("\n").reduce((acc, line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({
          ...inputs,
          team: [selectedProfile],
          extra: extraEntries,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      refetch();
      onClose();
      toast.success("Les modifications ont été enregistrées avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  const handleTagInputChange = () => {
    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim().toUpperCase())
      .filter((tag) => tag !== "");

    if (tagsArray.length > 0) {
      handleInputChange("tags", [...inputs.tags, ...tagsArray]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      inputs.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Édition">
        <div className="fr-select-group fr-mb-3w">
          <label className="fr-label" htmlFor={statusSelectId}>
            Statut
          </label>
          <select
            id={statusSelectId}
            className="fr-select"
            value={inputs.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="treated">Traité</option>
            <option value="new">Nouveau</option>
            <option value="ongoing">En traitement</option>
          </select>
        </div>

        <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-input-group">
              <label className="fr-label" htmlFor={tagsInputId}>
                Ajouter des tags
                <span className="fr-hint-text">
                  Séparez les tags par des virgules
                </span>
              </label>
              <input
                id={tagsInputId}
                type="text"
                className="fr-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
            {tagInput && (
              <button
                type="button"
                className="fr-btn fr-btn--secondary fr-btn--sm fr-mt-1w"
                onClick={handleTagInputChange}
              >
                Valider
              </button>
            )}
          </div>
          <div className="fr-col-12 fr-col-md-6">
            {inputs.tags.length > 0 && (
              <ul className="fr-tags-group">
                {inputs.tags.map((tag) => (
                  <li key={tag}>
                    <DismissibleTag onClick={() => handleTagRemove(tag)}>
                      {tag}
                    </DismissibleTag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          className="fr-btn fr-btn--secondary fr-btn--sm fr-mb-3w"
          onClick={() => setShowTagModal(true)}
        >
          Sélectionner des tags
        </button>

        <div className="fr-grid-row fr-grid-row--gutters fr-mb-3w">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-input-group">
              <label className="fr-label" htmlFor={extraTextareaId}>
                Ajouter des extra
                <span className="fr-hint-text">Exemple : clé: valeur</span>
              </label>
              <textarea
                id={extraTextareaId}
                className="fr-input"
                rows={4}
                value={inputs.extra}
                onChange={(e) => handleInputChange("extra", e.target.value)}
              />
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-input-group">
              <label className="fr-label" htmlFor={commentTextareaId}>
                Commentaire
                <span className="fr-hint-text">Ajouter un commentaire</span>
              </label>
              <textarea
                id={commentTextareaId}
                className="fr-input"
                rows={4}
                value={inputs.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
              />
            </div>
          </div>
        </div>

        <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
          <li>
            <button type="button" className="fr-btn" onClick={handleSubmit}>
              Enregistrer
            </button>
          </li>
          <li>
            <button
              type="button"
              className="fr-btn fr-btn--secondary"
              onClick={onClose}
            >
              Annuler
            </button>
          </li>
        </ul>
      </Modal>

      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
        onClose={(selectedTags) => {
          handleInputChange("tags", selectedTags);
          setShowTagModal(false);
        }}
      />
    </>
  );
};

export default EditModal;
