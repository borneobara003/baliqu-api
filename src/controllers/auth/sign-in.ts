import prisma from "@/prisma";
import publicProcedure from "@/procedure/public";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils";
import { TRPCError } from "@trpc/server";
import { IUserToken } from "@/types";
import { sendMessage } from "@/utils/wa";

const signInController = publicProcedure
  .input(
    z.object({
      email_or_username: z.string().min(3),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: input.email_or_username,
            },
            {
              username: input.email_or_username,
            },
          ],
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const password = await bcrypt.compare(input.password, user.password);
      if (!password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Password is invalid",
        });
      }
      const userToken: IUserToken = { id: user.id, username: user.username };
      const token = jwt.sign(userToken, JWT_SECRET);
      const data = {
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        username: user.username,
        is_super_admin: user.is_super_admin,
      };

      sendMessage({
        message: `Hello ${user.full_name}, you have successfully logged in to the BaliQu admin panel.`,
        phone: `62${user.phone_number}`,
        whatsapp: ctx?.wa,
      });

      return {
        token,
        data,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default signInController;
