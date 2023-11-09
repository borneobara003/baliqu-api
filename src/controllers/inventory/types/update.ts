import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateTypeInventory = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      group_id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const type = await prisma.typeProduct.update({
        where: {
          id: input?.id,
        },
        data: {
          name: input?.name,
          description: input?.description || "",
          images: input?.images || [],
          group_id: input?.group_id,
          price: input?.price,
        },
      });
      return {
        type,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default updateTypeInventory;
