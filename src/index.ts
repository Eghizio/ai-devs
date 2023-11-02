import * as config from "./config";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: config.OpenAi.API_KEY, organization: config.OpenAi.ORGANIZATION_ID });

console.log(`Hello there!`);

(async() => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Suggest me some nice breakfast please." }],
  });
  
  console.log(completion.choices[0]?.message?.content);
})();
