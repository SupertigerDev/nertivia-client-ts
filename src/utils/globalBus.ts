import mitt, { Emitter } from "mitt";
export const emitter = mitt() as Emitter<any>;
