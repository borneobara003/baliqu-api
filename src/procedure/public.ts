import { trpc } from "@/config";
import loggerMiddleware from "@/middlewares/log";

const publicProcedure = trpc.procedure.use(loggerMiddleware);

export default publicProcedure;
