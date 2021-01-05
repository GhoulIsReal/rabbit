import MicroMQ from "micromq";
import env from "../../env";
import { getAllItems } from "../controllers/itemsController";

console.log(env.rabbit_url);

const market = new MicroMQ({
  name: "market",
  rabbit: {
    url: env.rabbit_url,
  },
});

market.post("/market/buy/:id", async (req, res) => {
  const { id } = req.params;

  const item = await getAllItems().then((result) =>
    result.find((obj) => obj.id == id && !obj.issold)
  );

  console.log("item:", item);

  if (!item) {
    res.status(404).json({
      error: "Item not found",
    });

    return;
  }

  await item.update(
    {
      id,
    },
    {
      $set: {
        isSold: true,
      },
    }
  );

  req.app
    .ask("notifications", {
      server: {
        action: "notify",
        meta: {
          userId: item.sellerId,
          text: JSON.stringify({
            event: "notification",
            data: {
              text: `Item #${id} was sold!`,
            },
          }),
        },
      },
    })
    .catch((err) =>
      console.log("Cannot send message via notifications microservice", err)
    );

  res.json({
    ok: true,
  });
});

export { market };
