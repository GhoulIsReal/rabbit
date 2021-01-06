const MicroMQ = require("micromq");
const env = require("../../env.js");
import dbQuery from "../db/dbQuery";

const items = new MicroMQ({
  name: "items",
  microservices: ["users"],
  rabbit: {
    url: env.rabbit_url,
  },
});

items.action("update", async (meta) => {
    if (!meta.id) {
        return res.status(404).send("no item found");
      }
      const updateItemQuery = `UPDATE items SET issold=true WHERE id=${meta.id} AND issold=false`;
      const findItemQuery = `SELECT * FROM items WHERE id=${meta.id}`;
      try {
        await dbQuery.query(updateItemQuery);
        const rows = (await dbQuery.query(findItemQuery)).rows;
        console.log("rows", rows);
        if (rows[0] === undefined) {
          return "No item found";
        }
        items.ask("users", {
            server: {
                action: "findUser",
                meta: {
                    id: rows[0].sellerid,
                    name: rows[0].name,
                }
            }
        })
        return { ok: true, item: rows[0] };
      } catch (error) {
        return "An error Occured";
      }
});

items.start();