import {
  contactUrl,
  contributionUrl,
  nameChangeUrl,
  productionUrl,
  removeUserUrl,
} from "../config/api";

export function getUrlToSend(pathname: string): string {
  if (pathname.includes("contributionPage")) {
    return contributionUrl;
  }
  if (pathname.includes("scanr-removeuser")) {
    return removeUserUrl;
  }
  if (pathname.includes("scanr-namechange")) {
    return nameChangeUrl;
  }
  if (pathname.includes("apioperations")) {
    return productionUrl;
  }
  return contactUrl;
}
