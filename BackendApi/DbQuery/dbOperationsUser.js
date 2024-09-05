const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
const db = require("../models/index.js");
const projectUtils = require('../helper_utils/projectUtils.js');


const { Pool } = require('pg');

// DB connection for CPI
const poolLog = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});



async function getAllLogData( isUserValid) {
  try {

    let query = 'SELECT * FROM logs';
    // console.log("query", query)
    if (!isUserValid) {
      query += ' LIMIT 10';
    }
    const result = await poolLog.query(query);
    //  console.log("query", query)
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getAllUserDetails( isUserValid) {
  try {

    let query = 'SELECT * FROM users';
    if (!isUserValid) {
      query += ' LIMIT 10';
    }
    const result = await poolLog.query(query);
    // console.log("query", query)
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}




module.exports = {
  
  getAllLogData,
  getAllUserDetails
};
