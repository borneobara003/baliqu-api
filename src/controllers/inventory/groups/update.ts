import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateGroupInventory = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      images: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const group = await prisma.groupProduct.update({
        where: {
          id: input.id,
        },
        data: {
          name: input?.name,
          description: input?.description || "",
          images: input?.images || "",
        },
      });
      return {
        group,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default updateGroupInventory;
