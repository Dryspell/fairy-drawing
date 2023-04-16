import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export type ChatGPTRequestOptions = {
  model: string;
  prompt: string;
  suffix?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number;
  echo?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  best_of?: number;
  logit_bias?: Record<string, number>;
  user?: string;
};

const chatSampleData = {
  id: "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  object: "text_completion",
  created: 1589478378,
  model: "text-davinci-003",
  choices: [
    {
      text: "\n\nThis is indeed a test",
      index: 0,
      logprobs: null,
      finish_reason: "length",
    },
  ],
  usage: {
    prompt_tokens: 5,
    completion_tokens: 7,
    total_tokens: 12,
  },
};

export const gptRouter = createTRPCRouter({
  completion: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const requestOptions: ChatGPTRequestOptions = {
        model: "text-davinci-003",
        prompt: input.text,
        max_tokens: 100,
      };

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPEN_AI_KEY || ""}`,
        },
        body: JSON.stringify(requestOptions),
      })
        .then((res) => res.json())
        .then((res) => {
          return res as typeof chatSampleData;
        });

      // response &&
      //   console.log(
      //     `Received Response from GPT: ${response?.choices?.[0]?.text || ""}`
      //   );

      return response;
    }),
});
