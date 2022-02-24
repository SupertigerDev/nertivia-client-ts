import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

import { postFormDataMessage } from "@/services/messagesService";
import { MessagesModule } from "./messages";
import fileSize from "filesize";

export interface UploadQueue {
  message: string;
  uploading: boolean;
  compress: boolean;
  isImage: boolean;
  cdn: number;
  file: File;
  channelId: string;
  progress: number;
}

@Module({ dynamic: true, store, namespaced: true, name: "fileUpload" })
class FileUpload extends VuexModule {
  file: { file?: File } = {};
  isImage = false;
  cdn = 0;
  compress = true;
  uploadQueue: UploadQueue[] = [];

  @Mutation
  private SET_FILE(payload: File | undefined) {
    this.file.file = payload;
  }

  @Action
  public SetFile(payload: File | undefined) {
    this.SET_FILE(payload);
    if (payload === undefined) {
      this.SetIsImage(false);
      this.SetCompress(false);
      this.SetCDN(0);
    }
  }
  @Mutation
  private SET_IS_IMAGE(payload: boolean) {
    this.isImage = payload;
  }

  @Action
  public SetIsImage(payload: boolean) {
    this.SET_IS_IMAGE(payload);
    if (payload === true) {
      this.SetCompress(true);
      this.SetCDN(1);
    }
  }
  @Mutation
  private SET_CDN(payload: number) {
    this.cdn = payload;
  }

  @Action
  public SetCDN(payload: number) {
    this.SET_CDN(payload);
  }
  @Mutation
  private SET_QUEUE_UPLOADING(payload: { index: number; value: boolean }) {
    this.uploadQueue[payload.index].uploading = payload.value;
  }

  @Action
  public SetQueueUploading(payload: { index: number; value: boolean }) {
    this.SET_QUEUE_UPLOADING(payload);
  }
  @Mutation
  private SET_QUEUE_PROGRESS(payload: { index: number; value: number }) {
    this.uploadQueue[payload.index].progress = payload.value;
  }

  @Action
  public SetQueueProgress(payload: { index: number; value: number }) {
    this.SET_QUEUE_PROGRESS(payload);
  }
  @Mutation
  private REMOVE_FROM_QUEUE(payload: { index: number }) {
    this.uploadQueue.splice(payload.index, 1);
  }

  @Action
  public RemoveFromQueue(payload: { index: number }) {
    this.REMOVE_FROM_QUEUE(payload);
  }
  @Mutation
  private SET_COMPRESS(payload: boolean) {
    this.compress = payload;
  }

  @Action
  public SetCompress(payload: boolean) {
    this.SET_COMPRESS(payload);
  }

  @Mutation
  private ADD_TO_QUEUE(payload: { channelId: string; message: string }) {
    if (!this.file.file) return;
    this.uploadQueue.push({
      message: payload.message,
      uploading: false,
      compress: this.compress,
      isImage: this.isImage,
      cdn: this.cdn,
      channelId: payload.channelId,
      file: this.file.file,
      progress: 0,
    });
  }

  @Action
  public AddToQueue(payload: { channelId: string; message: string }) {
    this.ADD_TO_QUEUE(payload);
    this.SetFile(undefined);
    this.RunQueue();
  }

  @Action
  public async RunQueue() {
    if (!this.uploadQueue[0]) return;
    const isUploading = this.uploadQueue[0].uploading;
    if (isUploading) return;
    this.SetQueueUploading({ index: 0, value: true });
    const currentItem = this.uploadQueue[0];
    postFormDataMessage(
      currentItem.message,
      currentItem.cdn,
      currentItem.channelId,
      currentItem.file,
      currentItem.isImage,
      currentItem.compress,
      (error, progress, done) => {
        if (error) {
          MessagesModule.AddChannelMessage({
            channelId: currentItem.channelId,
            localMessage: true,
            message:
              JSON.stringify(error.message) +
              `\n\nMessage: ${currentItem.message}\nFile name: ${
                currentItem.file.name
              }\nFile size: ${fileSize(currentItem.file.size)}`,
            messageID: Math.random().toString(),
            type: 0,
            created: Date.now(),
            creator: {
              username: "Beep Boop",
              id: "0",
              bot: true,
              tag: "0000",
            },
            quotes: [],
          });
          this.RemoveFromQueue({ index: 0 });
          this.RunQueue();
        }
        if (progress) {
          this.SetQueueProgress({ index: 0, value: progress });
        }
        if (done) {
          this.RemoveFromQueue({ index: 0 });
          this.RunQueue();
        }
      }
    );
  }
}
export const FileUploadModule = getModule(FileUpload);
