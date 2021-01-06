import pool from "./pool";

pool.on("connect", () => {
  console.log("connected to the db");
});

const createUsersTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
    (id SERIAL PRIMARY KEY NOT NULL, 
      email VARCHAR(100) UNIQUE NOT NULL, 
      first_name VARCHAR(100), 
      last_name VARCHAR(100), 
      password VARCHAR(100) NOT NULL,
      created_on DATE NOT NULL)`;

  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createItemsTable = () => {
  const itemCreateQuery = `CREATE TABLE IF NOT EXISTS items
    (id SERIAL PRIMARY KEY NOT NULL, 
    name VARCHAR(100),
    isSold boolean NOT NULL,  
    sellerID smallint NOT NULL,
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

const dropUsersTable = () => {
  const usersDropQuery = "DROP TABLE IF EXISTS users";
  pool
    .query(usersDropQuery)
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
  createUsersTable();
  createItemsTable();
};

const dropAllTables = () => {
  dropUsersTable();
  dropItemsTable();
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
