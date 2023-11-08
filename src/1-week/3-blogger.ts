import { OpenAI } from "openai";
import { RestClient } from "../utils/rest";
import { serialize } from "../utils/serializer";
import * as config from "../config";

const openai = new OpenAI({ apiKey: config.OpenAi.API_KEY, organization: config.OpenAi.ORGANIZATION_ID });

const complete = (content: string) => openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "Jesteś autorem bloga. Piszesz artykuł na temat pizzy Margherity. Proszę napisz krótki rozdział o nazwie jaką dostaniesz" },
    { role: "user", content }
  ],
});

type Task = { blog: string[] };

new RestClient<Task, string[]>("blogger")
  .solve(async (task) => {
    const completions = await Promise.all(task.blog.map(complete))
      .then(serialize("blogger"))
      .then(completions => completions.map(c => c.choices[0].message?.content ?? ""));
    
    return completions;
  })
  .then(console.log)
  .catch(console.error);
