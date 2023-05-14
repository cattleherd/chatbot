import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import rateLimit from "express-rate-limit";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { LLMChain } from "langchain";
import { PromptTemplate } from "langchain/prompts";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
});

const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  limiter(req, res, async () => {
    const template = `take {input} and interpret what the user is saying, and write a paragraph about why the above user input, which is separated by slashes, is a bad idea.`
    const prompt = new PromptTemplate({ template, inputVariables: ['input']})

    const chain = new LLMChain({
      llm: model,
      prompt,
    });

    const userMessage = req.body.question;
    const result = await chain.call({ input: userMessage });
    const aiResponse = result.text
    res.status(200).json(aiResponse);
    console.log(aiResponse)
  });
}
