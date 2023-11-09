import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAllCustomers = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
      // value is ACTIVE or INACTIVE
      status: z.string().optional(),
      phone_number: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { page, limit, search, status, phone_number } = input;
      const payload: any = {
        skip: (page - 1) * limit,
        take: limit,
      };
      if (search) {
        payload["where"] = {
          full_name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      if (status) {
        payload["where"] = {
          ...payload["where"],
          status,
        };
      }
      if (phone_number) {
        payload["where"] = {
          ...payload["where"],
          phone_number: {
            contains: phone_number,
            mode: "insensitive",
          },
        };
      }
      const customers = await prisma.customer.findMany(payload);
      const payloadTotalData: any = {};
      if (search) {
        payloadTotalData["where"] = {
          full_name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
      if (status) {
        payloadTotalData["where"] = {
          ...payloadTotalData["where"],
          status,
        };
      }
      if (phone_number) {
        payload["where"] = {
          ...payload["where"],
          phone_number: {
            contains: phone_number,
            mode: "insensitive",
          },
        };
      }
      const totalData = await prisma.customer.count(payloadTotalData);
      return {
        customers: customers || [],
        total_page: Math.ceil(totalData / limit),
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getAllCustomers;
