import { NextResponse } from "next/server";
import { register } from "../../user/register";

export async function POST(
    request: Request,
) {
    const body = await request.json();
    const text = body.text;
    let reply = '';

  if (text.startsWith('/')) {
    const [command, ...args] = text.slice(1).split(' ');
    switch (command) {
      case 'register':
        const data = {
          email: args[0],
          name: args[1],
          password: args[2]
        }
        const registerResponse = await (await register(undefined, data)).json()
        reply = JSON.stringify(registerResponse)
        console.log("reply = " + reply)
        
        if (reply == undefined) {
            reply = 'Error'
        }
        
        return NextResponse.json({
          status: 'ok',
          message: reply
        })
        break;
    }
  }

    return NextResponse.json({
        status: 'ok',
        message: 'Connected Sucessfully!'
    })
}