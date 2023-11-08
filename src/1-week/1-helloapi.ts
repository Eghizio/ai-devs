import { RestClient } from "../utils/rest";

type Task = { cookie: string; };

new RestClient<Task, string>("helloapi")
  .solve(async (task) => task.cookie)
  .then(console.log)
  .catch(console.error);
