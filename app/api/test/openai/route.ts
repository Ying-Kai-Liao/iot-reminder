import gptConverter from "@/utils/chatGPT";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
) {
    const aiResponse = await gptConverter('I am going to take airplane in the 7/19 morning, I need to bring ticket, passport, and some money');

    const response = JSON.stringify(aiResponse);

    return NextResponse.json(aiResponse.time)
}