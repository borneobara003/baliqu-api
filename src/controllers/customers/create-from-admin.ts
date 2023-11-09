import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { sendMessage } from "@/utils/wa";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const createCustomerFromAdmin = protectedProcedure
  .input(
    z.object({
      full_name: z.string(),
      email: z.string(),
      address: z.string(),
      phone_code: z.string(),
      phone_number: z.string(),
      identity_card_image: z.string(),
      profile_image: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const customer = await prisma.customer.create({
        data: {
          full_name: input?.full_name,
          email: input?.email,
          address: input?.address,
          phone_code: input?.phone_code,
          phone_number: input?.phone_number,
          status: "ACTIVE",
          identity_card_image: input?.identity_card_image,
          profile_image: input?.profile_image,
        },
      });
      sendMessage({
        whatsapp: ctx?.wa,
        phone: `${input?.phone_code}${input?.phone_number}`,
        message: `Hello ${input?.full_name}, you have successfully registered as a customer of BaliQu.`,
      });
      return {
        customer,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default createCustomerFromAdmin;
