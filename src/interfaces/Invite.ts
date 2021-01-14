import User from "./User";

export default interface Invite {
    creator: User;
    custom?: boolean;
    invite_code: string;
    uses: number;
  }
  