export function generateLinkFromAllDatas(
  collectionName: string,
  fromApplication?: string,
  id?: string,
  objectId?: string,
  productions?: any,
  message?: string,
  contributionType?: string
): string {
  const pathMap = {
    "remove-user": "/scanr-removeuser",
    "update-user-data": "/scanr-namechange",
    contribute: "/scanr-contributionPage",
    contribute_production: "/scanr-apioperations",

    contact: {
      scanr: "/scanr-contact",
      paysage: "/paysage-contact",
      bso: "/bso-contact",
      curiexplore: "/curiexplore-contact",
      "works-magnet": "/works-magnet-contact",
      datasupr: "/datasupr-contact",
      default: "/scanr-contact",
    },
  };

  let basePath = "";

  if (productions?.length > 0 && message === undefined) {
    basePath = "/scanr-apioperations";
  } else if (objectId) {
    basePath = "/scanr-contributionPage";
  } else if (contributionType) {
    if (contributionType === "contact" && fromApplication) {
      basePath = pathMap.contact[fromApplication] || pathMap.contact.default;
    } else {
      basePath = pathMap[contributionType] || "";
    }
  } else if (fromApplication) {
    basePath = pathMap.contact[fromApplication] || pathMap.contact.default;
  } else if (collectionName) {
    basePath = pathMap[collectionName] || pathMap.contact.default;
  }

  return id
    ? `${basePath}?page=1&query=${id}&searchInMessage=false&sort=DESC&status=choose`
    : basePath;
}
