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
};

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  data,
  onClose,
  refetch,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem("selectedProfile")
  );

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
  }, [data, selectedProfile]);

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
      const body: {
        status?: string;
        tags?: string[];
        team?: string[];
        idref?: string;
        comment?: string;
      } = {};

      if (inputs.status) {
        body.status = inputs.status;
      }

      if (inputs.tags && inputs.tags.length > 0) {
        body.tags = inputs.tags;
      }
      if (inputs.team) {
        body.team = inputs.team;
      }

      if (inputs.idRef) {
        body.idref = inputs.idRef;
      }

      if (inputs.comment) {
        body.comment = inputs.comment;
      }

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
          toast.success("Nouvelle référence ajoutée!");
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
                maxLength={6}
                hint="Décrivez en un mot la contribution"
                value={inputs.tags.join(", ")}
                onChange={handleTagChange}
              />
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
