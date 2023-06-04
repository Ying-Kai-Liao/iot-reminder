import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export async function register(request?: Request, data?: any) {
  try {
    const body = (await request?.json()) || data;
    const { email, name, password } = body;

    if (!email || !name || !password) {
      console.log("Missing fields");
      return NextResponse.json({
        error: "Missing fields",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });
    console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "Error creating user",
    });
  }
}
