/** @format */

import { pool } from "../../db/index.js";

import bcrypt from "bcrypt";
import generateAccessToken from "../../utils/genrateAccessToken.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if ([email, password].some((item) => item.trim() == "")) {
      return res.status(403).json({ error: "Email and password both are required" });
    }
    const query = "SELECT * FROM Users WHERE email = $1";
    const result = await pool.query(query, [email]);
    const UserssDetail = result.rows[0];
    if (!UserssDetail) {
      return res.status(403).json({ error: "domain does not exist" });
    }
    const correctpassword = await bcrypt.compare(
      password,
      UserssDetail.password
    );
    if (!correctpassword) {

      return res.status(403).json({ error: "Required correct password" });
    }

    const accessToken = generateAccessToken({
      email: email,
      id: UserssDetail.id,
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
      return res.status(200).send({
        data: email,
        msg: "UserVerfied",
        statusCode: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error in signIn Domain" });
  }
};
