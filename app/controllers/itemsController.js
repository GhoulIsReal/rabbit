import dbQuery from "../db/dbQuery";
import moment from "moment";
import { isEmpty } from "../helpers/validations";

/**
 * Create An Item
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createItem = async (req, res) => {
  const { name, price } = req.body;
  const user = req.user;
  const created_on = moment(new Date());

  if (isEmpty(name) || isEmpty(price)) {
    return res.status(400).send("name and price field cannot be empty");
  }

  const createItemQuery = `INSERT INTO
  items(name, price, isSold, sellerid, created_on)
  VALUES($1, $2, $3, $4, $5)
  returning *`;
  const values = [name, price, false, user.user_id, created_on];

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
