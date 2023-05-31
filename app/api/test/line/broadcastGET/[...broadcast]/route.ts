import { NextResponse } from 'next/server';

interface IParams {
  broadcast?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const content = params.broadcast?.toString();
    console.log(content);
    const data = JSON.stringify({
        "to": [],
        "messages": [
          {
            "type": "flex",
            "altText": "OverTest",
            "contents": 
              {
                  "type": "bubble",
                  "hero": {
                    "type": "image",
                    "url": "https://i.imgur.com/A14QwVW.jpeg",
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
                        "type": "text",
                        "text": "YOU WINNER",
                        "weight": "bold",
                        "size": "xl"
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
                                  "text": "Content",
                                  "color": "#aaaaaa",
                                  "size": "sm",
                                  "flex": 1
                                },
                                {
                                  "type": "text",
                                  "wrap": true,
                                  "color": "#666666",
                                  "size": "sm",
                                  "flex": 3,
                                  "text": content
                                }
                              ]
                            }
                          ]
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "button",
                        "style": "link",
                        "height": "sm",
                        "action": {
                          "type": "uri",
                          "label": "WEBSITE",
                          "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        }
                      }
                    ],
                    "flex": 0
                  }
              }
          }
        ]
    });
    console.log(data);

    const res = await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: data,
        redirect: 'follow',
      })
      .then(response => response.json())
      .catch(error => console.log('error', error));

    return NextResponse.json(res);
}