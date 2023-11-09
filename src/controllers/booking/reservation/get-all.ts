import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAllReservations = protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const { page, limit, search } = input;
      const payload: any = {
        where: {
          OR: [
            {
              customer: {
                full_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              code: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              customer: {
                phone_number: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      };
      const reservations = await prisma.reservation.findMany({
        ...payload,
        include: {
          customer: true,
          item: true,
          type: true,
        },
        orderBy: {
          updated_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const totalData = await prisma.reservation.count(payload);
      return {
        reservations,
        total_page: Math.ceil(totalData / limit),
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error?.message || "",
      });
    }
  });

export default getAllReservations;
