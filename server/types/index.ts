export type ProductionResponse = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  id: string;
=======
  appName?: string;
<<<<<<< HEAD
  collectionName?: string;
<<<<<<< HEAD
  _id: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
=======
>>>>>>> 1d32145 (fix(collectionName): delete collectionName fields)
  id: string;
>>>>>>> 2e9190f (fix(api): update schemas)
  email: string;
  name: string;
  message: string;
  tags: string[];
<<<<<<< HEAD
<<<<<<< HEAD
=======
  organisation: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  treated_at: Date;
  comment: string;
  modified_at: Date;
  created_at: Date;
<<<<<<< HEAD
<<<<<<< HEAD
=======
  idref: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  status: string;
  productions: {
    position: string;
    details: string;
  }[];
};
