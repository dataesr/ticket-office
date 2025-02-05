import { Thread } from "../pages/api-operation-page/types";

export interface Contribution {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  fromApplication: string;
  emails?: any;
}

export interface LastMailsSentProps {
  data: {
    length: number;

    emails: Contribution[];
  };
}
export interface LastMailsReceivedProps {
  data: {
    [x: string]: any;
    length: number;
  };
}

export interface AllContributionsProps {
  data: Contribution[];
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
  url: string;
}
export interface ChangeNameProps {
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

export interface Response {
  read: boolean;
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
  fromApplication?: string;
};

export type StaffActionsProps = {
  data: any[];
};

export type MessagePreviewProps = {
  renderMessage: (message: string) => JSX.Element;
};

export type Contribute_Production = {
  objectId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  responseByMail: string;
  responseFrom: string;
  tag: string;
  id: string;
  team: string[];
  phone: string;
  modified_at: string | number | Date;
  comment: string;
  treated_at: Date;
  created_at: Date;
  email: string;
  message?: string;
  name: string;
  status: string;
  productions: any[];
  threads?: Thread[];
  fromApplication: string;
};

export type TagSelectionModalProps = {
  isOpen: boolean;
  allTags: string[];
  onClose: (selectedTags: string[]) => void;
};

export type EditModalProps = {
  isOpen: boolean;
  dataProduction: Contribute_Production[];
  onClose: () => void;
  data: Contribution | Contribute_Production;
  refetch: () => void;
  allTags: string[];
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
  comment: string;
  extra: string;
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
