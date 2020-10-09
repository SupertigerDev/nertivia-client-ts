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

  // Group messages IF:
  // They are sent in the same minute.
  // They are sent by the same creator.
  // The group is less than 4 messages.
  get groupedChannelMessages() {
    return (id: string) => {
      const messages = this.messages[id];

      const creatorMatch = (message1: Message, message2: Message) =>
        message1.creator.uniqueID === message2.creator.uniqueID;

      const isMoreThanAMinute = (
        beforeMessage: Message,
        afterMessage: Message
      ) => {
        const beforeDate = new Date(beforeMessage.created);
        const afterDate = new Date(afterMessage.created);
        const minutesMatch = () =>
          beforeDate.getMinutes() === afterDate.getMinutes();
        const hoursMatch = () => beforeDate.getHours() === afterDate.getHours();
        return !(minutesMatch() && hoursMatch());
      };

      let count = 0;
      return messages.map((currentMessage, index) => {
        const beforeMessage = messages[index - 1];
        if (!beforeMessage || !creatorMatch(beforeMessage, currentMessage)) {
          count = 0;
          return currentMessage;
        }

        if (count >= 4 || isMoreThanAMinute(beforeMessage, currentMessage)) {
          count = 0;
          return currentMessage;
        }
        count += 1;
        return { ...currentMessage, grouped: true };
      });
    };
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
  public SendMessage(payload: { message: string; channelID: string }) {
    const trimmedMessage = payload.message.trim();
    const tempID = generateNum(25);
    const creator: any = MeModule.user;
    this.AddChannelMessage({
      channelID: payload.channelID,
      message: trimmedMessage,
      tempID,
      type: 0,
      sending: 0,
      created: Date.now(),
      creator
    });
    postMessage(trimmedMessage, tempID, payload.channelID)
      .then(res => {
        const message = res.messageCreated;
        this.UpdateMessage({
          channelID: message.channelID,
          message: { ...message, sending: 1 },
          tempID
        });
        return true;
      })
      .catch(async err => {
        if (!err.response) return;
        throw await err.response.json();
      })
      .catch(res => {
        this.UpdateMessage({
          channelID: payload.channelID,
          message: { sending: 2 },
          tempID
        });
        this.AddChannelMessage({
          channelID: payload.channelID,
          message: res.message,
          messageID: Math.random().toString(),
          type: 0,
          created: Date.now(),
          creator: {
            username: "Beep Boop",
            uniqueID: "0",
            tag: "0000"
          }
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
  @Mutation
  private UPDATE_MESSAGE(payload: {
    updateMessage: Message;
    index: number;
    channelID: string;
  }) {
    Vue.set(
      this.messages[payload.channelID],
      payload.index,
      payload.updateMessage
    );
  }

  @Action
  public UpdateMessage(payload: {
    channelID: string;
    messageID?: string;
    tempID?: string;
    message: Partial<Message>;
  }) {
    const messages = this.channelMessages(payload.channelID);
    if (!messages) return;
    const findIndex = messages.findIndex(({ messageID, tempID }) =>
      payload.messageID
        ? payload.messageID === messageID
        : payload.tempID === tempID
    );
    if (findIndex <= -1) return;
    this.UPDATE_MESSAGE({
      index: findIndex,
      updateMessage: { ...messages[findIndex], ...payload.message },
      channelID: payload.channelID
    });
  }

  @Mutation
  private DELETE_MESSAGE(payload: { channelID: string; index: number }) {
    Vue.delete(this.messages[payload.channelID], payload.index);
  }
  @Action
  public DeleteMessage(payload: { channelID: string; messageID: string }) {
    const messages = this.channelMessages(payload.channelID);
    if (!messages) return;
    const index = messages.findIndex(m => m.messageID === payload.messageID);
    if (index <= -1) return;
    this.DELETE_MESSAGE({ channelID: payload.channelID, index });
  }
}
export const MessagesModule = getModule(Messages);
