import { Button, Col, Row, TextArea, ButtonGroup } from "@dataesr/dsfr-plus";
import { useState } from "react";

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const templates = [
    { label: "Accès API scanR", value: "api" },
    { label: "scanR Ne gère pas cela", value: "desole" },
    { label: "Mauvais interlocuteur", value: "interlocuteur" },
    { label: "Merci !", value: "merci" },
    { label: "Accès thèse", value: "thèse" },
    { label: "Accès documents", value: "documents" },
    { label: "Mise à jour", value: "maj" },
    { label: "Publication liées", value: "publications" },
    { label: "Contenue retiré", value: "suppression" },
  ];

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setSelectedTemplate(value);

    if (value === "api") {
      setUserResponse(`Bonjour, 
        L'accès aux API scanR est possible avec le compte [Identifiant] et le mot de passe [Mot de passe]. 
        Les API sont documentées ici https://scanr.enseignementsup-recherche.gouv.fr/docs/overview. 
        N'hésitez pas à nous solliciter pour des compléments d'informations.
        Cordialement, 
        Département Ingénierie et science des données`);
    }
    if (value === "desole") {
      setUserResponse(
        `Bonjour, désolé scanR ne gère pas cela. Cordialement L'équipe scanR`
      );
    }
    if (value === "interlocuteur")
      setUserResponse(
        `Bonjour, Il faut vous adresser directement au laboratoire de votre choix. Votre message via scanR ne parvient qu'aux gestionnaires de l'application scanR (et pas au laboratoire). Pour joindre les laboratoires, partez plutôt de leur site web propre. Cordialement L'équipe scanR`
      );
    if (value === "merci")
      setUserResponse(
        `Bonjour, merci pour ce retour encourageant ! Cordialement L'équipe scanR`
      );
    if (value === "thèse")
      setUserResponse(
        `Bonjour, Vous trouverez ici XXXXXXXXXXXXXXXXXXXX les renseignements pour accéder à la thèse Cordialement L'équipe scanR`
      );
    if (value === "documents")
      setUserResponse(
        `Bonjour scanR ne dispose pas des documents indexées, mais uniquement des métadonnées les décrivant. Cordialement L'équipe scanR`
      );
    if (value === "maj")
      setUserResponse(
        `Bonjour, Merci pour ce signalement. Les modifications seront visibles à la prochaine actualisation du site, d'ici quelques semaines. Cordialement L'équipe scanR`
      );
    if (value === "publications")
      setUserResponse(
        `Bonjour, merci pour votre contribution. Les publications seront liées dans les prochains jours. Cordialement L'équipe scanR`
      );
    if (value === "suppression")
      setUserResponse(
        `Bonjour, votre thèse et votre profil auteur ont bien été retirés. Cordialement L'équipe scanR`
      );
  };

  return (
    <>
      {contribution?.email && (
        <Row gutters>
          <Col offsetMd="2" md="10">
            <label htmlFor="templateSelect">
              Choisissez un template de réponse
            </label>
            <select
              id="templateSelect"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="fr-select"
            >
              <option value="">Sélectionnez un template</option>
              {templates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
            <TextArea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Votre réponse..."
              rows={5}
            />
          </Col>
          <Col offsetMd="10" md="2">
            <ButtonGroup size="sm">
              <Button
                className="fr-mt-1w"
                variant="secondary"
                onClick={handlePreview}
              >
                Prévisualiser le mail
              </Button>
              <Button
                className="fr-mt-1w"
                variant="primary"
                onClick={sendEmail}
              >
                {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
    </>
  );
}

export default EmailForm;
