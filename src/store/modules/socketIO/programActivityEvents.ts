import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import {
  CUSTOM_EMOJI_REMOVE,
  CUSTOM_EMOJI_RENAME,
  CUSTOM_EMOJI_UPLOADED,
  PROGRAM_ACTIVITY_CHANGED
} from "@/socketEventConstants";
import date from "@/utils/date";
import { ActionTree } from "vuex";
import { CustomEmojisModule } from "../customEmojis";
import { programActivitiesModule } from "../memberProgramActivity";

const actions: ActionTree<any, any> = {
  [PROGRAM_ACTIVITY_CHANGED](
    context,
    data: { name?: string; status?: string; uniqueID: string }
  ) {
    if (!data.name || !data.status) {
      programActivitiesModule.RemoveProgramActivity({
        uniqueID: data.uniqueID
      });
      return;
    }
    programActivitiesModule.SetProgramActivity({
      uniqueID: data.uniqueID,
      name: data.name,
      status: data.status
    });
  }
};
export default {
  actions
};
