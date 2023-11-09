import { trpc } from "@/config";
import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/log";

const loggerProcedure = trpc.procedure.use(loggerMiddleware);
const protectedProcedure = loggerProcedure.use(authMiddleware);

export default protectedProcedure;
