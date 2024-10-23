import {
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  TextInput,
} from "@dataesr/dsfr-plus";
import { useState } from "react";

function TemplateResponseModal({ isOpen, onClose, setUserResponse }) {
  const [user, setUser] = useState("");
  const [mdp, setMdp] = useState("");

  const handleClick = () => {
    const responseTemplate = `Bonjour, 
    Nous nous réjouissons que les données de scanR suscitent l'intérêt de l'ISC dont nous suivons les travaux. 
    L'accès aux API scanR est possible avec le compte ${user} et le mot de passe ${mdp}. 
    Les API sont documentées ici https://scanr.enseignementsup-recherche.gouv.fr/docs/overview. 
    Cette même page donne accès à des dumps régulièrement mis à jour. 
    N'hésitez pas à nous solliciter pour des compléments d'informations et à nous faire des retours sur les données et sur vos usages. 
    Cordialement, 
    Département Ingénierie et science des données`;

    setUserResponse(responseTemplate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalContent>
        <h2>Réponse Préparée</h2>
        <TextInput
          label="Identifiant"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Entrez l'identifiant"
        />
        <TextInput
          label="Mot de passe"
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          placeholder="Entrez le mot de passe"
        />
        <ButtonGroup>
          <Button variant="secondary" onClick={handleClick}>
            Utiliser une réponse préparée
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}

export default TemplateResponseModal;
