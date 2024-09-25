export type ProductionResponse = {
  appName?: string;
  id: string;
  email: string;
  name: string;
  message: string;
  tags: string[];
  organisation: string;
  treated_at: Date;
  comment: string;
  modified_at: Date;
  created_at: Date;
  idref: string;
  status: string;
  productions: {
    position: string;
    details: string;
  }[];
};
