import pool from "./pool";

pool.on("connect", () => {
  console.log("connected to the db");
});

const createItemsTable = () => {
  const itemCreateQuery = `CREATE TABLE IF NOT EXISTS items
    (id SERIAL PRIMARY KEY NOT NULL, 
    name VARCHAR(100),
    isSold boolean NOT NULL,  
    created_on DATE NOT NULL)`;

  pool
    .query(itemCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropItemsTable = () => {
  const itemsDropQuery = "DROP TABLE IF EXISTS items";
  pool
    .query(itemsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createAllTables = () => {
  createItemsTable();
};

const dropAllTables = () => {
  dropItemsTable();
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require('make-runnable');
