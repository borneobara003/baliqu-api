import prisma from "@/prisma";
import publicProcedure from "@/procedure/public";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getClientTypesByGroup = publicProcedure
  .input(
    z.object({
      id: z.string(),
      page: z.number().default(1),
      limit: z.number().default(10),
    })
  )
  .query(async ({ input }) => {
    try {
      const { id } = input;
      const types = await prisma.typeProduct.findMany({
        where: {
          group_id: id,
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
      return {
        types: types || [],
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getClientTypesByGroup;
