import Channel from "@/interfaces/Channel";
import { ChannelsModule } from "@/store/modules/channels";
import { UsersModule } from "@/store/modules/users";
import emojiParser from "./emojiParser";

function replaceMentions(message: string) {
  const regex = /@([^@]+?(?=:)):([\w]*)/g;

  return message.replace(regex, (word) => {
    const [username, tag] = word.split(":");
    if (!username || !tag) return word;
    const member = Object.values(UsersModule.users).find(
      (m) => "@" + m.username === username && m.tag === tag
    );
    if (!member) return word;
    return `<@${member.id}>`;
  });
}
function replaceChannelMentions(message: string, channels: Channel[]) {
  const getChannel = (name: string) => channels.find((c) => c.name === name);

  const result: string[] = [];
  const reg = /#([^#]+?)#/g;
  let name;

  let lastIndex = reg.lastIndex;
  let i = 0;

  while ((name = reg.exec(message)) !== null) {
    const channel = name[1] && getChannel(name[1]);
    if (channel) {
      result.push(message.slice(lastIndex, name.index));
      result.push(`<#${channel.channelId}>`);
      lastIndex = name.index + name[0].length;
    } else {
      reg.lastIndex = lastIndex + i;
    }
    i += 1;
  }
  result.push(message.slice(lastIndex));
  return result.join("");
}

// used before sending a message to convert:
// :name: to <g:name:1234>
// #channelname# to <#1234>
// @username:tag to <@1234>
export function formatMessage(message: string, channels?: Channel[]) {
  let formatted = message;
  formatted = emojiParser.replaceShortcode(formatted);
  formatted = replaceMentions(formatted);
  if (channels?.length) {
    formatted = replaceChannelMentions(formatted, channels);
  }
  return formatted;
}

// replace mention <@1234> with @test:owo1
function revertMentions(message: string) {
  return message.replace(/<@([\d]+)>/g, (res) => {
    const id = res.slice(2, res.length - 1);
    const member = UsersModule.users[id];
    if (!member) return res;
    return `@${member.username}:${member.tag}`;
  });
}
// replace channel <#1234> with #channel#
function revertChannel(message: string) {
  return message.replace(/<#([\d]+)>/g, (res) => {
    const id = res.slice(2, res.length - 1);
    const channel = ChannelsModule.channels[id];
    if (!channel?.name) return res;
    return `#${channel.name}#`;
  });
}

// used when editing a message to convert:
// <g:name:1234> to :name:
// <#1234> to #channelname#
// <@1234> to @username:tag
export function revertFormat(message: string) {
  let formatted = message;
  formatted = emojiParser.emojiToShortcode(formatted);
  formatted = revertMentions(formatted);
  formatted = revertChannel(formatted);
  return formatted;
}
