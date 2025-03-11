import { useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Button,
  Row,
  DismissibleTag,
  Text,
} from "@dataesr/dsfr-plus";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import TagSelectionModal from "./modal-select-tags";
import { EditModalProps, Inputs } from "../../types";

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
  allTags,
}) => {
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

  let basePath = "contacts";

  if (window.location.pathname.includes("contributionPage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("scanr-removeuser")) {
    basePath = "remove-user";
  } else if (window.location.pathname.includes("scanr-namechange")) {
    basePath = "update-user-data";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const baseURL = import.meta.env.VITE_BASE_API_URL;
  const url = isDevelopment
    ? `/api/${basePath}/${data?.id}`
    : `${baseURL}/api/${basePath}/${data?.id}`;

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const extraEntries = inputs.extra.split("\n").reduce((acc, line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const body = JSON.stringify({
        ...inputs,
        team: [selectedProfile],
        extra: extraEntries,
      });

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body,
      });

      if (response.ok) {
        refetch();
        onClose();
        toast.success("Les modifications ont été enregistrées avec succès !");
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
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

  const handleOpenTagModal = () => {
    setShowTagModal(true);
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
          <Col className="fr-mb-1w">
            <label htmlFor="statusInput">Statut</label>
            <select
              id="statusInput"
              name="status"
              value={inputs.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="fr-select"
            >
              <option value="treated">Traité</option>
              <option value="new">Nouveau</option>
              <option value="ongoing">En traitement</option>
            </select>
          </Col>
          <Row gutters>
            <Col md="6" xs="12">
              <TextArea
                label="Ajouter des tags"
                hint="Séparez les tags par des virgules"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              {tagInput && (
                <Button
                  onClick={handleTagInputChange}
                  variant="secondary"
                  size="sm"
                >
                  Valider
                </Button>
              )}
            </Col>
            <Col md="6" xs="12">
              {inputs.tags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    size="sm"
                    className="fr-mt-1w"
                    onClick={() => handleTagRemove(tag)}
                  >
                    <Text size="sm">{tag}</Text>
                  </DismissibleTag>
                </span>
              ))}
            </Col>
          </Row>
          <Button
            onClick={handleOpenTagModal}
            variant="secondary"
            size="sm"
            className="fr-mt-2w fr-mb-2w"
          >
            Sélectionner des tags
          </Button>
          <Row gutters>
            <Col md="6" xs="12">
              <TextArea
                label="Ajouter des extra"
                value={inputs.extra}
                onChange={(e) => handleInputChange("extra", e.target.value)}
                hint="Exemple : clé: valeur"
              />
            </Col>
            <Col md="6" xs="12">
              <TextArea
                label="Commentaire"
                value={inputs.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                hint="Ajouter un commentaire"
              />
            </Col>
          </Row>
          <Row className="fr-btn-group fr-btn-group--right fr-mt-4w">
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </Row>
        </ModalContent>
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
