import { IUserToken } from "@/types";
import { initTRPC } from "@trpc/server";

export interface IContext {
  token: string;
  user?: IUserToken;
  wa?: any;
}

export const trpc = initTRPC.context<IContext>().create();
