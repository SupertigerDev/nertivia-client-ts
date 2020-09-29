import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { fetchMessages, postMessage } from "@/services/messagesService";
import ky from "ky";
import Message from "@/interfaces/Message";
import Vue from "vue";
import { ScrollModule } from "./scroll";
import router from "@/router";
import { MeModule } from "./me";
import { ChannelsModule } from './channels';

interface MessagesObj {
  [key: string]: Message[];
}

function generateNum(n: number): string {
  const add = 1;
  let max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generateNum(max) + generateNum(n - max);
  }

  max = Math.pow(10, n + add);
  const min = max / 10; // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}

@Module({ dynamic: true, store, namespaced: true, name: "messages" })
class Messages extends VuexModule {
  messages: MessagesObj = {};

  get channelMessages() {
    return (id: string) => this.messages[id];
  }

  @Mutation
  private SET_CHANNEL_MESSAGES(payload: {
    messages: Message[];
    channelID: string;
  }) {
    Vue.set(this.messages, payload.channelID, payload.messages);
  }

  @Action
  public async FetchAndSetMessages(channelID: string) {
    fetchMessages(channelID)
      .then(res => {
        this.SET_CHANNEL_MESSAGES({
          messages: res.messages.reverse(),
          channelID
        });
      })
      .catch((err: ky.HTTPError) => {
        console.log(err.name);
        // console.log(err.response)
      });
  }
  @Action
  public sendMessage(payload: { message: string; channelID: string }) {
    const tempID = generateNum(25);
    const creator: any = MeModule.user;
    this.AddChannelMessage({
      channelID: payload.channelID,
      message: payload.message,
      tempID,
      created: Date.now(),
      creator
    });
    postMessage(payload.message, tempID, payload.channelID).then(res => {
      ChannelsModule.updateChannel({
        channelID: res.messageCreated.channelID,
        update: { lastMessaged: Date.now() }
      });
    });
  }

  @Mutation
  private REMOVE_CHANNEL_MESSAGE(payload: {
    channelID: string;
    index: number;
  }) {
    this.messages[payload.channelID].splice(payload.index, 1);
  }

  @Action
  RemoveChannelMessage(payload: Message) {
    const index = this.channelMessages(payload.channelID).findIndex(
      c => c.messageID === payload.messageID
    );
    this.REMOVE_CHANNEL_MESSAGE({ index, channelID: payload.channelID });
  }

  @Mutation
  private CLAMP_CHANNEL_MESSAGES(channelID: string) {
    Vue.set(
      this.messages,
      channelID,
      this.messages[channelID].slice(
        this.messages[channelID].length - 51,
        this.messages[channelID].length
      )
    );
  }

  @Action
  ClampChannelMessages(channelID: string) {
    const channelMessagesLength = this.channelMessages(channelID).length;
    const isRouterChannelIDEqual =
      channelID === router.currentRoute.params.channel_id;
    if (channelMessagesLength >= 60) {
      if (!isRouterChannelIDEqual || ScrollModule.isScrolledBottom) {
        this.CLAMP_CHANNEL_MESSAGES(channelID);
      }
    }
  }

  @Mutation
  private ADD_CHANNEL_MESSAGE(payload: Message) {
    this.messages[payload.channelID].push(payload);
  }

  @Action
  public AddChannelMessage(payload: Message) {
    if (!this.channelMessages(payload.channelID)) return;
    this.ADD_CHANNEL_MESSAGE(payload);
    this.ClampChannelMessages(payload.channelID);
  }
}
export const MessagesModule = getModule(Messages);
