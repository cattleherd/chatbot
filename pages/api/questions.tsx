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



const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
})

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
    const coolPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `This is a conversation between you (friendly ai) and the user. Reply in a laid back style, like a friend. Don't mention things like (i am an ai with inherent limitations). `
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    const chain = new ConversationChain({
      llm: model,
      memory: memory,
      prompt: coolPrompt,
    });

    const userMessage = req.body.question;
    const result = await chain.call({ input: userMessage });
    const aiResponse = result.response;
    res.status(200).json(aiResponse);
    console.log(aiResponse)
  });
}
