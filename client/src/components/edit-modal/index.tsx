import { useId, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  ButtonGroup,
  Col,
  DismissibleTag,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  TagGroup,
  TextArea,
  TextInput,
} from "@dataesr/dsfr-plus";
import { postHeaders } from "../../config/api";
import TagSelectionModal from "./modal-select-tags";
import { EditModalProps, Inputs } from "../../types";

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
  allTags,
  apiRoute,
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

  const url = `/api/${apiRoute}/${data?.id}`;

  const handleInputChange = (
    key: keyof Inputs,
    value: Inputs[keyof Inputs]
  ) => {
    setInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const extraEntries = inputs.extra.split("\n").reduce(
        (acc, line) => {
          const [key, value] = line.split(":").map((part) => part.trim());
          if (key && value) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );

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
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Édition</ModalTitle>
        <ModalContent>
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

          <Row gutters className="fr-mb-2w">
            <Col xs={12} md={6}>
              <TextInput
                id={tagsInputId}
                type="text"
                label="Ajouter des tags"
                hint="Séparez les tags par des virgules"
                disableAutoValidation
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              {tagInput && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="fr-mt-1w"
                  onClick={handleTagInputChange}
                >
                  Valider
                </Button>
              )}
            </Col>
            <Col xs={12} md={6}>
              {inputs.tags.length > 0 && (
                <TagGroup>
                  {inputs.tags.map((tag) => (
                    <DismissibleTag
                      key={tag}
                      type="button"
                      size="sm"
                      aria-label={`Retirer le tag ${tag}`}
                      onClick={() => handleTagRemove(tag)}
                    >
                      {tag}
                    </DismissibleTag>
                  ))}
                </TagGroup>
              )}
            </Col>
          </Row>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="fr-mb-3w"
            onClick={() => setShowTagModal(true)}
          >
            Sélectionner des tags
          </Button>

          <Row gutters className="fr-mb-3w">
            <Col xs={12} md={6}>
              <TextArea
                id={extraTextareaId}
                label="Ajouter des extra"
                hint="Exemple : clé: valeur"
                disableAutoValidation
                rows={4}
                value={inputs.extra}
                onChange={(e) => handleInputChange("extra", e.target.value)}
              />
            </Col>
            <Col xs={12} md={6}>
              <TextArea
                id={commentTextareaId}
                label="Commentaire"
                hint="Ajouter un commentaire"
                disableAutoValidation
                rows={4}
                value={inputs.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
              />
            </Col>
          </Row>

          <ButtonGroup align="right" isReversed>
            <Button type="button" onClick={handleSubmit}>
              Enregistrer
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>

      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
        onClose={(selectedTags) => {
          setInputs((prev) => ({
            ...prev,
            tags: [...new Set([...prev.tags, ...selectedTags])],
          }));
          setShowTagModal(false);
        }}
      />
    </>
  );
};

export default EditModal;
