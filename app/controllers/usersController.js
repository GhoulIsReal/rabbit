import moment from "moment";

import dbQuery from "../db/dbQuery";

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from "../helpers/validations";

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  const created_on = moment(new Date());
  if (
    isEmpty(email) ||
    isEmpty(first_name) ||
    isEmpty(last_name) ||
    isEmpty(password)
  ) {
    return res
      .status(400)
      .send("Email, password, first name and last name field cannot be empty");
  }
  if (!isValidEmail(email)) {
    return res.status(400).send("Please enter a valid Email");
  }
  if (!validatePassword(password)) {
    return res
      .status(400)
      .send("Password must be more than five(5) characters");
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, created_on)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
  const values = [email, first_name, last_name, hashedPassword, created_on];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.first_name,
      dbResponse.last_name
    );
    const successMessage = { status: "success" };
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(200).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      return res.status(409).send("User with that EMAIL already exist");
    }
    return res.status(400).send("Operation was not successful");
  }
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const siginUser = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    return res.status(400).send("Email or Password detail is missing");
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    return res.status(400).send("Please enter a valid Email or Password");
  }
  const signinUserQuery = "SELECT * FROM users WHERE email = $1";
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res.status(404).send("User with this email does not exist");
    }
    if (!comparePassword(dbResponse.password, password)) {
      return res.status(400).send("The password you provided is incorrect");
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.first_name,
      dbResponse.last_name
    );
    delete dbResponse.password;
    const successMessage = { status: "success" };
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(200).send(successMessage);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

export { createUser, siginUser };
