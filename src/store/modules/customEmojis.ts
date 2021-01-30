import CustomEmoji from "@/interfaces/CustomEmoji";
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
}
export const CustomEmojisModule = getModule(CustomEmojis);
