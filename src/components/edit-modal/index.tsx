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
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile")
  );
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("treated"); // Ajouter l'état pour le statut actuel

  let basePath = "contact";

  if (window.location.pathname.includes("contributionpage")) {
    basePath = "contribute";
  } else if (window.location.pathname.includes("apioperations")) {
    basePath = "contribute_productions";
  }

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = isDevelopment
    ? `https://scanr-api.dataesr.ovh/${basePath}/${data?._id}`
    : `${window.location.origin}/api/${basePath}/${data?._id}`;
  const [inputs, setInputs] = useState<Inputs>({
    team: [selectedProfile],
    status: "treated",
    tags: [],
    idRef: "",
    comment: "",
  });

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true);
    }
    if (data && data.status) {
      setCurrentStatus(data.status);
    }
    setInputs({
      team: [selectedProfile],
      status: data ? data.status : "treated",
      tags: [],
      idRef: "",
      comment: "",
    });

    const fetchExistingTags = async () => {
      if (!data?._id) return;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: postHeaders,
        });
        if (response.ok) {
          const currentData = await response.json();
          setExistingTags(currentData.tags || []);
        } else if (response.status === 404) {
          console.warn("Aucun tag existant trouvé");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des tags existants",
          error
        );
      }
    };

    fetchExistingTags();

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
  }, [data, selectedProfile, allTags]);

  const handleStatusChange = (event) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      status: event.target.value,
    }));
  };

  const handleTagInputChange = () => {
    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const duplicateTags = tagsArray.filter((tag) => existingTags.includes(tag));

    if (duplicateTags.length > 0) {
      toast.warn(`Le tag ${duplicateTags.join(", ")} existe déjà!`);
      setTagInput("");
      return;
    }
    if (tagsArray.length > 0) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        tags: [...prevInputs.tags, ...tagsArray],
      }));
      setTagInput("");
    }
  };

  const handleCommentChange = (event) => {
    const newComment = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, comment: newComment }));
  };

  const handleIdRefChange = (event) => {
    const newIdref = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, idRef: newIdref }));
  };

  const handleTagDelete = async (tag) => {
    try {
      const updatedTags = existingTags.filter(
        (existingTag) => existingTag !== tag
      );
      const body = { tags: updatedTags };

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setExistingTags(updatedTags);
        toast.success(
          "Tag supprimé avec succès! Cliquez sur enregistrer pour valider"
        );
      } else {
        console.error("Erreur lors de la suppression du tag", response);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du tag", error);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = inputs.tags.filter((tag) => tag !== tagToRemove);
    setInputs((prevInputs) => ({
      ...prevInputs,
      tags: updatedTags,
    }));
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
      const currentDataResponse = await fetch(url, {
        method: "GET",
        headers: postHeaders,
      });

      if (!currentDataResponse.ok) {
        console.log(
          "Erreur de réponse lors de la récupération des données actuelles",
          currentDataResponse
        );
        return;
      }

      const currentData = await currentDataResponse.json();

      const updatedTags = currentData.tags
        ? [...currentData.tags, ...inputs.tags]
        : inputs.tags;

      const body = {
        status: inputs.status,
        tags: updatedTags,
        team: inputs.team,
        idref: inputs.idRef,
        comment: inputs.comment,
      };

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const responseData = await response.json();
        console.log("Données de réponse", responseData);
        refetch();
        onClose();

        if (inputs.tags.length > 0) {
          toast.success("Nouveau(x) tag(s) ajouté(s)!");
        } else if (inputs.comment) {
          toast.success("Nouveau commentaire ajouté!");
        } else if (inputs.idRef) {
          toast.success("Nouvel idRef ajouté!");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
    }
  };

  const statusOptions = [
    { value: "new", label: "Nouveau" },
    { value: "ongoing", label: "En traitement" },
    { value: "treated", label: "Traité" },
  ];

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", profile);
    setShowProfileModal(false);
  };

  const handleTagAdd = () => {
    setShowTagModal(true);
  };

  const handleTagModalClose = (selectedTags: string[]) => {
    setShowTagModal(false);
    if (selectedTags.length > 0) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        tags: [...prevInputs.tags, ...selectedTags],
      }));
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Modifier la contribution</ModalTitle>
        <ModalContent className="profile-modal-content">
          <Col className="fr-mb-1w">
            <label htmlFor="statusInput">Statut</label>
            <select
              id="statusInput"
              name="status"
              value={inputs.status}
              onChange={handleStatusChange}
              className="fr-select"
            >
              <option value="" disabled hidden>
                {currentStatus}
              </option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              <Button onClick={handleTagAdd} variant="secondary" size="sm">
                Sélectionner des tags
              </Button>
              <br />
              {inputs.tags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    size="sm"
                    className="fr-mt-1w"
                    onClick={() => handleTagRemove(tag)}
                  >
                    <Text size="sm">{tag.toUpperCase()}</Text>
                  </DismissibleTag>
                </span>
              ))}
              {existingTags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag
                    className="fr-ml-1w fr-mr-1v fr-mt-1w"
                    size="sm"
                    onClick={() => handleTagDelete(tag)}
                  >
                    <Text size="sm">{tag.toUpperCase()}</Text>
                  </DismissibleTag>
                </span>
              ))}
            </Col>
          </Row>
          <Row gutters>
            <Col md="6">
              <TextArea
                label="Ajouter un idref"
                value={inputs.idRef}
                onChange={handleIdRefChange}
                hint="Ajoutez un identifiant"
              />
            </Col>
            <Col md="6">
              <TextArea
                label="Commentaire"
                value={inputs.comment}
                onChange={handleCommentChange}
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
          onSelectProfile={handleProfileSelect}
        />
      )}
      <TagSelectionModal
        isOpen={showTagModal}
        allTags={filteredTags}
        onClose={handleTagModalClose}
      />
    </>
  );
};

export default EditModal;
