import ServerRole from "./ServerRole";
import User from "./User";

export default interface ServerMember {
  server_id: string;
  id: string;
  type: string;
  roleIdArr: string[];
}

export type ExtraServerMembers = ServerMember & {
  member: User;
  presence: number;
  roles: ServerRole[];
};
