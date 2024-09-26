export type ProductionResponse = {
  id: string;
  email: string;
  name: string;
  message: string;
  tags: string[];
  treated_at: Date;
  comment: string;
  modified_at: Date;
  created_at: Date;
  status: string;
  productions: {
    position: string;
    details: string;
  }[];
};
