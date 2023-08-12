import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        console.log(requestBody);

        return new Response(JSON.stringify({
            status: 'ok',
            message: 'Connected Successfully!',
            requestBody: requestBody  // Including the parsed body in the response
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Error processing the request'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}