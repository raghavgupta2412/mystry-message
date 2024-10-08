// import { openai } from "openai";
// import { streamText, convertToCoreMessages, tool } from "ai";
// import { z } from "zod";

// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = await streamText({
//     model: openai("gpt-4-turbo"),
//     messages: convertToCoreMessages(messages),
//     tools: {
//       weather: tool({
//         description: "Get the weather in a location (farenheit)",
//         parameters: z.object({
//           location: z.string().describe("The location to get the weather for"),
//         }),
//         execute: async ({ location }) => {
//           const temperature = Math.round(Math.random() * (90 - 32) + 32);
//           return {
//             location,
//             temperature,
//           };
//         },
//       }),
//     },
//   });

//   return result.toDataStreamResponse();
// }