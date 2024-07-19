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

// {
//   "thread": [
//     {
//       "messages": [
//         {
//           "message_id": "1",
//           "from": "contributor@example.com",
//           "to": ["scanr@recherche.......com"],
//           "date": "2024-07-18",
//           "body": "je veux avoir accés à l'api",
//           "subject" : "demande d'acces à l'api"
//         },
//         {
//           "message_id": "2",
//           "from": "scanr@example.com",
//           "to": ["contributor@example.com"],
//           "date": "2024-07-18",
//           "team": "mihoub",
//           "subject" : "RE - demande d'acces à l'api"
//           "body": "Voici vos ids pour acces à scanr API",
//           "repliesTo": message_id = 1
//         },
//         {
//           "message_id": "3",
//           "from": "contributor@example.com",
//           "to": ["scanr@example.com"],
//           "date": "2024-07-18",
//           "subject" : "RE RE - demande d'acces à l'api"
//           "body": "Merci  !! ",
//         },
//         {
//           "message_id": "4",
//           "from": "scanr@exemple.com",
//           "to": ["contributor@example.com",],
//           "date": "2024-07-18",
//           "team": "mihoub",
//           "body": "De rien!",
//           "subject" : "RE RE RE - demande d'acces à l'api"
//           "repliesTo": message_id = 3
//         }
//       ]
//   ]
// }

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
  fullName: any;
  firstName: any;
  lastName: any;
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
