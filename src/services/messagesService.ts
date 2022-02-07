import wrapper from "./wrapper";
import Message from "@/interfaces/Message";
import User from "@/interfaces/User";
import { socket } from "@/socket";

interface ResponseFetch {
  channelID: string;
  messages: Message[];
}
type ResponsePost = Message & { tempID: string };
export function fetchMessages(channelId: string): Promise<ResponseFetch> {
  return wrapper().get(`channels/${channelId}/messages`).json();
}
export function fetchMessagesContinue(
  channelId: string,
  continueMessageId: string
): Promise<ResponseFetch> {
  return wrapper()
    .get(`/channels/${channelId}/messages?continue=${continueMessageId}`)
    .json();
}
export function deleteMessages(
  channelId: string,
  messageIds: string[]
): Promise<ResponseFetch> {
  return wrapper()
    .delete(`channels/${channelId}/messages/bulk`, {
      json: { ids: messageIds },
    })
    .json();
}
export function fetchMessagesBefore(
  channelId: string,
  beforeMessageId: string
): Promise<ResponseFetch> {
  return wrapper()
    .get(`channels/${channelId}/messages?before=${beforeMessageId}`)
    .json();
}
export function fetchMessagesAround(
  channelId: string,
  messageId: string
): Promise<ResponseFetch> {
  return wrapper()
    .get(`channels/${channelId}/messages?around=${messageId}`)
    .json();
}

export interface PostReaction {
  emojiID?: string;
  gif?: boolean;
  unicode?: string;
}

export function addReaction(
  channelId: string,
  messageId: string,
  reaction: PostReaction
): Promise<any> {
  return wrapper()
    .post(`channels/${channelId}/messages/${messageId}/reactions`, {
      json: reaction,
    })
    .json();
}
export function getReactedUsers(
  channelId: string,
  messageId: string,
  limit: number,
  emojiID?: string,
  unicode?: string
): Promise<User[]> {
  const searchParams: any = { limit };
  if (emojiID) {
    searchParams.emojiID = emojiID;
  } else {
    searchParams.unicode = unicode;
  }
  return wrapper()
    .get(`channels/${channelId}/messages/${messageId}/reactions`, {
      searchParams,
    })
    .json();
}
export function removeReaction(
  channelId: string,
  messageId: string,
  reaction: PostReaction
): Promise<any> {
  return wrapper()
    .delete(`channels/${channelId}/messages/${messageId}/reactions`, {
      json: reaction,
    })
    .json();
}

export function deleteMessage(
  channelId: string,
  messageId: string
): Promise<any> {
  return wrapper().delete(`channels/${channelId}/messages/${messageId}`).json();
}
export function postMessage(
  message: string,
  tempId: string,
  channelId: string
): Promise<ResponsePost> {
  return wrapper()
    .post(`channels/${channelId}/messages`, {
      json: { message, tempID: tempId, socketID: socket.id },
    })
    .json();
}

export function editMessage(
  messageID: string,
  channelID: string,
  data: any
): Promise<ResponsePost> {
  return wrapper()
    .patch(`messages/${messageID}/channels/${channelID}`, {
      json: data,
    })
    .json();
}
export function buttonClick(
  channelId: string,
  messageId: string,
  buttonId: string
): Promise<any> {
  return wrapper()
    .post(`channels/${channelId}/messages/${messageId}/buttons/${buttonId}`)
    .json();
}

export function postTypingStatus(channelId: string): Promise<ResponsePost> {
  return wrapper().post(`channels/${channelId}/typing`).json();
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
  request.open(
    "POST",
    process.env.VUE_APP_FETCH_PREFIX + `/channels/${channelID}/messages`
  );
  request.setRequestHeader(
    "authorization",
    localStorage.getItem("hauthid") || ""
  );

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(null, null, true);
      } else {
        callback(JSON.parse(request.response), null, null);
      }
    }
  };
  request.upload.onprogress = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );

    // execute the callback
    if (callback) callback(null, percentCompleted, null);

    return percentCompleted;
  };

  request.send(formData);

  // return wrapper()
  //   .post(`messages/chanfnels/${channelID}`, {
  //     body: formData,

  //   })
  //   .json();
}
