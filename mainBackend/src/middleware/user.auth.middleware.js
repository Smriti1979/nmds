/** @format */

import jwt from "jsonwebtoken";
import { pool } from "../db/index.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || "").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: `Unauthorized request`});

    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const usersql = "SELECT * FROM Users WHERE ID=$1";
    const userDetail = await pool.query(usersql, [decodedToken._id]);
    const user = userDetail.rows[0];

    if (!user) {
      return res.status(401).json({ error: `Invalid Access Token`});

    }
    
    const User = {
      email: user.email,
      id: user.id,
      developer:user.developer
    };

    req.user = User;
    next();
  } catch (error) {
    return res.status(500).json({ error: error || "Invalid access token"});


  }
};
