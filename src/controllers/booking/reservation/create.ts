import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { sendMessage } from "@/utils/wa";
import {
  PaymentMethod,
  StatusPayment,
  StatusReservation,
  TypePickupReservationOrder,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { z } from "zod";

const createReservation = protectedProcedure
  .input(
    z.object({
      customer_id: z.string(),
      type_pickup: z.enum([
        TypePickupReservationOrder.DELIVERY,
        TypePickupReservationOrder.PICKUP,
      ]),
      type_id: z.string(),
      item_id: z.string().optional(),
      start_date: z.string(),
      end_date: z.string(),
      amount: z.number(),
      price: z.number(),
      down_payment: z.number(),
      payment_method: z.enum([PaymentMethod.CASH, PaymentMethod.TRANSFER]),
      status_payment: z.enum([
        StatusPayment.DOWN_PAYMENT,
        StatusPayment.PAID,
        StatusPayment.UNPAID,
      ]),
      images_payment: z.array(z.string()),
      images_customer_proof: z.array(z.string()),
      address_delivery: z.string().optional(),
      status: z.enum([
        StatusReservation.CANCELLED,
        StatusReservation.ON_PROGRESS,
        StatusReservation.PENDING,
        StatusReservation.READY_TO_PICKUP,
      ]),
      is_auto_select_item: z.boolean().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const code = `BQ-${Math.floor(
        10 + Math.random() * 2921
      )}-R${moment().format("mmss")}`;
      const payload: any = {
        customer_id: input?.customer_id,
        type_pickup: input?.type_pickup,
        start_date: new Date(input?.start_date),
        end_date: new Date(input?.end_date),
        amount: input?.amount,
        down_payment: input?.down_payment,
        payment_method: input?.payment_method,
        status_payment: input?.status_payment,
        images_payment: input?.images_payment,
        images_customer_proof: input?.images_customer_proof,
        address_delivery: input?.address_delivery,
        status: input?.status,
        code,
        type_id: input?.type_id,
        price: input?.price,
        is_auto_select_item: input?.is_auto_select_item,
      };

      if (input?.item_id) {
        payload.item_id = input?.item_id;
      }

      const reservation = await prisma.reservation.create({
        data: payload,
        include: {
          customer: true,
        },
      });
      const user = reservation?.customer;
      sendMessage({
        whatsapp: ctx?.wa,
        phone: `${user?.phone_code}${user?.phone_number}`,
        message: `Hello ${user?.full_name}, your reservation has been successfully created with the code ${code}. Please wait for our confirmation. Thank you.`,
      });
      return {
        reservation,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: error?.message || "",
      });
    }
  });

export default createReservation;
