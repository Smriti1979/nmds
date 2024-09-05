
const db = require("../models/index.js");
const projectUtils = require('../helper_utils/projectUtils.js');


const { Pool } = require('pg');


// DB connection for ASI
const poolNAS = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASENAS,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});





async function getIndicatorsRepo() {
  try {
    let query = 'select indicator_code,description,reporting_unit from indicator';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getApproachRepo() {
  try {
    let query = 'select approach_code,description from Approach';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getRevisionRepo() {
  try {
    let query = 'select revision_code,description,short from Revision';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAccountRepo() {
  try {
    let query = 'select account_code,description from Account';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getFrequencyRepo() {
  try {
    let query = 'select frequency_code,description from Frequency';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getQuarterlyRepo() {
  try {
    let query = 'select quarterly_code,description from Quarterly';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getInstitutionalRepo() {
  try {
    let query = 'select institutional_code,description from Institutional';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getIndustryRepo() {
  try {
    let query = 'select industry_code,description from Industry';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getSubindustryRepo() {
  try {
    let query = 'select subindustry_code,description from Subindustry';
      // query += ' LIMIT 10';
    const result = await poolNAS.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getNASRecordsRepo(req, isUserValid) {

    var seriescode =req.query.Series   
    var frequencycode =req.query.Frequency   
    var financialyear =req.query.Financial_year
    var indicatorcode =req.query.Indicator_code
    var quarterlycode = req.query.Quarterly_code;
    var approachcode = req.query.Approach_code;
    var revisioncode = req.query.Revision_code;
    var accountcode = req.query.Account_code;
    var institutionalcode = req.query.Institutional_code;
    var industrycode = req.query.Industry_code;
    var subindustrycode = req.query.Subindustry_code;

    if (frequencycode == 'Annual' ) {
      frequencycode = '01';
    }
    if (frequencycode == 'Quarterly' ) {
      frequencycode = '02';
    }

    if (seriescode == 'Current_series' ) {
      seriescode = 'Current';
    }
    if (seriescode == 'Back_series' ) {
      seriescode = 'Back';
    }
    
    let query = `SELECT nas.release_year as ReleaseYear,ind.description AS Indicator,frq.description AS Frequency,qtr.description AS Quarterly,nas.financial_year AS FinancialYear,app.description as Approach,rev.description as Revision,acc.description as Account,ins.description as Institutional,inds.description as Industry,sinds.description as Subindustry, nas.Series as Series, nas.current_price as CurrentPrice, nas.constant_price as ConstantPrice, ind.unit as Unit FROM nas_fact as nas LEFT JOIN Indicator as ind ON nas.indicator_code  = ind.indicator_code  LEFT JOIN Approach as app ON nas.approach_code = nas.Approach_code LEFT JOIN Revision as rev ON nas.revision_code = rev.revision_code LEFT JOIN Account as acc ON nas.account_code = acc.account_code LEFT JOIN Frequency as frq ON nas.frequency_code = frq.frequency_code LEFT JOIN Quarterly as qtr ON nas.quarterly_code = qtr.quarterly_code LEFT JOIN Institutional as ins ON nas.institutional_code = ins.institutional_code LEFT JOIN Industry as inds ON nas.industry_code = inds.industry_code LEFT JOIN Subindustry as sinds ON nas.subindustry_code = sinds.subindustry_code`;

    var mainSeries = projectUtils.findCommAndStringAllCaseCPI(seriescode, 'nas.series');
    var mainFinancialyear = projectUtils.findCommAndStringAllCaseCPI(financialyear, 'nas.financial_year');
    var mainIndicatorcode = projectUtils.findCommAndStringAllCaseCPI(indicatorcode, 'nas.indicator_code');
    var mainFrequencycode = projectUtils.findCommAndStringAllCaseCPI(frequencycode, 'nas.frequency_code');
    var mainQuarterlycode = projectUtils.findCommAndStringAllCaseCPI(quarterlycode, 'nas.quarterly_code');
    var mainApproachcode = projectUtils.findCommAndStringAllCaseCPI(approachcode, 'nas.approach_code');
    var mainRevisioncode = projectUtils.findCommAndStringAllCaseCPI(revisioncode, 'nas.revision_code');
    var mainAccountcode = projectUtils.findCommAndStringAllCaseCPI(accountcode, 'nas.account_code');
    var mainInstitutionalcode = projectUtils.findCommAndStringAllCaseCPI(institutionalcode, 'nas.institutional_code');
    var mainIndustrycode = projectUtils.findCommAndStringAllCaseCPI(industrycode, 'nas.industry_code');
    var mainSubindustrycode = projectUtils.findCommAndStringAllCaseCPI(subindustrycode, 'nas.subindustry_code');

    var afterQueryContent = projectUtils.createQueryNAS(mainSeries, mainFinancialyear, mainIndicatorcode, mainFrequencycode, mainQuarterlycode, mainApproachcode, mainRevisioncode, mainAccountcode, mainInstitutionalcode, mainIndustrycode, mainSubindustrycode, true);

    query += afterQueryContent; 

    if (!isUserValid) {
      query += ' LIMIT 10';
    }
    const result = await poolNAS.query(query);
    // console.log("final_query......", query)
    return result.rows;
 
}



module.exports = {
  getIndicatorsRepo,
  getApproachRepo,
  getRevisionRepo,
  getAccountRepo,
  getFrequencyRepo,
  getQuarterlyRepo,
  getInstitutionalRepo,
  getIndustryRepo,
  getSubindustryRepo,
  getNASRecordsRepo,
};
