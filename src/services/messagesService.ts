import wrapper from "./wrapper";
import Message from "@/interfaces/Message";
import Vue from "vue";
import config from "@/config";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;

interface ResponseFetch {
  channelID: string;
  messages: Message[];
}
interface ResponsePost {
  tempID: string;
  messageCreated: Message;
}
export function fetchMessages(channelID: string): Promise<ResponseFetch> {
  return wrapper.get(`messages/channels/${channelID}`).json();
}
export function deleteMessage(
  channelID: string,
  messageID: string
): Promise<any> {
  return wrapper.delete(`messages/${messageID}/channels/${channelID}`).json();
}
export function postMessage(
  message: string,
  tempID: string,
  channelID: string
): Promise<ResponsePost> {
  return wrapper
    .post(`messages/channels/${channelID}`, {
      json: { message, tempID, socketID: socket().id }
    })
    .json();
}

export function editMessage(
  messageID: string, channelID: string, data: any
): Promise<ResponsePost> {
  return wrapper
    .patch(`messages/${messageID}/channels/${channelID}`, {
      json: data
    })
    .json();
}


export function postTypingStatus(channelID: string): Promise<ResponsePost> {
  return wrapper.post(`messages/${channelID}/typing`).json();
}

export function postFormDataMessage(
  message: string,
  cdn: number,
  channelID: string,
  file: File,
  isImage: boolean,
  compress: boolean,
  callback: (error: any, progress: number | null, done: boolean | null) => void
) {
  const formData = new FormData();
  if (message) {
    formData.append("message", message);
  }
  formData.append("upload_cdn", cdn.toString());
  if (isImage && compress) {
    formData.append("compress", "1");
  }
  formData.append("file", file);

  const request = new XMLHttpRequest();
  request.open("POST", config.fetchPrefix + `/messages/channels/${channelID}`);
  request.setRequestHeader(
    "authorization",
    localStorage.getItem("hauthid") || ""
  );

  request.onreadystatechange = function(oEvent) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(null, null, true);
      } else {
        callback(JSON.parse(request.response), null, null);
      }
    }
  };
  request.upload.onprogress = progressEvent => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );

    // execute the callback
    if (callback) callback(null, percentCompleted, null);

    return percentCompleted;
  };

  request.send(formData);

  // return wrapper
  //   .post(`messages/chanfnels/${channelID}`, {
  //     body: formData,

  //   })
  //   .json();
}
