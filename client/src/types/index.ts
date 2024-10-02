export interface Contribution {
  [x: string]: any;
<<<<<<< HEAD
<<<<<<< HEAD
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
  fromApplication: string;
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
=======
  _id: string;
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
>>>>>>> 2e9190f (fix(api): update schemas)
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
  fromApplication: string;
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

export interface Thread {
  team: [string];
  responseMessage: string;
  threadId: string;
  responses?: Response[];
  timestamp: string;
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
<<<<<<< HEAD
<<<<<<< HEAD
  fromApplication?: string;
};
export type ChangeNamePageProps = {
  url: string;
};
export type RemoveUserPageProps = {
  url: string;
=======
  fromApp?: string;
>>>>>>> 57156e2 (fix(navigation): contact navigation updated)
=======
  fromApplication?: string;
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
  idref: string;
>>>>>>> 8758832 (fix(edit-contrib): fix bug)
=======
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
export type MailData = {
=======
interface MailData {
>>>>>>> 220c881 (fix(api): add meta in response schema)
  fromApplication: string;
  id: string;
  name: string;
  threads: Array<{
    team: string[];
    responses: Array<{
      team: any;
      responseMessage: string;
      timestamp: string;
    }>;
  }>;
}

export type LatestMailsProps = {
  data: {
    data: MailData[];
    meta: {
      total: number;
    };
  };
  refetch?: () => void;
};

>>>>>>> 2e9190f (fix(api): update schemas)
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
