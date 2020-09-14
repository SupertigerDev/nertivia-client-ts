import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";

interface User {
  username?: string | null;
  tag?: string | null;
  email?: string | null;
  avatar?: string | null;
  uniqueID?: string | null;
}

@Module({ dynamic: true, store, namespaced: true, name: "me" })
class Me extends VuexModule {
  user: User = {
    username: null,
    tag: null,
    email: null,
    avatar: null,
    uniqueID: null
  };
  connected = false;
  connectionMessage: string | null = "Connecting...";

  @Mutation
  private SET_USER(payload: User) {
    this.user = payload;
  }

  @Action
  public SetUser(payload: User) {
    saveCache("me", payload);
    this.SET_USER(payload);
  }

  @Mutation
  private SET_CONNECTION_DETAILS(payload: {
    connected: boolean;
    message: string | null;
  }) {
    this.connected = payload.connected;
    this.connectionMessage = payload.message;
  }

  @Action
  public SetConnectionDetails(payload: {
    connected: boolean;
    message: string | null;
  }) {
    this.SET_CONNECTION_DETAILS(payload);
  }
}
export const MeModule = getModule(Me);
