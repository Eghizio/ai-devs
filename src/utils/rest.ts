import * as config from "../config";

export const get = (url: string) => fetch(`${url}`).then(res => res.json()).catch(console.error);
export const post = (url: string, body: any) => fetch(url, { method: "POST", body: JSON.stringify(body) }).then(res => res.json()).catch(console.error);

type Action = "auth" | "task" | "answer";

export class RestClient {
  private readonly taskName: string;
  private token: string | null = null;
  private answer: string | null = null;

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

  solve = async (solution: (task: any) => Promise<string>) => {
    await this.auth();
    const task = await this.getTask();
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

  private getTask = async () => {
    

    const data = await get(this.getUrl("task"));
    
    if (data.code !== 0) {
      console.log({ data });
      throw new Error(`Failed to get task for: ${this.taskName}`);
    }
    
    return data;
  };

  private sendAnswer = async (answer: string) => {
    const data = await post(this.getUrl("answer"), { answer });

    if (data.code !== 0) {
      console.log({ data });
      throw new Error(`Failed to answer for: ${this.taskName}`);
    }

    this.answer = answer;
    return data;
  };
};


