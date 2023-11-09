import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { StatusOrder } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const completeReservation = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: {
          id: input?.id,
        },
      });
      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reservation not found",
        });
      }
      const itemId =
        reservation?.item_id ||
        (
          await prisma.itemProduct.findFirst({
            where: {
              status: "AVAILABLE" || "ON_CLEANING",
            },
          })
        )?.id ||
        "";
      const updateReservation = await prisma.order.create({
        data: {
          amount: reservation?.amount,
          start_date: reservation?.start_date,
          end_date: reservation?.end_date,
          payment_method: reservation?.payment_method,
          address_delivery: reservation?.address_delivery,
          customer_id: reservation?.customer_id,
          item_id: itemId,
          images_customer_proof: reservation?.images_customer_proof,
          images_payment: reservation?.images_payment,
          status: StatusOrder.COMPLETED,
          type_pickup: reservation?.type_pickup,
        },
      });
      await prisma.reservation.delete({
        where: {
          id: input?.id,
        },
      });
      return {
        reservation: updateReservation,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: error?.message || "",
      });
    }
  });

export default completeReservation;
