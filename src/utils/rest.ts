import * as config from "../config";
import { serialize } from "./serializer";

export const get = (url: string) => fetch(`${url}`).then(res => res.json()).catch(console.error);
export const post = (url: string, body: any) => fetch(url, { method: "POST", body: JSON.stringify(body) }).then(res => res.json()).catch(console.error);

type Action = "auth" | "task" | "answer";

// <Task> could contain { code, msg } and then be extended.
export class RestClient<Task, Answer> {
  private readonly taskName: string;
  private token: string | null = null;
  private answer: Answer | null = null;

  constructor(taskName: string) {
    this.taskName = taskName;
  }

  private getUrl = (action: Action): string => {
    const { BASE_URL } = config.AIDevs;
    const { taskName, token } = this;

    switch(action) {
      case "auth": return `${BASE_URL}/token/${taskName}`;

      case "task": {
        if(token === null) throw new Error(`[${taskName}] Token is null.`);
        return `${BASE_URL}/task/${token}`;
      }

      case "answer": {
        if(token === null) throw new Error(`[${taskName}] Answer is null.`);
        return `${BASE_URL}/answer/${token}`;
      }

      default: throw new Error(`Unknown action ${action}`);
    }
  };

  solve = async (solution: (task: Task) => Promise<Answer>) => {
    await this.auth();
    const task = await this.getTask();
    serialize(`${this.taskName}_task`)(task);
    const answer = await solution(task);
    return this.sendAnswer(answer);
  };

  private auth = async () => {
    const data = await post(this.getUrl("auth"), { apikey: config.AIDevs.API_KEY });
    
    if (data.code !== 0) {
      console.log({ data });
      throw new Error(`Failed to auth for: ${this.taskName}`);
    }

    this.token = data.token;
  };

  private getTask = async (): Promise<Task> => {
    const data = await get(this.getUrl("task"));
    
    if (data.code !== 0) {
      console.log({ data });
      throw new Error(`Failed to get task for: ${this.taskName}`);
    }
    
    return data;
  };

  private sendAnswer = async (answer: Answer) => {
    const data = await post(this.getUrl("answer"), { answer });

    if (data.code !== 0) {
      console.log({ data });
      throw new Error(`Failed to answer for: ${this.taskName}`);
    }

    this.answer = answer;
    return data;
  };
};


