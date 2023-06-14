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
                userId = '6489316d675f07b32c4192a1'
                break
            default:
                break
        }
        console.log("userId: " + userId);
        if (userId !== ''){
            const inicidents: Incident[] = await getIncidentByUserId(userId);
            response = inicidents.map(incident => "事件：" + JSON.stringify(incident.action) + "\n" + incident.time.toLocaleTimeString()).join("\n\n")
        }
    }

    const currentUser = userId == "" ? undefined : await prisma.user.findUnique({
        where : {
            id: userId,
        }
    })
    
    if (!currentUser?.lineId) {
        return NextResponse.json({
            status: 'no',
            message: 'not current user',
        })
    }

    const data = JSON.stringify({
        "to": currentUser?.lineId,
        "messages": [
          {
            "type": "text",
            "text": response
          }
        ]
    });
    console.log("response: " + response);

    const res = response == "" ? 'Nothing' : await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: data,
        redirect: 'follow',
      })
      .catch(error => console.log('error: ', error));

    return NextResponse.json({
        status: 'ok',
        message: res,
    })
}

