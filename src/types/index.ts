export type Contribution = {
  responseByMail: string;
  responseFrom: string;
  modified_at: string;
  team: any;
  _id: any;
  status: string;
  tags: any;
  message: string;
  created_at: string | number | Date;
  fonction: any;
  organisation: any;
  email: any;
  name: any;
  type: string;
  id: string;
  comment: string;
  data: ContributionData[];
  meta: {
    total: number;
  };
  highlightedQuery: string;
};

export type ContributionData = {
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
  id: string;
  treated: boolean;
};
