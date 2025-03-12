export type ProductionResponse = {
  id: string;
  email: string;
  name: string;
  message: string;
  tags: string[];
  treated_at: Date;
  comment: string;
  modified_at: Date;
  created_at: Date;
  status: string;
  productions: {
    position: string;
    details: string;
  }[];
};

export type ReplyEmailConfig = {
  senderEmail: string | undefined
  senderName: string
  replyToEmail: string
  replyToName: string
  bcc?: Array<{ name: string; email: string }>
  templateId: number
}
