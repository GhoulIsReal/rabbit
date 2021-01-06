import express from "express";
import Gateway from "micromq/gateway";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes";
import userRoutes from "./routes/userRoutes";
import env from "../env";

const app = express();

const gateway = new Gateway({
  microservices: ["market", "notifications", "items"],
  rabbit: {
    url: env.rabbit_url,
  },
});

app.use(express.json());
app.use(gateway.middleware());
app.use(cors());

app.use("/api/", itemRoutes);
app.use("/api/", userRoutes);

app.get("/balance", (req, res) => {
  res.json({
    amount: 500,
  });
});

app.post("/market/buy/:id", async (req, res) => {
  await res.delegate("market");
});

// app.get(["/friends", "/status"], async (req, res) => {
//   await res.delegate("market");
// });

app.listen(env.port, () => {
  console.log(`🚀 are live on ${env.port}`);
});

