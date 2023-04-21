// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import rateLimit from "express-rate-limit";

//rate limiting requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per hour
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  limiter(req, res, () => {
    try {
      const run = async () => {
        let query = req.body.question;
        const model = new OpenAI({ temperature: 0 });
        const result = await model.call(query);
        res.status(200).json(result);
      };
      run();
    } catch (err) {
      res.status(500).send({ name: "Error" });
    }
  });
}
