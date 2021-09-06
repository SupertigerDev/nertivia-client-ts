import {
  CallParticipant,
  voiceChannelModule
} from "@/store/modules/voiceChannels";
import Peer from "simple-peer";
import SocketIO from "socket.io-client";
import Vue from "vue";

const socket = (() => Vue.prototype.$socket.client) as typeof SocketIO;

// const audioCtx = new AudioContext();
// audioCtx.createMediaStreamDestination().stream

// const blankStream = audioCtx.createMediaStreamDestination().stream

// (navigator.mediaDevices as any).getDisplayMedia({video: true}).then((stream) => {
//     blankStream = stream;
// })
// console.log(blankStream)
// call
export function createPeer(
  channelId: string,
  signalToUserId: string,
  streams?: Array<MediaStream>
) {
  const peer = new Peer({
    initiator: true,
    trickle: true,
    streams
  });
  peer.on("signal", signal => {
    socket().emit("voice:send_signal", { channelId, signalToUserId, signal });
  });
  peer.on("stream", stream => {
    const update: CallParticipant = {};
    if (stream.getVideoTracks().length) {
      update.videoStream = stream;
    } else {
      update.audioStream = stream;
    }
    voiceChannelModule.update({
      channelId: channelId,
      userId: signalToUserId,
      update
    });
  });
  peer.on("connect", () => {
    voiceChannelModule.update({
      channelId: channelId,
      userId: signalToUserId,
      update: { connected: true }
    });
    console.log("connected");
  });
  return peer;
}

// accept
export function addPeer(
  channelId: string,
  signalToUserId: string,
  signal: Peer.SignalData,
  streams?: Array<MediaStream>
) {
  const peer = new Peer({
    initiator: false,
    trickle: true,
    streams
  });
  peer.on("signal", signal => {
    socket().emit("voice:send_return_signal", {
      signalToUserId,
      channelId,
      signal
    });
  });
  peer.on("stream", stream => {
    const update: CallParticipant = {};
    if (stream.getVideoTracks().length) {
      update.videoStream = stream;
    } else {
      update.audioStream = stream;
    }
    voiceChannelModule.update({
      channelId: channelId,
      userId: signalToUserId,
      update
    });
  });
  peer.on("connect", () => {
    voiceChannelModule.update({
      channelId: channelId,
      userId: signalToUserId,
      update: { connected: true }
    });
    console.log("connected");
  });
  peer.signal(signal);
  return peer;
}
