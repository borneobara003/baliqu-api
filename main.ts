import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import nodeSchedule from "node-schedule";
import { PORT } from "@/utils";
import { trpc } from "@/config";
import authRouter from "@/routes/auth";
import groupProductRouter from "@/routes/group-product";
import typeProductRouter from "@/routes/type-product";
import itemProductRouter from "@/routes/item-product";
import customerRouter from "@/routes/customers";
import { connectToWhatsApp } from "@/config/wa";
import reservationRouter from "@/routes/booking/reservation";

const router = trpc.router;

const appRouter = router({
  auth: authRouter,
  groupProduct: groupProductRouter,
  typeProduct: typeProductRouter,
  itemProduct: itemProductRouter,
  customer: customerRouter,
  reservation: reservationRouter,
});

export type AppRouter = typeof appRouter;

// Run schedule every 1 hour
const schedule = nodeSchedule.scheduleJob("* */1 * * *", async () => {
  const time = new Date();
  console.log("Running schedule", time);
});

console.log("Running schedule first time");

async function main() {
  const wa = await connectToWhatsApp();

  createHTTPServer({
    middleware: cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
    router: appRouter,
    createContext: (opt) => {
      const token = opt.req?.headers?.authorization || "";
      return {
        token,
        wa,
      };
    },
  }).listen(PORT);
}

main();
