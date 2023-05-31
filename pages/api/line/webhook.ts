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
  const chatGptResponse = await gptConverter(text);

  // Create a new message.
  const response: TextMessage = {
    type: "text",
    text: chatGptResponse.time,
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
          content: "empty events",
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
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
