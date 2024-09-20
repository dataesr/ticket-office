import { useEffect, useState } from "react";
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
import { EditModalProps, Inputs } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import ProfileModal from "../profil-modal";
import TagSelectionModal from "./modal-select-tags";

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
  allTags,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile] = useState(localStorage.getItem("selectedProfile"));
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
    idref: "",
    comment: "",
  });
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagModal] = useState(false);

  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  }
  if (window.location.pathname.includes("scanr-removeuser")) {
    basePath = "remove-user";
  }
  if (window.location.pathname.includes("scanr-namechange")) {
    basePath = "update-user-data";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "production";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = isDevelopment
    ? `http://localhost:3000/api/${basePath}/${data?._id}`
    : `https://ticket-office.staging.dataesr.ovh/api/${basePath}/${data?._id}`;

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true);
    }

    const formattedTags = Array.isArray(allTags)
      ? Array.from(
          new Set(
            allTags
              .flat()
              .filter((tag) => typeof tag === "string" && tag.trim() !== "")
              .map((tag) => tag.toUpperCase())
          )
        ).sort()
      : [];
    setFilteredTags(formattedTags);
  }, [allTags, selectedProfile]);

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
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

  const handleSubmit = async () => {
    if (
      !selectedProfile ||
      selectedProfile === "null" ||
      selectedProfile === ""
    ) {
      setShowProfileModal(true);
      return;
    }

    try {
      const body = JSON.stringify({ ...inputs, team: [selectedProfile] });

      const response = await fetch(url, {
        method: "PUT",
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

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Modifier la contribution</ModalTitle>
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
            <Col md="6">
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
            <Col md="6">
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
          <Row gutters>
            <Col md="6">
              <TextArea
                label="Ajouter un idRef"
                value={inputs.idref}
                onChange={(e) => handleInputChange("idref", e.target.value)}
                hint="Ajoutez un identifiant"
              />
            </Col>
            <Col md="6">
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
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          selectedProfile={selectedProfile}
          onClose={() => setShowProfileModal(false)}
          onSelectProfile={(profile) => handleInputChange("team", [profile])}
        />
      )}
      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
        onClose={(selectedTags) => handleInputChange("tags", selectedTags)}
      />
    </>
  );
};

export default EditModal;
