import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import {
  fetchMessages,
  fetchMessagesBefore,
  fetchMessagesContinue,
  postMessage
} from "@/services/messagesService";
import ky from "ky";
import Message, { Reaction } from "@/interfaces/Message";
import Vue from "vue";
import { MeModule } from "./me";
import { ChannelsModule } from "./channels";
import { MessageLogStatesModule } from "./messageLogStates";

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
// channelid: timestamp
interface LastMessage {
  [key: string]: number;
}

@Module({ dynamic: true, store, namespaced: true, name: "messages" })
class Messages extends VuexModule {
  messages: MessagesObj = {};
  lastMessageSent: LastMessage = {};

  get channelMessages() {
    return (id: string) => this.messages[id];
  }
  get lastSentStamp() {
    return (id: string) => this.lastMessageSent[id];
  }

  get messageReactions() {
    return (payload: { messageID: string; channelID: string }) => {
      const messages = this.messages[payload.channelID];
      const message = messages?.find(m => m.messageID === payload.messageID);
      if (!message) return undefined;
      if (!message.reactions?.length) return undefined;
      return message.reactions;
    };
  }
  get messageReaction() {
    return (payload: {
      messageID: string;
      channelID: string;
      emojiID?: string;
      unicode?: string;
    }) => {
      const reactions = this.messageReactions(payload);
      return reactions?.find(r => {
        if (payload.emojiID && payload.emojiID === r.emojiID) {
          return true;
        }
        return payload.unicode && payload.unicode === r.unicode;
      });
    };
  }
  @Mutation
  private SET_CHANNEL_MESSAGES(payload: {
    messages: Message[] | null;
    channelID: string;
  }) {
    this.messages[payload.channelID] = payload.messages as Message[];
  }

  @Action
  SetChannelMessages(payload: {
    messages: Message[] | null;
    channelID: string;
  }) {
    this.SET_CHANNEL_MESSAGES(payload);
  }

