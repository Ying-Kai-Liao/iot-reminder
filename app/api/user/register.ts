import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export async function register(
  request?: Request, data?: any
) {
  const body = await request?.json() || data;
  const { 
    email,
    name,
    password,
   } = body;
   
   console.log(body);

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
    }
  });

  return NextResponse.json(user);
}