import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAllTypesInventory = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
      group_id: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { page, limit, search, group_id } = input;
      const payload: any = {
        include: {
          group: true,
        },
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
      if (group_id) {
        payload["where"] = {
          ...payload["where"],
          group_id,
        };
      }
      const types = await prisma.typeProduct.findMany(payload);
      const payloadTotalData: any = {};
      if (search) {
        payloadTotalData["where"] = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      if (group_id) {
        payloadTotalData["where"] = {
          ...payloadTotalData["where"],
          group_id,
        };
      }
      const totalData = await prisma.typeProduct.count(payloadTotalData);
      return {
        types: types || [],
        total_page: Math.ceil(totalData / limit),
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getAllTypesInventory;
