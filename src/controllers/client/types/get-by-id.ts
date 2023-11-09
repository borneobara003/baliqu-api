import prisma from "@/prisma";
import publicProcedure from "@/procedure/public";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getClientTypesById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { id } = input;
      const type = await prisma.typeProduct.findUnique({
        where: {
          id,
        },
      });
      return {
        type: type || null,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getClientTypesById;
