import CustomEmoji from "@/interfaces/CustomEmoji";

import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
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
  private DELETE_EMOJI(id: string) {
    const index = this.customEmojis.findIndex((e) => e.id === id);
    if (index < 0) return;
    this.customEmojis.splice(index);
  }

  @Action
  public DeleteEmoji(id: string) {
    this.DELETE_EMOJI(id);
  }
  @Mutation
  private UPDATE_EMOJI(data: { id: string; name: string }) {
    const index = this.customEmojis.findIndex(
      (e) => e.id === data.id
    );
    if (index < 0) return;
    this.customEmojis[index].name = data.name;
  }

  @Action
  public UpdateEmoji(data: { id: string; name: string }) {
    this.UPDATE_EMOJI({ id: data.id, name: data.name });
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
