import { RestClient } from "../utils/rest";

const client = new RestClient("helloapi");

client.solve((task) => task.cookie)
  .then(console.log)
  .catch(console.error);
