const MicroMQ = require("micromq");
const env = require("../../env.js");
import dbQuery from "../db/dbQuery";

const users = new MicroMQ({
  name: "users",
  microservices: ["notifications"],
  rabbit: {
    url: env.rabbit_url,
  },
});

users.action("findUser", async (meta) => {
  console.log(meta);
  if (!meta.id) {
    return res.status(404).send("no user found");
  }
  const findUserQuery = `SELECT * FROM users WHERE id=${meta.id}`;
  try {
    await dbQuery.query(findUserQuery);
    const rows = (await dbQuery.query(findUserQuery)).rows;
    console.log("rows", rows);
    if (rows[0] === undefined) {
      return "No user found";
    }
    users.ask("notifications", {
      server: {
        action: "notify",
        meta: {
          user: rows[0],
          itemName: meta.name,
        },
      },
    });
    return { ok: true };
  } catch (error) {
    return "An error Occured";
  }
});

users.start();
