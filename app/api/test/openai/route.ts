import gptConverter from "@/utils/chatGPT";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
) {
    const aiResponse = await gptConverter('I want to eat dinner on 6/4');
    
    if(aiResponse == undefined) {
        return NextResponse.json({
            message: "No response"
        })
    }
    return NextResponse.json(aiResponse)
}