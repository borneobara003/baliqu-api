import prisma from "@/prisma";
import publicProcedure from "@/procedure/public";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils";

const signUpController = publicProcedure
  .input(
    z.object({
      full_name: z.string().min(3).max(50),
      email: z.string().email(),
      password: z.string().min(6),
      phone_number: z.string(),
      username: z.string(),
      code: z.string().min(4),
    })
  )
  .mutation(async ({ input }) => {
    const password = await bcrypt.hash(input.password, 10);
    const payload: any = {
      full_name: input.full_name,
      email: input.email,
      phone_number: input.phone_number,
      username: input.username,
      password,
    };
    if (input.code === "BALIQU_OWNER") {
      payload.is_super_admin = true;
    }
    if (input.code !== "EMPLOYEE_BALIQU" && input.code !== "BALIQU_OWNER") {
      throw new Error("Code is invalid");
    }
    const user = await prisma.user.create({
      data: payload,
    });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    const data = {
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      username: user.username,
      is_super_admin: user.is_super_admin,
    };

    return {
      token,
      data,
    };
  });

export default signUpController;
