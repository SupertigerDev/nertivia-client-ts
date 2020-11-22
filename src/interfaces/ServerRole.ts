export default interface ServerRole {
  color: string;
  default: boolean;
  deletable: boolean;
  id: string;
  name: string;
  order: number;
  permissions: number;
  server_id: string;
  hideRole?: boolean;
  bot?: string;
}
