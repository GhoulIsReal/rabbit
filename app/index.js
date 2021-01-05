import { gateway } from "./gateway";
import { app } from "./app";
import env from "../env";

console.log(env.port);
app.listen(env.port).on("listening", () => {
  console.log(`🚀 are live on ${env.port}`);
});
