import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
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
  blockedUserIDArr: string[] = [];

  @Mutation
  private ADD_USER(payload: User) {
    this.users[payload.id] = payload;
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
    this.users = { ...this.users, ...payload };
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
  private BLOCK_USER(id: string) {
    if (this.blockedUserIDArr.includes(id)) return;
    this.blockedUserIDArr.push(id);
  }

  @Action
  public blockUser(id: string) {
    this.BLOCK_USER(id);
  }

  @Mutation
  private UNBLOCK_USER(id: string) {
    if (!this.blockedUserIDArr.includes(id)) return;
    const newBlockedArr = this.blockedUserIDArr.filter((id) => id !== id);
    this.blockedUserIDArr = newBlockedArr;
  }
  @Action
  public unblockUser(id: string) {
    this.UNBLOCK_USER(id);
  }
}

export const UsersModule = getModule(Users);
