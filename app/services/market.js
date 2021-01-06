const MicroMQ = require("micromq");
const env = require("../../env.js");

const market = new MicroMQ({
  name: "market",
  microservices: ["items"],
  rabbit: {
    url: env.rabbit_url,
  },
});

market.post("/market/buy/:id", async (req, res) => {
  const { id } = req.params;
  console.log("reqparams");

  req.app.ask("items", {
    server: {
      action: "update",
      meta: {
        id,
      },
    },
  });

  res.json({
    ok: true,
  });
});

market.start();
