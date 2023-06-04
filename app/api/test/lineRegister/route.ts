import { NextResponse } from "next/server";
import axios from "axios";

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
        console.log(data)
        await axios.post('http://localhost:3000/api/user/register', data)
          .then(res => reply = JSON.stringify(res.data))
          .catch(err => reply = JSON.stringify(err.data))
        
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