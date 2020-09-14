import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import User from "@/interfaces/User";
import store from "..";
import { saveCache } from "@/utils/localCache";

interface UsersObj {
  [key: string]: User;
}

@Module({ dynamic: true, store, namespaced: true, name: "users" })
class Users extends VuexModule {
  users: UsersObj = {};

  @Mutation
  private ADD_USER(payload: User) {
    this.users[payload.uniqueID] = payload;
  }

  @Action
  public AddUser(payload: User) {
    this.ADD_USER(payload);
  }

  @Mutation
  private INIT_USERS(payload: UsersObj | any) {
    this.users = payload;
  }

  @Action
  public InitUsers(payload: UsersObj | any) {
    saveCache("users", payload);
    this.INIT_USERS(payload);
  }
}

export const UsersModule = getModule(Users);
