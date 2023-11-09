import { trpc } from "@/config";
import signUpController from "@/controllers/auth/sign-up";
import signInController from "@/controllers/auth/sign-in";
import verifyController from "@/controllers/auth/verify";

const router = trpc.router;

const authRouter = router({
  signUp: signUpController,
  signIn: signInController,
  verify: verifyController,
});

export default authRouter;
