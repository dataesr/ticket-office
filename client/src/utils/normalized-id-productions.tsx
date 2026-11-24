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

export function findByProductionId<T>(
  productionId: string,
  values: Record<string, T> = {}
): T | undefined {
  if (!values || !productionId) return undefined;
  if (values[productionId]) return values[productionId];

  const id = normalizeId(productionId);
  const keys = Object.keys(values);
  const key =
    keys.find((key) => normalizeId(key) === id) ??
    keys.find(
      (key) => normalizeId(key).includes(id) || id.includes(normalizeId(key))
    ) ??
    keys.find(
      (key) => findLongestCommonSubstring(id, normalizeId(key)).length >= 5
    );

  return key === undefined ? undefined : values[key];
}

export const getScanRPath = (productionId: string): string => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  return formattedProductionId.length >= 7 && formattedProductionId.length <= 9
    ? "patents"
    : "publications";
};
