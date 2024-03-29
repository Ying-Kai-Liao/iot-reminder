import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        console.log(JSON.stringify(requestBody, null, 2)); // Logging with formatting

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

export async function GET(request: Request) {
    return new Response('Please use POST', {
        status: 405,
        headers: { 'Content-Type': 'text/plain' }
    });
}
