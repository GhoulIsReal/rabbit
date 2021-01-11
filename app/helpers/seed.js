import pool from "../db/pool";
import moment from "moment";

pool.on("connect", () => {
  console.log("connected to db");
});

const seed = () => {
  const created_on = moment(new Date());
  const seedUserQuery = `INSERT INTO
      users (
        email,
        first_name,
        last_name,
        password,
        created_on
      ) 
      VALUES 
      ('Abay@gmail.com', 'Abay', 'Akhanov', 'Aa135246', ${created_on}),
      ('Kenny@gmail.com', 'Kenny', 'Kenny', 'Aa135246', ${created_on}),
      ('Damn@gmail.com', 'Damilola', 'Aa135246', ${created_on}),
      ('Koka@gmail.com', 'Kokakola', 'Aa135246', ${created_on}),
      ('KingSlayer@gmail.com', 'Kingsley', 'Aa135246', ${created_on})`;

  pool
    .query(seedUserQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Seed users
 */

const seedUser = () => {
  seed();
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

export { seedUser };

require("make-runnable");
