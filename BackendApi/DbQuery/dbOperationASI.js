
const db = require("../models/index.js");
const projectUtils = require('../helper_utils/projectUtils.js');


const { Pool } = require('pg');


// DB connection for ASI
const poolASI = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASEASI,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});





async function getIndicatorRepo() {
  try {
    let query = 'select indicator_code,description,reporting_unit from indicator';
      // query += ' LIMIT 10';
    const result = await poolASI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getStateRepo() {
  try {
    let query = 'select state_code,description from state';
      // query += ' LIMIT 10';
    const result = await poolASI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getNicRepo() {
  try {
    let query = 'select nic_code,description,type from Nic';
      // query += ' LIMIT 10';
    const result = await poolASI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}





async function getASIRecordsRepo(req, isUserValid) {

    var classificationyear =req.query.Classification_year
    var financialyear =req.query.Financial_year
    var indicator =req.query.Indicator_code 
    var state = req.query.State_code;
    var nic = req.query.NIC_code;
    var type = req.query.NIC_code_type;

    if (type == undefined || type.includes('All') ) {
      type = '2-digit,3-digit,4-digit';
    }
    
    let query = `SELECT asi.classification_year as ClassificationYear, asi.financial_year as FinancialYear,ind.description AS Indicator,st.description AS State,nic.description AS NIC,asi.nic_code_type as NIC_CODE_Type,asi.indicator_value as Indicator_Values,ind.unit as Unit FROM asi_fact as asi LEFT JOIN Indicator as ind ON asi.indicator_code  = ind.indicator_code LEFT JOIN State as st ON asi.state_code = st.state_code LEFT JOIN Nic as nic ON asi.nic_id = nic.nic_id`;

    var mainClassificationyear = projectUtils.findCommAndStringAllCaseCPI(classificationyear, 'asi.classification_year');
    var mainFinancialyear = projectUtils.findCommAndStringAllCaseCPI(financialyear, 'asi.financial_year');
    var mainIndicator = projectUtils.findCommAndStringAllCaseCPI(indicator, 'asi.indicator_code');
    var mainState = projectUtils.findCommAndStringAllCaseCPI(state, 'asi.state_code');
    var mainNic = projectUtils.findCommAndStringAllCaseCPI(nic, 'asi.nic_code');
    var mainType = projectUtils.findCommAndStringAllCaseCPI(type, 'asi.nic_code_type');

    var afterQueryContent = projectUtils.createQueryASI( mainClassificationyear, mainFinancialyear, mainIndicator, mainState, mainNic, mainType, true);

    query += afterQueryContent; 

    if (!isUserValid) {
      query += ' LIMIT 10';
    }
    const result = await poolASI.query(query);
    // console.log("final_query......", query)
    return result.rows;
 
}



module.exports = {
  getIndicatorRepo,
  getStateRepo,
  getNicRepo,
  getASIRecordsRepo,
};
