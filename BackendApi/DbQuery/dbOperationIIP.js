
const db = require("../models/index.js");
const projectUtils = require('../helper_utils/projectUtils.js');


const { Pool } = require('pg');


// DB connection for IIP
const poolIIP = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASEIIP,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});





async function getAllMonthRepo() {
  try {
    let query = 'select month,description from Month';
      // query += ' LIMIT 10';
    const result = await poolIIP.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAllFrequencyRepo() {
  try {
    let query = 'select frequency_code,description from Frequency';
      // query += ' LIMIT 10';
    const result = await poolIIP.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAllCategoryRepo() {
  try {
    let query = 'select category_code,description from Category';
      // query += ' LIMIT 10';
    const result = await poolIIP.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getAllSubcategoryRepo() {
  try {
    let query = 'select subcategory_code,description from Subcategory';
      // query += ' LIMIT 10';
    const result = await poolIIP.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}






async function getAllIndexandGrowthRateAnnualRepo(req, isUserValid) {

    var financialyear =req.query.Financial_year 
    var category = req.query.Category_code;
    var subcategory = req.query.Subcategory_code;
    var type = req.query.Type;

    if (type == undefined || type.includes('All') ) {
      type = 'Use-based category,Sectoral,General';
    }
    
    let query = `SELECT iip.financialyear as FinancialYear, cat.description AS Category, COALESCE(scat.description, '') as Subcategory, iip.Type as Type, iip.Index as Index , iip.growth_rate as GrowthRate FROM iip_fact as iip LEFT JOIN Category as cat ON iip.Category_Code  = cat.Category_Code LEFT JOIN Subcategory as scat ON iip.Subcategory_Code = scat.Subcategory_Code`;

  
    var mainFinancialyear = projectUtils.findCommAndStringAllCaseCPI(financialyear, 'iip.Financialyear');
    var mainCategory = projectUtils.findCommAndStringAllCaseCPI(category, 'iip.Category_Code');
    var mainSubcategory = projectUtils.findCommAndStringAllCaseCPI(subcategory, 'iip.Subcategory_Code');
    var mainType = projectUtils.findCommAndStringAllCaseCPI(type, 'iip.Type');

    var afterQueryContent = projectUtils.createQueryAnnualIIP( mainFinancialyear, mainCategory, mainSubcategory, mainType,true);

    query += afterQueryContent; 

    if (query.includes('WHERE') || query.includes('where')) {
      query = query + ' AND iip.frequency_code=1 ';
    }
   else {
      query = query + ' Where iip.frequency_code=1 ';
    }
    if (!isUserValid) {
      query += ' LIMIT 10';
    }
    const result = await poolIIP.query(query);
    // console.log("SSSSSSSSS", query)
    return result.rows;
  
}



async function getAllIndexandGrowthRateMonthlyRepo(req, isUserValid) {

 
  var year = req.query.Year;
  var month = req.query.Month;
  // var financialyear =req.query.Financial_year 
  var category = req.query.Category_code;
  var subcategory = req.query.Subcategory_code;
  var type = req.query.Type;
  if (type == undefined || type.includes('All') ) {
    type = 'Use-based category,Sectoral,General';
  }


  let query = `SELECT  iip.year  AS Year, mt.description as Months, cat.description as Category, COALESCE(scat.description, '') as Subcategory, iip.Type as Type, iip.Index as Index , iip.growth_rate as GrowthRate FROM iip_fact as iip LEFT JOIN MONTH as mt ON iip.month = mt.month LEFT JOIN Category as cat ON iip.Category_Code  = cat.Category_Code LEFT JOIN Subcategory as scat ON iip.Subcategory_Code = scat.Subcategory_Code`;

  var mainYear = projectUtils.findCommAndStringAllCaseCPI(year, 'iip.Year');
  var mainMonths = projectUtils.findCommAndStringAllCaseCPI(month, 'iip.Month');
  // var mainFinancialyear = projectUtils.findCommAndStringAllCaseCPI(financialyear, 'iip.Financialyear');
  var mainCategory = projectUtils.findCommAndStringAllCaseCPI(category, 'iip.Category_Code');
  var mainSubcategory = projectUtils.findCommAndStringAllCaseCPI(subcategory, 'iip.Subcategory_Code');
  var mainType = projectUtils.findCommAndStringAllCaseCPI(type, 'iip.Type');

  var afterQueryContent = projectUtils.createQueryMonthlyIIP(mainYear, mainMonths, mainCategory, mainSubcategory, mainType,true);

  query += afterQueryContent; 
  
  if (query.includes('WHERE') || query.includes('where')) {
    query = query + ' AND iip.frequency_code=2 ';
  }
 else {
    query = query + ' Where iip.frequency_code=2 ';
  }
  if (!isUserValid) {
    query += ' LIMIT 10';
  }
  const result = await poolIIP.query(query);
  // console.log("SSSSSSSSS", query)
  return result.rows;

}


module.exports = {
  getAllMonthRepo,
  getAllFrequencyRepo,
  getAllCategoryRepo,
  getAllSubcategoryRepo,
  getAllIndexandGrowthRateAnnualRepo,
  getAllIndexandGrowthRateMonthlyRepo,
};
