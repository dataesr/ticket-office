export const VARIATION_NOTIFICATIONS = {
  done: {
    name: "Déclinaison locale intégrée",
    template: (id: string, commentsName: string) =>
      `Bonjour,\n\nLes publications ${commentsName} sont bien intégrées, et vous pouvez dorénavant prévisualiser chaque graphique disponible via cette page <a href=https://barometredelascienceouverte.esr.gouv.fr/declinaisons/comment-realiser-bso-local target=_blank>https://barometredelascienceouverte.esr.gouv.fr/declinaisons/comment-realiser-bso-local</a> avec votre identifiant établissement ${id.toLowerCase()}.\n\nN'hésitez pas à vérifier que chaque graphique et son commentaire vous semble correct.\n\nLes données enrichies sont disponibles (en csv et json lines). Le fichier jsonl contient toutes les données en historique (statut OA pour chaque DOI et à chaque date d'observation).\n\n<a href=https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${id.toLowerCase()}_enriched.csv.gz target=_blank>https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${id.toLowerCase()}_enriched.csv.gz</a>\n\net\n\n<a href=https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${id.toLowerCase()}_enriched.jsonl.gz target=_blank>https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${id.toLowerCase()}_enriched.jsonl.gz</a>\n\nLes traitements nécessaires à la constitution de votre scanR local sont un peu plus longs. Si votre scanR local vous intéresse, n'hésitez pas à nous contacter à <a href="mailto:bso@recherche.gouv.fr">bso@recherche.gouv.fr</a>.\n\nNous restons à votre disposition pour toute question / remarque concernant le BSO ou scanR.`,
  },
}

export const notificationGetTemplate = (notification: string, id?: string, commentsName?: string) =>
  VARIATION_NOTIFICATIONS?.[notification]?.template(id, commentsName) || ""
export const notificationGetName = (notification: string) => VARIATION_NOTIFICATIONS?.[notification]?.name || ""
