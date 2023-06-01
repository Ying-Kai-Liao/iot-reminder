import gptConverter from "@/utils/chatGPT";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
) {
    const aiResponse = await gptConverter('I am going to have quiz 6/4 morning');
    
    if(aiResponse == undefined) {
        return NextResponse.json({
            message: "No response"
        })
    }
    return NextResponse.json(aiResponse)
}