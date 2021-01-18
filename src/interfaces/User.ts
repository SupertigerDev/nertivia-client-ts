export default interface User {
  username: string;
  tag: string;
  avatar?: string | null;
  uniqueID: string;
  bot?: boolean;
}
