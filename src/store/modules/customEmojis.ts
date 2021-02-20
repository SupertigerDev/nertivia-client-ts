import CustomEmoji from "@/interfaces/CustomEmoji";
import Vue from "vue";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "customEmojis" })
class CustomEmojis extends VuexModule {
  customEmojis: CustomEmoji[] = [];

  @Mutation
  private INIT_CUSTOM_EMOJIS(payload: CustomEmoji[]) {
    this.customEmojis = payload;
  }

  @Action
  public InitCustomEmojis(payload: CustomEmoji[]) {
    this.INIT_CUSTOM_EMOJIS(payload);
  }
  @Mutation
  private DELETE_EMOJI(emojiID: string) {
    const index = this.customEmojis.findIndex(e => e.emojiID === emojiID);
    if (index < 0) return;
    Vue.delete(this.customEmojis, index);
  }

  @Action
  public DeleteEmoji(emojiID: string) {
    this.DELETE_EMOJI(emojiID);
  }
  @Mutation
  private UPDATE_EMOJI(data: { emojiID: string; name: string }) {
    const index = this.customEmojis.findIndex(e => e.emojiID === data.emojiID);
    if (index < 0) return;
    Vue.set(this.customEmojis[index], "name", data.name);
  }

  @Action
  public UpdateEmoji(data: { emojiID: string; name: string }) {
    this.UPDATE_EMOJI({ emojiID: data.emojiID, name: data.name });
  }

  @Mutation
  private ADD_CUSTOM_EMOJI(data: CustomEmoji) {
    this.customEmojis.push(data);
  }

  @Action
  public AddCustomEmoji(data: CustomEmoji) {
    this.ADD_CUSTOM_EMOJI(data);
  }
}
export const CustomEmojisModule = getModule(CustomEmojis);
