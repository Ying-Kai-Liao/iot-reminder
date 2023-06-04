import {
  ClientConfig,
  Client,
  MiddlewareConfig,
  middleware,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";
import gptConverter from "@/utils/chatGPT";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  };

const client = new Client(clientConfig);

// Function handler to receive the text.
const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  // Process all message related variables here.
  const { replyToken } = event;
  const { text } = event.message;

  // Process the text.
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
        
        // Send the data to register api
        await axios.post('/api/user/register', data)
          .then(res => reply = JSON.stringify(res.data))
          .catch(err => reply = JSON.stringify(err.data))
        
        if (reply == undefined) {
          reply = 'Error'
        }

        reply = JSON.stringify(data);

        break;
    }
  } else {
    const chatGptResponse = await gptConverter(text);
    reply = 
      (chatGptResponse == undefined) || (chatGptResponse?.status == '400') 
      ? "Sorry, I can't understand you." 
      :  JSON.stringify(chatGptResponse); // Cannot use object or JSON here, it would cause error when sending to line api
  }
  
  // Create a new message.
  const response: TextMessage = {
    type: "text",
    text: reply,
  };

  // Reply to the user.
  await client.replyMessage(replyToken, response);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      middleware(middlewareConfig)(req, res, async () => {
      const events: WebhookEvent[] = req.body.events;
      if (events !== undefined) {
        const results = await Promise.all(
          events.map(async (event: WebhookEvent) => {
            try {
              await textEventHandler(event);
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error(error);
              }
              return res.status(500).json({
                status: "error",
              });
            }
          })
        );
        return res.status(200).json({
          status: "success",
          results,
        });
      } else {
        return res.status(200).json({
          status: "success",
        });
      }
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
      });
    }
  } else {
    return res.status(405);
  }
};

export default handler;
