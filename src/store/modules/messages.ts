import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import {
  fetchMessages,
  fetchMessagesBefore,
  fetchMessagesContinue,
  postMessage,
} from "@/services/messagesService";
import ky from "ky";
import Message, { Reaction } from "@/interfaces/Message";

import { MeModule } from "./me";
import { ChannelsModule } from "./channels";
import { MessageLogStatesModule } from "./messageLogStates";
import { emitter } from "@/utils/globalBus";

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
  selectedMessageIds: string[] = [];

  get channelMessages() {
    return (id: string) => this.messages[id];
  }
  get lastSentStamp() {
    return (id: string) => this.lastMessageSent[id];
  }
  get isMessageSelected() {
    return (id: string) => this.selectedMessageIds.includes(id);
  }

  get messageReactions() {
    return (payload: { messageID: string; channelId: string }) => {
      const messages = this.messages[payload.channelId];
      const message = messages?.find((m) => m.messageID === payload.messageID);
      if (!message) return undefined;
      if (!message.reactions?.length) return undefined;
      return message.reactions;
    };
  }
  get messageReaction() {
    return (payload: {
      messageID: string;
      channelId: string;
      emojiID?: string;
      unicode?: string;
    }) => {
      const reactions = this.messageReactions(payload);
      return reactions?.find((r) => {
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
    channelId: string;
  }) {
    this.messages[payload.channelId] = payload.messages as Message[];
  }

  @Action
  SetChannelMessages(payload: {
    messages: Message[] | null;
    channelId: string;
  }) {
    this.SET_CHANNEL_MESSAGES(payload);
  }
  @Mutation
  private UNSELECT_MESSAGE(id: string) {
    const index = this.selectedMessageIds.indexOf(id);
    if (index < 0) return;
    this.selectedMessageIds.splice(index, 1);
  }

  @Action
  unselectMessage(id: string) {
    this.UNSELECT_MESSAGE(id);
  }
  @Mutation
  private SELECT_MESSAGE(id: string) {
    const index = this.selectedMessageIds.indexOf(id);
    if (index >= 0) return;
    this.selectedMessageIds.push(id);
  }

  @Action
  selectMessage(id: string) {
    this.SELECT_MESSAGE(id);
  }
  @Mutation
  private DESELECT_ALL() {
    this.selectedMessageIds = [];
  }

  @Action
  deselectAll() {
    this.DESELECT_ALL();
  }

  @Action
  public async FetchAndSetMessages(channelId: string) {
    fetchMessages(channelId)
      .then((res) => {
        this.SetChannelMessages({
          messages: res.messages.reverse(),
          channelId,
        });
      })
      .catch((err: ky.HTTPError) => {
        console.log(err.name);
        // console.log(err.response)
      });
  }
  @Action
  public async continueLoadMessages(channelId: string) {
    const messages = this.messages[channelId];
    if (!messages) return;
    const firstMessage = messages?.find((msg) => msg.messageID);
    if (!firstMessage) return;

    return new Promise<Message[]>((resolve, reject) => {
      fetchMessagesContinue(channelId, firstMessage.messageID || "")
        .then((res) => {
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
  public async beforeLoadMessages(channelId: string) {
    const messages = this.messages[channelId];
    if (!messages) return;
    const messagesReversed = [...messages].reverse();
    const latestMessage = messagesReversed.find((msg) => msg.messageID);
    if (!latestMessage) return;

    return new Promise<Message[]>((resolve, reject) => {
      fetchMessagesBefore(channelId, latestMessage.messageID || "")
        .then((res) => {
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
  public SendMessage(payload: { message: string; channelId: string }) {
    const trimmedMessage = payload.message.trim();
    const tempID = generateNum(25);
    const creator: any = MeModule.user;
    this.AddChannelMessage({
      channelId: payload.channelId,
      message: trimmedMessage,
      tempID,
      type: 0,
      sending: 0,
      created: Date.now(),
      creator,
      quotes: [],
    });
    postMessage(trimmedMessage, tempID, payload.channelId)
      .then((res) => {
        if (ChannelsModule.getDMChannel(payload.channelId)) {
          ChannelsModule.updateChannel({
            channelId: payload.channelId,
            update: { lastMessaged: Date.now() },
          });
        }
        this.UpdateLastMessageSend({
          channelId: payload.channelId,
          timestamp: Date.now(),
        });
        const message = res.messageCreated;
        this.UpdateMessage({
          channelId: message.channelId,
          message: { ...message, sending: 1 },
          tempID,
        });
        return true;
      })
      .catch(async (err) => {
        if (!err.response) return;
        throw await err.response.json();
      })
      .catch((res) => {
        const ttl = res.ttl;
        if (ttl) {
          const rateLimit =
            ChannelsModule.channels[payload.channelId].rateLimit;
          if (rateLimit) {
            const ms = rateLimit * 1000;
            this.UpdateLastMessageSend({
              channelId: payload.channelId,
              timestamp: Date.now() - (ms - ttl),
            });
          }
        }
        this.UpdateMessage({
          channelId: payload.channelId,
          message: { sending: 2 },
          tempID,
        });
        this.AddChannelMessage({
          channelId: payload.channelId,
          message: res.message,
          messageID: Math.random().toString(),
          type: 0,
          created: Date.now(),
          localMessage: true,
          creator: {
            username: "Beep Boop",
            id: "0",
            bot: true,
            tag: "0000",
          },
          quotes: [],
        });
      });
  }

  @Mutation
  private REMOVE_CHANNEL_MESSAGE(payload: {
    channelId: string;
    index: number;
  }) {
    this.messages[payload.channelId].splice(payload.index, 1);
  }

  @Action
  RemoveChannelMessage(payload: Message) {
    const index = this.channelMessages(payload.channelId).findIndex(
      (c) => c.messageID === payload.messageID
    );
    this.REMOVE_CHANNEL_MESSAGE({ index, channelId: payload.channelId });
  }

  @Mutation
  private CLAMP_CHANNEL_MESSAGES(data: {
    channelId: string;
    reverseClamp: boolean;
  }) {
    let clamped: Message[] = [];
    if (!data.reverseClamp) {
      clamped = this.messages[data.channelId].slice(
        this.messages[data.channelId].length - 51,
        this.messages[data.channelId].length
      );
    } else {
      clamped = this.messages[data.channelId].slice(0, -51);
    }

    this.messages[data.channelId] = clamped;
  }

  @Action
  ClampChannelMessages(data: {
    channelId: string;
    reverseClamp?: boolean;
    checkScrolledBottom?: boolean;
  }) {
    const reverseClamp =
      data.reverseClamp === undefined ? false : data.reverseClamp;
    const checkScrolledBottom =
      data.checkScrolledBottom === undefined ? true : data.checkScrolledBottom;

    const channelMessagesLength = this.channelMessages(data.channelId).length;
    const isScrolledDown = MessageLogStatesModule.isScrolledDown(
      data.channelId
    );

    if (channelMessagesLength >= 60) {
      if (checkScrolledBottom ? isScrolledDown : true) {
        this.CLAMP_CHANNEL_MESSAGES({
          channelId: data.channelId,
          reverseClamp,
        });
        return true;
      }
    }
    return false;
  }

  @Mutation
  private ADD_CHANNEL_MESSAGE(payload: Message) {
    this.messages[payload.channelId].push(payload);
  }

  @Action
  public AddChannelMessage(payload: Message) {
    if (!this.channelMessages(payload.channelId)) return;
    if (MessageLogStatesModule.isBottomUnloaded(payload.channelId)) {
      return;
    }
    this.ADD_CHANNEL_MESSAGE(payload);
    this.ClampChannelMessages({ channelId: payload.channelId });
  }
  @Mutation
  private UNSHIFT_CHANNEL_MESSAGE(payload: Message) {
    this.messages[payload.channelId].unshift(payload);
  }

  @Action
  public UnshiftChannelMessage(payload: Message) {
    if (!this.channelMessages(payload.channelId)) return;
    this.UNSHIFT_CHANNEL_MESSAGE(payload);
    this.ClampChannelMessages({
      channelId: payload.channelId,
      reverseClamp: true,
    });
  }
  @Mutation
  private UPDATE_MESSAGE(payload: {
    updateMessage: Partial<Message>;
    index: number;
    channelId: string;
  }) {
    Object.assign(
      this.messages[payload.channelId][payload.index],
      payload.updateMessage
    );
  }

  @Action
  public UpdateMessage(payload: {
    channelId: string;
    messageID?: string;
    tempID?: string;
    message: Partial<Message>;
  }) {
    const messages = this.channelMessages(payload.channelId);
    if (!messages) return;
    const findIndex = messages.findIndex(({ messageID, tempID }) =>
      payload.messageID
        ? payload.messageID === messageID
        : payload.tempID === tempID
    );
    if (findIndex <= -1) return;
    this.UPDATE_MESSAGE({
      index: findIndex,
      updateMessage: payload.message,
      channelId: payload.channelId,
    });
  }

  @Mutation
  private DELETE_MESSAGE(payload: { channelId: string; index: number }) {
    this.messages[payload.channelId].splice(payload.index, 1);
  }
  @Action
  public DeleteMessage(payload: { channelId: string; messageID: string }) {
    const messages = this.channelMessages(payload.channelId);
    if (!messages) return;
    const index = messages.findIndex((m) => m.messageID === payload.messageID);
    if (index <= -1) return;
    this.DELETE_MESSAGE({ channelId: payload.channelId, index });
  }
  @Action
  public deleteBulk(payload: { channelId: string; messageIds: string[] }) {
    const messages = this.channelMessages(payload.channelId);
    const newMessages = messages.filter((message) => {
      if (!message.messageID) return true;
      return !payload.messageIds.includes(message.messageID);
    });
    this.SET_CHANNEL_MESSAGES({
      channelId: payload.channelId,
      messages: newMessages,
    });
    emitter.emit("bulkDeleteMessages");
    if (!newMessages.length) {
      this.FetchAndSetMessages(payload.channelId);
    }
  }

  @Mutation
  private DELETE_CHANNEL_MESSAGES(channelId: string) {
    delete this.messages[channelId];
  }
  @Action
  public DeleteChannelMessages(channelId: string) {
    this.DELETE_CHANNEL_MESSAGES(channelId);
  }
  @Action
  public DeleteServerMessages(serverID: string) {
    const channels = ChannelsModule.serverChannels(serverID);
    if (!channels?.length) return;
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      this.DeleteChannelMessages(channel.channelId);
    }
  }

  @Action
  public UpdateMessageReaction(data: {
    channelId: string;
    messageID: string;
    reaction: Partial<Reaction>;
    removeIfZero: boolean;
  }) {
    const message = this.messages[data.channelId]?.find(
      (m) => m.messageID === data.messageID
    );
    if (!message) return;
    let reactionIndex = message.reactions?.findIndex((r) => {
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
      removeIfZero: data.removeIfZero,
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
        payload.message.reactions.splice(payload.reactionIndex, 1);
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
        ...payload.reaction,
      };
    }
  }
  @Mutation
  private UPDATE_LAST_MESSAGE_SENT(payload: {
    channelId: string;
    timestamp: number;
  }) {
    this.lastMessageSent[payload.channelId] = payload.timestamp;
  }
  @Action
  public UpdateLastMessageSend(payload: {
    channelId: string;
    timestamp: number;
  }) {
    this.UPDATE_LAST_MESSAGE_SENT(payload);
  }
}
export const MessagesModule = getModule(Messages);
