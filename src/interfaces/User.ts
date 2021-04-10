export default interface User {
  username: string;
  tag: string;
  avatar?: string | null;
  id: string;
  bot?: boolean;
  botPrefix?: string;
}
