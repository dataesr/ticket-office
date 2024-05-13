import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Title,
  Text,
  Button,
  Row,
} from "@dataesr/dsfr-plus";
import { Contribution } from "../../types";
import { postHeaders } from "../../config/api";

type EditModalProps = {
  isOpen: boolean;
  data: Contribution;
  onClose: () => void;
};

const EditModal: React.FC<EditModalProps> = ({ isOpen, data, onClose }) => {
  const user = sessionStorage.getItem("selectedProfile");
  const [inputs, setInputs] = useState({
    team: [user],
    status: data.status,
    tag: "",
    idRef: "",
  });

  useEffect(() => {
    setInputs({
      team: [user],
      status: "treated",
      tag: "",
      idRef: "",
    });
  }, [data, user]);

  const handleInputChange = (event) => {
    event.persist();
    const newStatus = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, status: newStatus }));
  };

  const handleTagChange = (event) => {
    const newTag = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, tag: newTag }));
  };

  const handleIdRefChange = (event) => {
    const newIdref = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, tag: newIdref }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://scanr-api.staging.dataesr.ovh/contributions/${data._id}`,
        {
          method: "PATCH",
          headers: postHeaders,
          body: JSON.stringify({
            status: inputs.status,
            tag: inputs.tag,
            idref: inputs.idRef,
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const responseData = await response.json();
        console.log("Données de réponse", responseData);
        onClose();
      }
    } catch (error) {
      console.error("Erreur de requête", error);
    }
  };

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>Modifier la contribution </ModalTitle>
      <ModalContent className="profile-modal-content">
        <Col className="fr-mb-1w">
          <label className="label" htmlFor="statusInput">
            <Text>Mettre à jour le statut :</Text>
            <select
              className="fr-select"
              id="statusInput"
              name="status"
              value={inputs.status}
              onChange={handleInputChange}
            >
              <option value="new">Nouveau</option>
              <option value="ongoing">En traitement</option>
              <option value="treated">Traité</option>
            </select>
          </label>
        </Col>
        <Row gutters>
          <Col>
            <TextArea
              label="Ajouter un tag"
              maxLength={6}
              hint="Décrivez en un mot la contribution"
              value={inputs.tag}
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

        <Col className="fr-mt-5w">
          <Button onClick={handleSubmit} variant="secondary" size="sm">
            <Title as="h3">Enregistrer</Title>
          </Button>
        </Col>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
