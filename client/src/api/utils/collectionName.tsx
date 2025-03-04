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
  {
    regex: /bso/i,
    collectionName: "local_variations",
  },
];

export const getCollectionNameFromUrl = (url: string) => {
  const mapping = collectionMapping.find(({ regex }) => regex.test(url));
  console.log(mapping);
  return mapping ? mapping.collectionName : null;
};

export default collectionMapping;
