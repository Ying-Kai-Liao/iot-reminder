import { NextResponse } from "next/server";
import { register } from "../register";

export async function POST(
  request: Request, 
) {
  return await register(request);
}