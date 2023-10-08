export interface IAdminAuthContext {
  name: string;
  email: string;
  userId: number;
}

export interface IEmailDto {
  templateCode: string;
  to: string;
  subject: string;
  from?: string;
  bcc?: string;
  html?: string;
  data?: any;
}
