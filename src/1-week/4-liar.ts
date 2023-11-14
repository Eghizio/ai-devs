import { OpenAI } from "openai";
import { RestClient } from "../utils/rest";
import { serialize } from "../utils/serializer";
import * as config from "../config";

const openai = new OpenAI({ apiKey: config.OpenAi.API_KEY, organization: config.OpenAi.ORGANIZATION_ID });

const complete = (content: string) => openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "Oceniasz czy podana odpowiedź jest prawdą w związku z zadanym pytaniem. Otrzymasz pytanie a w następnej linijce odpowiedź. Odpowiadaj YES lub NO." },
    { role: "user", content }
  ],
});

const isAnswer = (text: string): text is Answer => text === "YES" || text === "NO";

const toAnswer = (answer: string): Answer => {
  if(isAnswer(answer)) return answer;
  throw new Error("Not a valid answer. Valid answer is in YES/NO format.");
};

type Task = { hint1: string; hint2: string; hint3: string; };
type Answer = "YES" | "NO";

const client = new RestClient<Task, Answer>("liar");

client.solve(async (task) => {
  const question = "What is your name?";
  const reply = await client.submitQuestion(question);
  
  const isTellingTruth = await complete(`${question}\n${reply.answer}`).then(x => x.choices[0].message?.content ?? "");
  const answer = toAnswer(isTellingTruth);

  serialize("liar")({ question, reply, answer });

  return answer;
});
