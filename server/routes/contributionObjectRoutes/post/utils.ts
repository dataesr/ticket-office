export const objectTypeMapping: Record<string, string> = {
  structures: "une structure",
  persons: "une personne",
  publications: "une publication",
  project: "un projet",
  patent: "un brevet",
  network: "un réseau",
};

export function getObjectTypeLabel(objectType: string | undefined): string {
  if (!objectType) return objectTypeMapping.default;
  return objectTypeMapping[objectType] || objectTypeMapping.default;
}