import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const createItemInventory = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      images: z.array(z.string()),
      type_id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const item = await prisma.itemProduct.create({
        data: {
          name: input?.name,
          description: input?.description || "",
          images: input?.images || [],
          type_id: input?.type_id,
        },
      });
      return {
        item,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default createItemInventory;
