import { useId, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { postHeaders } from "../../config/api";
import "./styles.scss";

const TEMPLATES = [
  { label: "Accès API scanR", value: "API" },
  { label: "scanR Ne gère pas cela", value: "HS" },
  { label: "Mauvais interlocuteur", value: "INTERLOCUTEUR" },
  { label: "Merci !", value: "REMERCIEMENT" },
  { label: "Accès thèse", value: "THESE" },
  { label: "Accès documents", value: "DOCUMENTS" },
  { label: "Mise à jour", value: "MAJ" },
  { label: "Publication liées", value: "PUBLICATION" },
  { label: "Contenue retiré", value: "SUPRESSION" },
  { label: "Mise en relation", value: "MISE EN RELATION" },
];

const TEMPLATE_MESSAGES: Record<string, string> = {
  API: `Bonjour,
          L'accès aux API scanR est possible avec le compte [Identifiant] et le mot de passe [Mot de passe].
          Les API sont documentées ici https://scanr.enseignementsup-recherche.gouv.fr/docs/overview.
          N'hésitez pas à nous solliciter pour des compléments d'informations.
          Cordialement,
          Département Ingénierie et science des données`,
  HS: "Bonjour, désolé scanR ne gère pas cela. Cordialement L'équipe scanR",
  INTERLOCUTEUR:
    "Bonjour, Il faut vous adresser directement au laboratoire de votre choix. Votre message via scanR ne parvient qu'aux gestionnaires de l'application scanR (et pas au laboratoire). Pour joindre les laboratoires, partez plutôt de leur site web propre. Cordialement L'équipe scanR",
  REMERCIEMENT:
    "Bonjour, merci pour ce retour encourageant ! Cordialement L'équipe scanR",
  THESE:
    "Bonjour, Vous trouverez ici XXXXXXXXXXXXXXXXXXXX les renseignements pour accéder à la thèse. Cordialement L'équipe scanR",
  DOCUMENTS:
    "Bonjour, scanR ne dispose pas des documents indexés, mais uniquement des métadonnées les décrivant. Cordialement L'équipe scanR",
  MAJ: "Bonjour, Merci pour ce signalement. Les modifications seront visibles à la prochaine actualisation du site, d'ici quelques semaines. Cordialement L'équipe scanR",
  PUBLICATION:
    "Bonjour, Merci pour votre contribution. Les publications seront associées à la fiche-auteur à l'occasion de la prochaine mise à jour. Cordialement L'équipe scanR",
  SUPRESSION:
    "Bonjour, votre thèse et votre profil auteur ont bien été retirés. Cordialement L'équipe scanR",
  "MISE EN RELATION":
    "Bonjour, scanR n'est pas une plateforme de mise en relation. Votre message parvient à scanR qui est un agrégateur de métadonnées liées à la recherche et à l'innovation. Cordialement L'équipe scanR",
};

const getBasePath = (pathname: string) => {
  if (pathname.includes("contributionPage")) return "contribute";
  if (pathname.includes("scanr-removeuser")) return "remove-user";
  if (pathname.includes("scanr-namechange")) return "update-user-data";
  if (pathname.includes("apioperations")) return "production";
  return "contacts";
};

function EmailForm({
  userResponse,
  setUserResponse,
  handlePreview,
  sendEmail,
  contribution,
}) {
  const templateSelectId = useId();
  const responseTextareaId = useId();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [tags, setTags] = useState<string[]>(contribution?.tags || []);

  const url = `/api/${getBasePath(window.location.pathname)}/${contribution?.id}`;

  const { mutate: updateTags } = useMutation({
    mutationFn: async (updatedTags: string[]) => {
      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body: JSON.stringify({ tags: updatedTags }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du tag.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Tag ajouté avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du tag.");
    },
  });

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);

    if (TEMPLATE_MESSAGES[value]) {
      setUserResponse(TEMPLATE_MESSAGES[value]);
    }

    if (value && !tags.includes(value)) {
      const updatedTags = [...tags, value];
      setTags(updatedTags);
      updateTags(updatedTags);
    }
  };

  if (!contribution?.email) return null;

  return (
    <div className="email-composer">
      <div className="fr-select-group fr-mb-3w">
        <select
          id={templateSelectId}
          className="fr-select"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">Sélectionnez un template</option>
          {TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <div className="fr-input-group fr-mb-3w">
        <label className="fr-label fr-text--bold" htmlFor={responseTextareaId}>
          Votre réponse
        </label>
        <textarea
          id={responseTextareaId}
          className="fr-input"
          rows={6}
          placeholder="Votre réponse..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
        />
      </div>

      <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline fr-btns-group--icon-left fr-mb-0">
        <li>
          <button
            type="button"
            className="fr-btn fr-icon-send-plane-line"
            onClick={sendEmail}
          >
            {contribution?.mailSent ? "Renvoyer un mail" : "Répondre"}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="fr-btn fr-btn--secondary fr-icon-eye-line"
            onClick={handlePreview}
          >
            Prévisualiser le mail
          </button>
        </li>
      </ul>
    </div>
  );
}

export default EmailForm;
