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
    let events : Incident[] = [];
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
            events = inicidents;
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

    let data:string = ''
    if(events.length != 0) {
        const subject:string = events.map(incident => JSON.stringify(incident.action)).join("\n")
        const date:string = events.map(incident => JSON.stringify(incident.time.toLocaleDateString())).join("\n")
        const time:string = events.map(incident => JSON.stringify(incident.time.toLocaleTimeString())).join("\n")

        data = response == "" ? 
        ( 
            JSON.stringify({
                "to": currentUser?.lineId,
                "messages": [
                  {
                    "type": "text",
                    "text": "Nothing to do"
                  }
                ]
            })
        ) : (
            JSON.stringify({
                "to": currentUser?.lineId,
                "messages": [
                  {
                    "type": "flex",
                    "altText": "您今天的行程",
                    "contents": {
                        "type": "bubble",
                        "hero": {
                          "type": "image",
                          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
                          "size": "full",
                          "aspectRatio": "20:13",
                          "aspectMode": "cover",
                          "action": {
                            "type": "uri",
                            "uri": "http://linecorp.com/"
                          }
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "baseline",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "您的行程安排如下",
                                  "weight": "bold",
                                  "size": "xl"
                                },
                                {
                                  "type": "icon",
                                  "url": "https://iot-reminder.vercel.app/favicon.ico"
                                }
                              ]
                            },
                            {
                              "type": "box",
                              "layout": "vertical",
                              "margin": "lg",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "baseline",
                                  "spacing": "sm",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "incident",
                                      "color": "#aaaaaa",
                                      "size": "sm",
                                      "flex": 5
                                    },
                                    {
                                      "type": "text",
                                      "text": subject,
                                      "wrap": true,
                                      "color": "#666666",
                                      "size": "sm",
                                      "flex": 10
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "baseline",
                                  "spacing": "sm",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "time",
                                      "color": "#aaaaaa",
                                      "size": "sm",
                                      "flex": 5
                                    },
                                    {
                                      "type": "text",
                                      "text": time,
                                      "wrap": true,
                                      "color": "#666666",
                                      "size": "sm",
                                      "flex": 10
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "baseline",
                                  "spacing": "sm",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "date",
                                      "color": "#aaaaaa",
                                      "size": "sm",
                                      "flex": 5
                                    },
                                    {
                                      "type": "text",
                                      "text": date,
                                      "wrap": true,
                                      "color": "#666666",
                                      "size": "sm",
                                      "flex": 10
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "baseline",
                                  "spacing": "sm",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "equip",
                                      "color": "#aaaaaa",
                                      "size": "sm",
                                      "flex": 5
                                    },
                                    {
                                      "type": "text",
                                      "text": "equipment",
                                      "wrap": true,
                                      "color": "#666666",
                                      "size": "sm",
                                      "flex": 10
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      }
                  }
                ]
            })
        );
    }
    if(data == "") {
        data = JSON.stringify({
            "to": currentUser?.lineId,
            "messages": [
              {
                "type": "text",
                "text": "Nothing to do"
              }
            ]
        })
    }
    console.log("data :" + data);
    console.log("response: " + response);

    const res = await fetch('https://api.line.me/v2/bot/message/push', {
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

