export type ProductionResponse = {
<<<<<<< HEAD
  id: string;
=======
  appName?: string;
  collectionName?: string;
<<<<<<< HEAD
  _id: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
  id: string;
>>>>>>> 2e9190f (fix(api): update schemas)
  email: string;
  name: string;
  message: string;
  tags: string[];
<<<<<<< HEAD
=======
  organisation: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  treated_at: Date;
  comment: string;
  modified_at: Date;
  created_at: Date;
<<<<<<< HEAD
=======
  idref: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  status: string;
  productions: {
    position: string;
    details: string;
  }[];
};
