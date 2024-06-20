export interface Contribution {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  responseFrom?: string;
  comment?: string;
  team?: string[];
  type: string;
  created_at: string;
  message: string;
  organisation?: string;
  fonction?: string;
  modified_at?: string;
  mailSentDate?: string;
  mailSent?: string;
}
export type ContributionDataType = {
  responseFrom: string;
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
};

export type ContributionPageProps = {
  url: string;
};

export type StaffActionsProps = {
  data: [];
};

export type MessagePreviewProps = {
  renderMessage: any;
};

export type Contribute_Production = {
  mailSentDate: string | number | Date;
  mailSent: string;
  responseByMail: string;
  responseFrom: string;
  tag: string;
  _id: string;
  team: any;
  modified_at: string | number | Date;
  comment: any;
  id: string;
  treated_at: Date;
  created_at: Date;
  email: string;
  message?: string;
  name: string;
  status: string;
  productions: any[];
};

export type EditModalProps = {
  isOpen: boolean;
  "data-production": Contribute_Production[];
  data: Contribution[];
  onClose: () => void;
};

export type Production = {
  lastName: any;
  firstName: any;
  productionId: any;
  fullName: any;
  name: string;
  id: string;
  treated: boolean;
};

export type Inputs = {
  team: string[];
  status: string;
  tags: string[];
  idRef: string;
  comment: string;
};
export interface PersonInfo {
  name: string;
  email: string;
  phone: string;
}
export type Publication = {
  hits: any;
  // id: string;
  // isOa: boolean;
  // type: string;
  // year: number;
  landingPage?: string;
};
