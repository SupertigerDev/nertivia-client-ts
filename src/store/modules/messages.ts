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

interface MessagesObj {
  [key: string]: Message[];
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
  public sendMessage(payload: {message: string, channelID: string}) {
    postMessage(payload.message, "123", payload.channelID);
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
