import { Modal, ModalTitle, ModalContent, Col } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
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
  });

  useEffect(() => {
    setInputs({
      team: [user],
      status: "treated",
    });
  }, [data, user]);

  const handleInputChange = async (event) => {
    event.persist();
    const newStatus = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, status: newStatus }));

    try {
      const response = await fetch(
        `https://scanr-api.dataesr.ovh/contributions/${data._id}`,
        {
          method: "POST",
          headers: postHeaders,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        console.log("Erreur de réponse", response);
      } else {
        const data = await response.json();
        console.log("Données de réponse", data);
      }
    } catch (error) {
      console.error("Erreur de requête", error);
    }
  };

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>Modifier la contribution </ModalTitle>
      <ModalContent className="profile-modal-content">
        <Col>
          <label className="label" htmlFor="statusInput">
            <span>Mettre à jour le statut :</span>
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
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
