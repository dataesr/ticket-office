// Types de base communs à plusieurs interfaces
export interface BaseContribution {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  status: string;
  comment?: string;
  team?: string[];
  message: string;
  created_at: string;
  modified_at?: string;
  fromApplication?: string;
  contributionType?: string;
  organisation?: string;
  fonction?: string;
  threads?: Thread[];
  extra?: Record<string, any>;
}

// Type importé depuis un autre fichier
import {
  Thread,
  Contribution_Production,
} from "../pages/api-operation-page/types";

// Données d'auteur
export interface AuthorData {
  fullName: string[];
  firstName: string[];
  lastName: string[];
}

// Contribution standard
export interface Contribution extends BaseContribution {
  type: string;
  emails?: any;
}

// Interfaces pour les props de composants liés aux emails
export interface LastMailsSentProps {
  data: {
    length: number;
    emails: Contribution[];
  };
}

export interface LastMailsReceivedProps {
  data: {
    [key: string]: any;
    length: number;
  };
}

// Interfaces pour les props de composants de contribution
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

// Types spécifiques pour certaines pages
export interface ChangeNameProps extends BaseContribution {
  type: string;
}

export interface RemoveUserProps extends BaseContribution {
  type: string;
}

export type ChangeNameContribution = ChangeNameProps;

// Type pour les réponses dans les threads
export interface Response {
  read: boolean;
  responseMessage: string;
  timestamp: string;
  team?: string[];
}

// Types pour les données de contribution
export type ContributionDataType = {
  responseFrom: string;
  idref: string | number;
  section: string;
  type: string;
} & BaseContribution;

// Interfaces pour les props de composants de page
export type ContributionPageProps = {
  fromApplication?: string;
};

export type StaffActionsProps = {
  data: any[];
  url?: string;
  refetch?: () => void;
};

export type MessagePreviewProps = {
  renderMessage: (message: string) => JSX.Element;
  data?: BaseContribution;
  highlightedQuery?: string;
  refetch?: () => void;
  allTags?: string[];
};

// Type pour les contributions de production
export type Contribute_Production = BaseContribution & {
  objectId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  responseByMail: string;
  responseFrom: string;
  tag: string;
  phone: string;
  treated_at: Date;
  productions: any[];
};

// Types pour les modales
export type TagSelectionModalProps = {
  isOpen: boolean;
  allTags: string[];
  onClose: (selectedTags: string[]) => void;
};

export type EditModalProps = {
  isOpen: boolean;
  dataProduction?: Contribute_Production[];
  onClose: () => void;
  data: Contribution | Contribute_Production;
  refetch: () => void;
  allTags: string[];
};

export type ProfileModalProps = {
  isOpen: boolean;
  selectedProfile: string | null;
  onClose: () => void;
  onSelectProfile: (profile: string) => void;
};

// Type pour la production
export type Production = {
  lastName: string;
  firstName: string;
  productionId: string;
  fullName: string;
  name: string;
  id: string;
  treated: boolean;
};

// Types pour les formulaires
export type Inputs = {
  team: string[];
  status: string;
  tags: string[];
  comment: string;
  extra: string;
  contributionType?: string;
};

export interface PersonInfo {
  name: string;
  email: string;
  phone: string;
}

// Type pour les publications
export type Publication = {
  hits: number;
  landingPage?: string;
};

// Type pour l'envoi d'email
export type EmailSenderProps = {
  contribution: Contribution | Contribution_Production;
  refetch: () => void;
};
