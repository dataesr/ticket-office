export type Contribution = {
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
