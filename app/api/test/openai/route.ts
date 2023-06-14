import gptConverter from "@/utils/chatGPT";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
) {
    const aiResponse = await gptConverter('I want to eat dinner on today morning');
    
    if(aiResponse == undefined) {
        return NextResponse.json({
            message: "No response"
        })
    }
    console.log(aiResponse.error?.status);
    return NextResponse.json(aiResponse);
}