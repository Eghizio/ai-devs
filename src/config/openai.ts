import dotenv from "dotenv";
dotenv.config();

export const OpenAi = {
  API_KEY: process.env.OPENAI_API_KEY,
};
