import { voiceChannelModule } from '@/store/modules/voiceChannels';
import Peer from 'simple-peer';
import SocketIO from "socket.io-client";
import Vue from 'vue';

const socket = (() => Vue.prototype.$socket.client) as typeof SocketIO;


// call
export function createPeer(channelId: string, signalToUserId: string) {
    const peer = new Peer({
        initiator: true,
        trickle: true,
    })
    peer.on("signal", signal => {
        socket().emit("voice:send_signal", {channelId, signalToUserId, signal})
    })
    peer.on("connect", () => {
        voiceChannelModule.update({
            channelId: channelId,
            userId: signalToUserId,
            update: {connected: true}
        })
        console.log("connected")
    })
    return peer;
}

// accept
export function addPeer(channelId: string, signalToUserId: string, signal: Peer.SignalData) {
    const peer = new Peer({
        initiator: false,
        trickle: true,
    })
    peer.on("signal", signal => {
        socket().emit("voice:send_return_signal", {signalToUserId, channelId, signal})
    })
    peer.on("connect", () => {
        voiceChannelModule.update({
            channelId: channelId,
            userId: signalToUserId,
            update: {connected: true}
        })
        console.log("connected")
    })
    peer.signal(signal);
    return peer;
}