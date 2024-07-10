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
  idref: string | number;
  tags: string[];
  id: string;
  type: string;
  section: string;
  comment: string;
  name: string;
  organisation: string;
  email: string;
  fonction: string;
  message: string;
  modified_at: string;
  created_at: string;
  status: string;
  team: string[];
};

export type ContributionPageProps = {
  url: string;
};

export type StaffActionsProps = {
  data: any[];
};

export type MessagePreviewProps = {
  renderMessage: (message: string) => JSX.Element;
};

export type Contribute_Production = {
  mailSentDate: string | number | Date;
  mailSent: string;
  responseByMail: string;
  responseFrom: string;
  tag: string;
  _id: string;
  team: string[];
  modified_at: string | number | Date;
  comment: string;
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
  dataProduction: Contribute_Production[];
  onClose: () => void;
  data: Contribution | Contribute_Production;
  refetch: () => void;
  allTags: string[];
};

export type TagSelectionModalProps = {
  isOpen: boolean;
  allTags: string[];
  onClose: (selectedTags: string[]) => void;
};

export type Production = {
  lastName: string;
  firstName: string;
  productionId: string;
  fullName: string;
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
  hits: number;
  landingPage?: string;
  // id: string;
  // isOa: boolean;
  // type: string;
  // year: number;
};

export type MailData = {
  _id: string;
  mailSent?: string;
  mailSentDate?: string;
  responseFrom?: string;
  name?: string;
  refetch?: () => void;
};

export type LatestMailsProps = {
  data: { data: MailData[] };
  refetch?: () => void;
};

export type ProfileModalProps = {
  isOpen: boolean;
  selectedProfile: string | null;
  onClose: () => void;
  onSelectProfile: (profile: string) => void;
};

export type EmailSenderProps = {
  contribution: Contribution | Contribute_Production;
  refetch: () => void;
};
