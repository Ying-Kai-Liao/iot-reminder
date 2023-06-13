import { NextResponse } from "next/server";
import getIncidentByUserId from "@/app/actions/getUserIncident";
import prisma from "@/app/libs/prismadb"
import { Incident } from "@prisma/client";

interface IParams {
    faceid?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { faceid } = params;
    let response = 'no incidents find';
    let userId = '';

    if(faceid) {
        console.log("faceid: " + faceid);
        switch (Number(faceid)) {
            case 0:
                userId = '64807b117dfbadacd3cc2328'
                break
            case 1:
                userId = '64807b73dd3e08f6b29a7481'
                break
            default:
                break
        }
        console.log("userId: " + userId);
        if (userId !== ''){
            const inicidents: Incident[] = await getIncidentByUserId(userId);
            response = inicidents.map(incident => JSON.stringify(incident)).join("\n")
        }
    }

    const currentUser = userId == "" ? undefined : await prisma.user.findUnique({
        where : {
            id: userId,
        }
    })
    
    if (!currentUser) {
        return NextResponse.json({
            status: 'no',
            message: 'no good',
        })
    }

    const data = JSON.stringify({
        "to": [currentUser?.lineId],
        "messages": [
          {
            "type": "text",
            "text": response
          }
        ]
    });
    console.log("response: " + response);

    const res = response == "" ? 'Nothing' : await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: data,
        redirect: 'follow',
      })
      .then(something => console.log(something.json()))
      .catch(error => console.log('error', error));

    return NextResponse.json({
        status: 'ok',
        message: res,
    })
}

