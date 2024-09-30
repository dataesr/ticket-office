const collectionMapping = [
  {
    regex: /contact/i,
    collectionName: "contacts",
  },
  {
    regex: /contribution/i,
    collectionName: "contribute",
  },
  {
    regex: /apioperations/i,
    collectionName: "contribute_productions",
  },
  {
    regex: /removeuser/i,
    collectionName: "remove-user",
  },
  {
    regex: /namechange/i,
    collectionName: "update-user-data",
  },
];

export const getCollectionNameFromUrl = (url: string) => {
  const mapping = collectionMapping.find(({ regex }) => regex.test(url));
  return mapping ? mapping.collectionName : null;
};

export default collectionMapping;
