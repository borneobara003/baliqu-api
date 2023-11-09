import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { StatusItemProduct } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateItemInventory = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      images: z.array(z.string()),
      type_id: z.string(),
      status: z
        .enum([
          StatusItemProduct.AVAILABLE,
          StatusItemProduct.NOT_AVAILABLE,
          StatusItemProduct.DIRTY,
          StatusItemProduct.ON_CLEANING,
          StatusItemProduct.ON_MAINTENANCE,
          StatusItemProduct.ON_RENTAL,
          StatusItemProduct.ON_RESERVATION,
        ])
        .optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const type = await prisma.itemProduct.update({
        where: {
          id: input?.id,
        },
        data: {
          name: input?.name,
          description: input?.description || "",
          images: input?.images || [],
          type_id: input?.type_id,
          status: input?.status as StatusItemProduct,
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

export default updateItemInventory;
