import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const deleteCustomer = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    try {
      await prisma.customer.delete({
        where: {
          id: input.id,
        },
      });
      return {
        message: "successfully deleted",
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default deleteCustomer;
