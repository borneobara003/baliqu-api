import { trpc } from "@/config";
import { IUserToken } from "@/types";
import { JWT_SECRET } from "@/utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

const middleware = trpc.middleware;

const authMiddleware = middleware(async (opts) => {
  const { next, ctx } = opts;
  try {
    const decodedToken = jwt.verify(ctx.token, JWT_SECRET) as IUserToken | null;
    return await next({
      ctx: {
        user: decodedToken || null,
      },
    });
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "invalid token",
    });
  }
});

export default authMiddleware;
