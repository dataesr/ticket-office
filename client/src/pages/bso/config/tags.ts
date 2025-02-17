import { DSFRColors } from "@dataesr/dsfr-plus"

type VARIATION_TAGS_TYPE = { [tag: string]: { [key: string]: { name: string; color: DSFRColors } } }

const VARIATION_TAGS: VARIATION_TAGS_TYPE = {
  file: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
    },
    uploaded: {
      name: "Importé sur OVH",
      color: "success",
    },
  },
  code: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
    },
    staging: {
      name: "Disponible en staging",
      color: "yellow-tournesol",
    },
    production: {
      name: "Disponible en production",
      color: "success",
    },
  },
  index: {
    none: {
      name: "Aucune action réalisée",
      color: "beige-gris-galet",
    },
    ongoing: {
      name: "Création en cours",
      color: "yellow-tournesol",
    },
    failed: {
      name: "Erreur lors de la création",
      color: "error",
    },
    finalized: {
      name: "Création finalisée",
      color: "success",
    },
  },
  notification: {
    none: {
      name: "Aucun message envoyé",
      color: "beige-gris-galet",
    },
    ongoing: {
      name: "Message de traitement envoyé",
      color: "yellow-tournesol",
    },
    done: {
      name: "Message de disponibilité envoyé",
      color: "success",
    },
  },
}
export default VARIATION_TAGS
