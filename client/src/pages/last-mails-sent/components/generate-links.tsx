const collectionNameMapping: { [key: string]: string } = {
  contribute: "Contribution par objets",
  contacts: "Formulaire de contact",
  contribute_productions: "Lier des publications",
  "remove-user": "Retirer de la base de données",
  "update-user-data": "Changement de nom",
  bso_local_variations_publications: "Demande de bso local",
};

export default collectionNameMapping;
export function generateLink(
  collectionName: string,
  fromApplication?: string,
  id?: string
): string {
  const basePathMap: { [key: string]: { [key: string]: string } | string } = {
    contacts: {
      scanr: "/scanr-contact",
      paysage: "/paysage-contact",
      bso: "/bso-contact",
      curiexplore: "/curiexplore-contact",
      "works-magnet": "/works-magnet-contact",
      datasupr: "/datasupr-contact",
    },
    contribute_production: "/scanr-apioperations",
    "remove-user": "/scanr-removeuser",
    "update-user-data": "/scanr-namechange",
    contribute: "/scanr-contributionPage",
    bso_local_variations_publications: "/bso-local-variations-publications",
  };

  let basePath = "";

  if (collectionName === "contacts" && fromApplication) {
    basePath = basePathMap[collectionName][fromApplication] || "";
  } else {
    basePath = (basePathMap[collectionName] as string) || "";
  }

  return id
    ? `${basePath}?page=1&query=${id}&searchInMessage=false&sort=DESC&status=choose`
    : basePath;
}
