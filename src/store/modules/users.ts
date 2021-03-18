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
import Vue from "vue";

interface UsersObj {
  [key: string]: User;
}

@Module({ dynamic: true, store, namespaced: true, name: "users" })
class Users extends VuexModule {
  users: UsersObj = {};
  blockedUserIDArr: string[] = [];

  @Mutation
  private ADD_USER(payload: User) {
    Vue.set(this.users, payload.uniqueID, payload);
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
  @Mutation
  private ADD_USERS(payload: UsersObj | any) {
    Vue.set(this, "users", { ...this.users, ...payload });
  }

  @Action
  public AddUsers(payload: UsersObj | any) {
    this.ADD_USERS(payload);
  }
  @Mutation
  private INIT_BLOCKED_USERS(payload: string[]) {
    this.blockedUserIDArr = payload;
  }

  @Action
  public InitBlockedUsers(payload: string[]) {
    this.INIT_BLOCKED_USERS(payload);
  }

  @Mutation
  private BLOCK_USER(uniqueID: string) {
    if (this.blockedUserIDArr.includes(uniqueID)) return;
    this.blockedUserIDArr.push(uniqueID);
  }

  @Action
  public blockUser(uniqueID: string) {
    this.BLOCK_USER(uniqueID);
  }

  @Mutation
  private UNBLOCK_USER(uniqueID: string) {
    if (!this.blockedUserIDArr.includes(uniqueID)) return;
    const newBlockedArr = this.blockedUserIDArr.filter(id => id !== uniqueID)
    Vue.set(this, "blockedUserIDArr", newBlockedArr);
  }
  @Action
  public unblockUser(uniqueID: string) {
    this.UNBLOCK_USER(uniqueID);
  }
}

export const UsersModule = getModule(Users);
