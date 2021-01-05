import Gateway from "micromq/gateway";
import { market } from "./services/market";
import { app } from "./app";
import env from "../env";

const gateway = new Gateway({
  microservices: ["market"],
  rabbit: {
    url: env.rabbit_url,
  },
});

app.use(gateway.middleware());

app.get("/balance", (req, res) => {
  res.json({
    amount: 500,
  });
});

app.post("/market/buy/:id", async (req, res) => {
  await res.delegate("market");
});

app.get(["/friends", "/status"], async (req, res) => {
  await res.delegate("market");
});

market.start();

export { gateway };
