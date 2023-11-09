import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const createTypeInventory = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      price: z.number(),
      group_id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const type = await prisma.typeProduct.create({
        data: {
          name: input?.name,
          description: input?.description || "",
          group_id: input?.group_id,
          images: input?.images || [],
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

export default createTypeInventory;
