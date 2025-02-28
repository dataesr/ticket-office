export const normalizeId = (id: string): string => {
  if (!id) return "";

  return id
    .replace(/^(doi|hal|arxiv|in2p3|pubmed|pmc|wos|scopus|inist)[-:/]*/i, "")
    .replace(/[^a-z0-9.]/gi, "")
    .toLowerCase();
};

export const findLongestCommonSubstring = (s1: string, s2: string): string => {
  if (!s1 || !s2) return "";

  let longest = "";

  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      let current = "";
      let k = 0;

      while (
        s1[i + k] === s2[j + k] &&
        i + k < s1.length &&
        j + k < s2.length
      ) {
        current += s1[i + k];
        k++;
      }

      if (current.length > longest.length) {
        longest = current;
      }
    }
  }

  return longest;
};

export const findLandingPage = (
  productionId: string,
  landingPages: Record<string, string> = {}
): string | undefined => {
  if (!landingPages || !productionId) return undefined;

  if (landingPages[productionId]) return landingPages[productionId];

  const normalizedProductionId = normalizeId(productionId);
  const keys = Object.keys(landingPages);

  for (const key of keys) {
    if (normalizeId(key) === normalizedProductionId) {
      return landingPages[key];
    }
  }

  for (const key of keys) {
    const normalizedKey = normalizeId(key);

    if (
      normalizedKey.includes(normalizedProductionId) ||
      normalizedProductionId.includes(normalizedKey)
    ) {
      return landingPages[key];
    }
  }

  const minPartLength = 5;
  for (const key of keys) {
    const normalizedKey = normalizeId(key);
    const commonSubstring = findLongestCommonSubstring(
      normalizedProductionId,
      normalizedKey
    );

    if (commonSubstring && commonSubstring.length >= minPartLength) {
      return landingPages[key];
    }
  }

  return undefined;
};

export const findAuthorData = (
  productionId: string,
  authorsData: Record<string, any> = {}
): any | undefined => {
  if (!authorsData || !productionId) return undefined;

  if (authorsData[productionId]) return authorsData[productionId];

  const normalizedProductionId = normalizeId(productionId);
  const keys = Object.keys(authorsData);

  for (const key of keys) {
    if (normalizeId(key) === normalizedProductionId) {
      return authorsData[key];
    }
  }

  for (const key of keys) {
    const normalizedKey = normalizeId(key);

    if (
      normalizedKey.includes(normalizedProductionId) ||
      normalizedProductionId.includes(normalizedKey)
    ) {
      return authorsData[key];
    }
  }

  const minPartLength = 5;
  for (const key of keys) {
    const normalizedKey = normalizeId(key);
    const commonSubstring = findLongestCommonSubstring(
      normalizedProductionId,
      normalizedKey
    );

    if (commonSubstring && commonSubstring.length >= minPartLength) {
      return authorsData[key];
    }
  }

  return undefined;
};

export const getScanRPath = (productionId: string): string => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  return formattedProductionId.length >= 7 && formattedProductionId.length <= 9
    ? "patents"
    : "publications";
};
