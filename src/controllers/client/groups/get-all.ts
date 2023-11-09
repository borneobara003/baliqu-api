import prisma from "@/prisma";
import publicProcedure from "@/procedure/public";
import { TRPCError } from "@trpc/server";

const getAllClientGroups = publicProcedure.query(async () => {
  try {
    const groups = await prisma.groupProduct.findMany();
    return {
      groups: groups || [],
    };
  } catch (error: any) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error?.message || "",
    });
  }
});

export default getAllClientGroups;
