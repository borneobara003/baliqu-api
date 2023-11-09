import prisma from "@/prisma";
import protectedProcedure from "@/procedure/protected";
import { StatusUser } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const verifyController = protectedProcedure.query(async ({ ctx }) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        username: ctx.user?.username,
        id: ctx.user?.id,
      },
      select: {
        email: true,
        username: true,
        full_name: true,
        is_super_admin: true,
        phone_number: true,
        profile_image: true,
        role: true,
        status: true,
      },
    });
    if (user?.status === StatusUser.INACTIVE) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "user is inactive",
      });
    }
    return user;
  } catch (err: any) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: err?.message || "",
    });
  }
});

export default verifyController;
