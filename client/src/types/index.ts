export interface Contribution {
  [x: string]: any;
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  comment?: string;
  team?: string[];
  type: string;
  created_at: string;
  message: string;
  organisation?: string;
  fonction?: string;
  modified_at?: string;
  threads?: Thread[];
}
export interface ContributorSummaryProps {
  contributions: Contribution[];
  onSelectContribution: (id: string) => void;
}
export interface ContributionItemProps {
  data: Contribution & { type: string };
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
}
export interface ChangeNameProps {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  comment?: string;
  team?: string[];
  type: string;
  created_at: string;
  message: string;
  organisation?: string;
  fonction?: string;
  modified_at?: string;
  threads?: Thread[];
}

export interface RemoveUserProps {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  comment?: string;
  team?: string[];
  type: string;
  created_at: string;
  message: string;
  organisation?: string;
  fonction?: string;
  modified_at?: string;
  threads?: Thread[];
}
export interface ChangeNameContribution {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  comment?: string;
  team?: string[];
  type: string;
  created_at: string;
  message: string;
  organisation?: string;
  fonction?: string;
  modified_at?: string;
  threads?: Thread[];
}

export interface Thread {
  team: [string];
  responseMessage: string;
  threadId: string;
  responses?: Response[];
  timestamp: string;
}

export interface Response {
  responseMessage: string;
  timestamp: string;
  team?: string[];
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
  threads?: Thread[];
};

export type ContributionPageProps = {
  fromApp?: string;
};

export type StaffActionsProps = {
  data: any[];
};

export type MessagePreviewProps = {
  renderMessage: (message: string) => JSX.Element;
};

export type Contribute_Production = {
  fullName: string;
  firstName: string;
  lastName: string;
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
  threads?: Thread[];
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
  idref: string;
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
};

export type MailData = {
  name: string;
  _id: string;
  threads?: Thread[];
};

export type LatestMailsProps = {
  data: MailData[];
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
