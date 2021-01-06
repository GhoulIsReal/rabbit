import jwt from "jsonwebtoken";
import env from "../../env";

export default function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.status(403).send("authorize first !");

  jwt.verify(token, env.secret, (err, user) => {
    if (err) return res.send("error occured");
    req.user = user;
    next();
  });
}
