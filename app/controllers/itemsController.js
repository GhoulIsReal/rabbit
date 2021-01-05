import dbQuery from "../db/dbQuery";
import moment from "moment";

/**
 * Create An Item
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createItem = async (req, res) => {
  const { name, isSold } = req.body;

  const created_on = moment(new Date());

  if (
    name === undefined ||
    name === "" ||
    isSold === undefined ||
    isSold === ""
  ) {
    return res.status(400).send("name and isSold field cannot be empty");
  }

  const createItemQuery = `INSERT INTO
  items(name, isSold, created_on)
  VALUES($1, $2, $3)
  returning *`;
  const values = [name, isSold, created_on];

  try {
    await dbQuery.query(createItemQuery, values);
    return res.status(200).send("successfully added");
  } catch (error) {
    return res.status(400).send("Operation was not successful");
  }
};

const getAllItems = async (req, res) => {
  const getAllItemsQuery = "SELECT * FROM items ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(getAllItemsQuery);
    if (rows[0] === undefined) {
      return res.status(404).send("There are no buses");
    }
    return rows;
  } catch (error) {
    return res.status(400).send("An error Occured");
  }
};

export { createItem, getAllItems };
