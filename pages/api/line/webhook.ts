import prisma from "@/app/libs/prismadb";
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
import { register } from "@/app/api/user/register";
import { NextApiRequest, NextApiResponse } from "next";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
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
  const { userId } = event.source;

  // Process the text.
  let reply = "";

  if (text.startsWith("/")) {
    const [command, ...args] = text.slice(1).split(" ");
    switch (command) {
      case "register":
        const data = {
          email: args[0],
          name: args[1],
          password: args[2],
          lineId: userId,
        };
        // Send the data to register api
        const registerResponse = await (await register(undefined, data)).json();
        reply = JSON.stringify(registerResponse);

        if (reply == undefined) {
          reply = "Error";
        }

        break;
      default:
        reply = "Mistake use of command";
        break;
    }
  } else {
    const currentUser = await prisma.user.findUnique({
      where: {
        lineId: userId,
      },
    });
    if (!currentUser) {
      reply = "unregistered";
    } else {
      const chatGptResponse = await gptConverter(text);
      if (chatGptResponse == undefined) {
        reply = "Sorry, I can't understand you.";
      } else if (chatGptResponse?.error) {
        reply = JSON.stringify(chatGptResponse);
      } else {
        reply = JSON.stringify(chatGptResponse); // Cannot use object or JSON here, it would cause error when sending to line api

        try {
          const incident = await prisma.incident.create({
            data: {
              userId: currentUser.id,
              action: chatGptResponse?.incident || null,
              time: chatGptResponse?.time || null,
            },
          });
          const response: TextMessage = {
            type: "text",
            text: "JSON: " + reply + "incident: " + JSON.stringify(incident),
          };

          // Reply to the user.
          await client.replyMessage(replyToken, response);
        } catch (error) {
          reply = "something wrong when creating incident.";
        }
      }
    }
  }

  // Create a new message.
  const response: TextMessage = {
    type: "text",
    text: "JSON: " + reply,
  };

  // Reply to the user.
  await client.replyMessage(replyToken, response);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return res.status(405);
  }
  try {
    middleware(middlewareConfig)(req, res, async () => {
      const events: WebhookEvent[] = req.body.events;
      if (!events) {
        return res.status(200).json({
          status: "success",
        });
      }

      const results = await Promise.all(
        events.map((event: WebhookEvent) => textEventHandler(event).catch((error) => {
          console.log(error);
        }))
      );

      return res.status(200).json({
        status: "success",
        results,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
    });
  }
};

export default handler;
