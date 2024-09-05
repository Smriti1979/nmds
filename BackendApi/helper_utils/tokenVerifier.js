const jwt = require("jsonwebtoken");
const db = require("../models");
require('dotenv').config();

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
const User = db.users;
var userModel = User;

function verifyToken(authorization) {
    
    const accessToken = jwt.verify(authorization,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        if (err) {
          // console.log("err", err)
        }
        userModel = decoded;
    });
    return userModel;
  }
  

  module.exports = {
    verifyToken: verifyToken
  };