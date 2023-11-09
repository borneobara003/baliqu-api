import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateCustomerFromAdmin = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      full_name: z.string(),
      email: z.string(),
      address: z.string(),
      phone_code: z.string(),
      phone_number: z.string(),
      identity_card_image: z.string().optional(),
      profile_image: z.string().optional(),
      // value is ACTIVE or INACTIVE
      status: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      console.log(input);
      const customer = await prisma.customer.update({
        where: {
          id: input.id,
        },
        data: {
          full_name: input?.full_name,
          email: input?.email,
          address: input?.address,
          phone_code: input?.phone_code,
          phone_number: input?.phone_number,
          identity_card_image: input?.identity_card_image || "",
          profile_image: input?.profile_image || "",
          status: input?.status as "ACTIVE" | "INACTIVE",
        },
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

export default updateCustomerFromAdmin;
