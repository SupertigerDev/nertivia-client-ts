import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { getBotCommands } from "@/services/botService";
import { ServerMembersModule } from "./serverMembers";

interface ServerBotCommandsObj {
  // key = server id
  [key: string]: string[];
}
interface BotCommandsObj {
  // key = bot id
  [key: string]: BotCommand[];
}
export interface BotCommand {
  // action
  a: string;
  // command
  c: string;
}
@Module({ dynamic: true, store, namespaced: true, name: "botCommands" })
class BotCommands extends VuexModule {
  botCommands: BotCommandsObj = {};
  serverBotCommands: ServerBotCommandsObj = {};

  get serverCommands() {
    return (id: string) => {
      if (!this.serverBotCommands[id]) return [];
      return Object.values(this.serverBotCommands[id]).map(
        (b_id) => this.botCommands[b_id]
      );
    };
  }

  @Mutation
  private SET_BOT_COMMANDS(payload: { id: string; commands: BotCommand[] }) {
    this.botCommands[payload.id] = payload.commands;
  }
  @Mutation
  private SET_SERVER_BOT_COMMANDS(payload: { serverId: string; id: string }) {
    const commands = this.serverBotCommands[payload.serverId];
    if (commands) {
      this.serverBotCommands[payload.serverId][commands.length] = payload.id;
      return;
    }
    this.serverBotCommands[payload.serverId] = [payload.id];
  }

  @Action
  public FetchAndSetBotCommands(payload: {
    botIDArr?: string[];
    serverId?: string;
  }) {
    let botIDs = payload.botIDArr as any;
    if (payload.serverId) {
      botIDs = ServerMembersModule.getUsersFromServer(payload.serverId)
        .filter((u) => u.bot)
        .map((b) => b.id);
    }
    getBotCommands(botIDs).then((arr) => {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (!item.botCommands) continue;
        this.SET_BOT_COMMANDS({
          id: item.id,
          commands: item.botCommands,
        });
        if (payload.serverId) {
          this.SET_SERVER_BOT_COMMANDS({
            serverId: payload.serverId,
            id: item.id,
          });
        }
      }
    });
  }
}
export const botCommandsModule = getModule(BotCommands);
