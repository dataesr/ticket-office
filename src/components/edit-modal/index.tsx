import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Title,
  Button,
  Row,
  DismissibleTag,
  Text,
} from "@dataesr/dsfr-plus";
import { Contribute_Production, Contribution, Inputs } from "../../types";
import { postHeaders } from "../../config/api";
import { toast } from "react-toastify";
import ProfileModal from "../profil-modal";

type EditModalProps = {
  isOpen: boolean;
  data: Contribution | Contribute_Production;
  onClose: () => void;
  refetch: () => void;
  allTags: string[];
};

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
    setInputs({
      team: [selectedProfile],
      status: "treated",
      tags: [],
      idRef: "",
      comment: "",
    });

    const fetchExistingTags = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: postHeaders,
        });
        if (response.ok) {
          const currentData = await response.json();
          setExistingTags(currentData.tags || []);
        } else {
          console.error("Erreur lors de la récupération des tags existants");
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

  const handleTagChange = (event) => {
    const newTag = event.target.value.trim();
    setInputs((prevInputs) => {
      const { tags } = prevInputs;
      if (tags.length > 0) {
        tags.pop();
      }
      return {
        ...prevInputs,
        tags: [...tags, newTag],
      };
    });
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
          toast.success("Nouveau tag ajouté!");
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
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Col>
          <Row gutters>
            <Col>
              <TextArea
                label="Ajouter un tag"
                hint="Décrivez en un mot la contribution"
                value={inputs.tags.join(", ")}
                onChange={handleTagChange}
              />
              <select onChange={handleTagChange} className="fr-select fr-mb-1w">
                <option value="">Sélectionner un tag</option>
                {filteredTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              {existingTags.map((tag, index) => (
                <span key={index}>
                  <DismissibleTag onClick={() => handleTagDelete(tag)}>
                    <Text size="sm" className="fr-ml-1w">
                      {tag.toUpperCase()}
                    </Text>
                  </DismissibleTag>
                </span>
              ))}
            </Col>
            <Col>
              <TextArea
                label="Ajouter un idref"
                value={inputs.idRef}
                onChange={handleIdRefChange}
                hint="Ajoutez un identifiant"
              />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <TextArea
                label={
                  data?.comment
                    ? "Mettre à jour le commentaire pour l'équipe"
                    : "Ajouter un commentaire pour l'équipe"
                }
                hint="Ce commentaire ne sera lu que par les membres de l'équipe"
                value={inputs.comment}
                onChange={handleCommentChange}
              />
            </Col>
          </Row>
          <Col className="fr-mt-5w">
            <Button onClick={handleSubmit} variant="secondary" size="sm">
              <Title as="h4">Enregistrer</Title>
            </Button>
          </Col>
        </ModalContent>
      </Modal>
      <ProfileModal
        isOpen={showProfileModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowProfileModal(false)}
        onSelectProfile={handleProfileSelect}
      />
    </>
  );
};

export default EditModal;
