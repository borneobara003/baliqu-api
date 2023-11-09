import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAllGroupsInventory = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const { page, limit, search } = input;
      const payload: any = {
        skip: (page - 1) * limit,
        take: limit,
      };
      if (search) {
        payload["where"] = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      const groups = await prisma.groupProduct.findMany(payload);
      const payloadTotalData: any = {};
      if (search) {
        payloadTotalData["where"] = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      const totalData = await prisma.groupProduct.count(payloadTotalData);
      return {
        groups: groups || [],
        total_page: Math.ceil(totalData / limit),
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getAllGroupsInventory;
