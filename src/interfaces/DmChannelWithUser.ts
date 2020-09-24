import User from './User';


export default interface DmChannel {
  channelID: string;
  lastMessaged?: number;
  recipients?: User[];
}
