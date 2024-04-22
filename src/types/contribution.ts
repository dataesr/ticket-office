import { ReactNode } from "react";

export type Contribution = {
  message: ReactNode;
  created_at: string | number | Date;
  fonction: any;
  organisation: any;
  email: any;
  name: any;
  type: string;
  id: string;
  data: {
    idref: any;
    tags: any;
    id: string;
    type: string;
    section: string;
    comment: string;
    name: string;
    organisation: string;
    email: string;
    fonction: string;
    message: string;
    modifier_at: string;
    created_at: string;
    status: string;
    team: any[];
  }[];
  meta: {
    total: number;
  };
};
