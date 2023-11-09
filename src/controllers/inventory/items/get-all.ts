import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAllItemsInventory = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
      type_id: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { page, limit, search, type_id } = input;
      const payload: any = {
        include: {
          types: true,
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
      if (type_id) {
        payload["where"] = {
          ...payload["where"],
          type_id,
        };
      }
      const items = await prisma.itemProduct.findMany(payload);
      const payloadTotalData: any = {};
      if (search) {
        payloadTotalData["where"] = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      if (type_id) {
        payloadTotalData["where"] = {
          ...payloadTotalData["where"],
          type_id,
        };
      }
      const totalData = await prisma.itemProduct.count(payloadTotalData);
      return {
        items,
        total_page: Math.ceil(totalData / limit),
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getAllItemsInventory;