  @Action
  public async FetchAndSetMessages(channelID: string) {
    fetchMessages(channelID)
      .then(res => {
        this.SetChannelMessages({
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
  public async continueLoadMessages(channelID: string) {
    const messages = this.messages[channelID];
    if (!messages) return;
    const firstMessage = messages?.find(msg => msg.messageID);
    if (!firstMessage) return;

    return new Promise<Message[]>((resolve, reject) => {
      fetchMessagesContinue(channelID, firstMessage.messageID || "")
        .then(res => {
          resolve(res.messages);
        })
        .catch((err: ky.HTTPError) => {
          reject();
          console.log(err);
          // console.log(err.response)
        });
    });
  }
  @Action
  public async beforeLoadMessages(channelID: string) {
    const messages = this.messages[channelID];
    if (!messages) return;
    const messagesReversed = [...messages].reverse();
    const latestMessage = messagesReversed.find(msg => msg.messageID);
    if (!latestMessage) return;

    return new Promise<Message[]>((resolve, reject) => {
      fetchMessagesBefore(channelID, latestMessage.messageID || "")
        .then(res => {
          resolve(res.messages);
        })
        .catch((err: ky.HTTPError) => {
          reject();
          console.log(err);
          // console.log(err.response)
        });
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
      creator,
      quotes: []
    });
    postMessage(trimmedMessage, tempID, payload.channelID)
      .then(res => {
        if (ChannelsModule.getDMChannel(payload.channelID)) {
          ChannelsModule.updateChannel({
            channelID: payload.channelID,
            update: { lastMessaged: Date.now() }
          });
        }
        this.UpdateLastMessageSend({
          channelID: payload.channelID,
          timestamp: Date.now()
        });
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
        const ttl = res.ttl;
        if (ttl) {
          const rateLimit =
            ChannelsModule.channels[payload.channelID].rateLimit;
          if (rateLimit) {
            const ms = rateLimit * 1000;
            this.UpdateLastMessageSend({
              channelID: payload.channelID,
              timestamp: Date.now() - (ms - ttl)
            });
          }
        }
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
          localMessage: true,
          creator: {
            username: "Beep Boop",
            id: "0",
            bot: true,
            tag: "0000"
          },
          quotes: []
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
  private CLAMP_CHANNEL_MESSAGES(data: {
    channelID: string;
    reverseClamp: boolean;
  }) {
    let clamped: Message[] = [];
    if (!data.reverseClamp) {
      clamped = this.messages[data.channelID].slice(
        this.messages[data.channelID].length - 51,
        this.messages[data.channelID].length
      );
    } else {
      clamped = this.messages[data.channelID].slice(0, -51);
    }

    this.messages[data.channelID] = clamped;
  }

  @Action
  ClampChannelMessages(data: {
    channelID: string;
    reverseClamp?: boolean;
    checkScrolledBottom?: boolean;
  }) {
    const reverseClamp =
      data.reverseClamp === undefined ? false : data.reverseClamp;
    const checkScrolledBottom =
      data.checkScrolledBottom === undefined ? true : data.checkScrolledBottom;

    const channelMessagesLength = this.channelMessages(data.channelID).length;
    const isScrolledDown = MessageLogStatesModule.isScrolledDown(
      data.channelID
    );

    if (channelMessagesLength >= 60) {
      if (checkScrolledBottom ? isScrolledDown : true) {
        this.CLAMP_CHANNEL_MESSAGES({
          channelID: data.channelID,
          reverseClamp
        });
        return true;
      }
    }
    return false;
  }

  @Mutation
  private ADD_CHANNEL_MESSAGE(payload: Message) {
    this.messages[payload.channelID].push(payload);
  }

  @Action
  public AddChannelMessage(payload: Message) {
    if (!this.channelMessages(payload.channelID)) return;
    if (MessageLogStatesModule.isBottomUnloaded(payload.channelID)) {
      return;
    }
    this.ADD_CHANNEL_MESSAGE(payload);
    this.ClampChannelMessages({ channelID: payload.channelID });
  }
  @Mutation
  private UNSHIFT_CHANNEL_MESSAGE(payload: Message) {
    this.messages[payload.channelID].unshift(payload);
  }

  @Action
  public UnshiftChannelMessage(payload: Message) {
    if (!this.channelMessages(payload.channelID)) return;
    this.UNSHIFT_CHANNEL_MESSAGE(payload);
    this.ClampChannelMessages({
      channelID: payload.channelID,
      reverseClamp: true
    });
  }
  @Mutation
  private UPDATE_MESSAGE(payload: {
    updateMessage: Message;
    index: number;
    channelID: string;
  }) {
    this.messages[payload.channelID][payload.index] = payload.updateMessage;
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
    delete this.messages[payload.channelID][payload.index];
  }
  @Action
  public DeleteMessage(payload: { channelID: string; messageID: string }) {
    const messages = this.channelMessages(payload.channelID);
    if (!messages) return;
    const index = messages.findIndex(m => m.messageID === payload.messageID);
    if (index <= -1) return;
    this.DELETE_MESSAGE({ channelID: payload.channelID, index });
  }

  @Mutation
  private DELETE_CHANNEL_MESSAGES(channelID: string) {
    delete this.messages[channelID];
  }
  @Action
  public DeleteChannelMessages(channelID: string) {
    this.DELETE_CHANNEL_MESSAGES(channelID);
  }
  @Action
  public DeleteServerMessages(serverID: string) {
    const channels = ChannelsModule.serverChannels(serverID);
    if (!channels?.length) return;
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      this.DeleteChannelMessages(channel.channelID);
    }
  }

  @Action
  public UpdateMessageReaction(data: {
    channelID: string;
    messageID: string;
    reaction: Partial<Reaction>;
    removeIfZero: boolean;
  }) {
    const message = this.messages[data.channelID]?.find(
      m => m.messageID === data.messageID
    );
    if (!message) return;
    let reactionIndex = message.reactions?.findIndex(r => {
      if (data.reaction.emojiID && data.reaction.emojiID === r.emojiID) {
        return true;
      }
      return data.reaction.unicode && data.reaction.unicode === r.unicode;
    });
    if (reactionIndex === undefined) reactionIndex = -1;
    this.UPDATE_MESSAGE_REACTION({
      message,
      reaction: data.reaction,
      reactionIndex,
      removeIfZero: data.removeIfZero
    });
  }

  @Mutation
  private UPDATE_MESSAGE_REACTION(payload: {
    message: Message;
    reaction: Partial<Reaction>;
    reactionIndex: number;
    removeIfZero: boolean;
  }) {
    const reactions = payload.message.reactions || [];
    if (payload.reaction.count === 0) {
      if (!payload.message.reactions) return;
      if (reactions.length === 0) return;
      if (payload.reactionIndex < 0) return;
      if (payload.removeIfZero) {
        delete payload.message.reactions[payload.reactionIndex];
        return;
      }
    }
    if (payload.reactionIndex < 0 || !reactions[payload.reactionIndex]) {
      reactions.push(payload.reaction as any);
      payload.message["reactions"] = reactions;
    } else {
      if (!payload.message.reactions) return;
      payload.message.reactions[payload.reactionIndex] = {
        ...reactions[payload.reactionIndex],
        ...payload.reaction
      };
    }
  }
  @Mutation
  private UPDATE_LAST_MESSAGE_SENT(payload: {
    channelID: string;
    timestamp: number;
  }) {
    this.lastMessageSent[payload.channelID] = payload.timestamp;
  }
  @Action
  public UpdateLastMessageSend(payload: {
    channelID: string;
    timestamp: number;
  }) {
    this.UPDATE_LAST_MESSAGE_SENT(payload);
  }
}
export const MessagesModule = getModule(Messages);
