import { OpenAI } from "openai";
import { RestClient } from "../utils/rest";
import { serialize } from "../utils/serializer";
import * as config from "../config";

const openai = new OpenAI({ apiKey: config.OpenAi.API_KEY, organization: config.OpenAi.ORGANIZATION_ID });

const moderate = (input: string) => openai.moderations.create({ model: "text-moderation-latest", input });

type Task = { input: string[]; };

new RestClient<Task, number[]>("moderation")
  .solve(async (task) => {
    const moderations = await Promise.all(task.input.map(moderate))
      .then(serialize("moderation"))
      .then(moderations => moderations.map(({ results }) => results[0].flagged ? 1 : 0));
    
    return moderations;
  })
  .then(console.log)
  .catch(console.error);