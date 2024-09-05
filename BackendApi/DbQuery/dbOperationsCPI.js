const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
const db = require("../models/index.js");
const projectUtils = require('../helper_utils/projectUtils.js');


const { Pool } = require('pg');


// DB connection for CPI
const poolCPI = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASECPI,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});



async function getInflationCurrentRate2012(req, isUserValid) {
  try {

    var baseyear = req.query.Base_year;
    var year = req.query.Year;
    var month = req.query.Month;
    var stateCode = req.query.State_code;
    var dataType = req.query.Sector;
    var groupCode = req.query.Group_code;
    var subGroup_No = req.query.Subgroup_code;

    let query = '';
    // console.log("dataType", dataType)
    if (dataType == '1') {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == '2') {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == '3') {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == undefined) {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    }

    var mainBaseyear = projectUtils.findCommAndStringAllCaseCPI(baseyear, 'iRC.base_year');
    var mainYear = projectUtils.findCommAndStringAllCaseCPI(year, 'iRC.year');
    var mainMonths = projectUtils.findCommAndStringAllCaseCPI(month, 'iRC.month');
    var mainState = projectUtils.findCommAndStringAllCaseCPI(stateCode, 'iRC.state_code');
    var mainSlno = projectUtils.findCommAndStringAllCaseCPI(groupCode, 'iRC.group_code');
    var mainSubGroupCode = projectUtils.findCommAndStringAllCaseCPI(subGroup_No, 'iRC.subgroup_code');

    if (dataType != undefined) {
      query = projectUtils.checkAndIsExitOrNotCPI(query, dataType)
    }
    query = projectUtils.addCurrentOrBackCPI(query, 'Current')

    var afterQueryContent = projectUtils.createQueryCPI(mainBaseyear, mainYear, mainMonths, mainState, mainSlno, mainSubGroupCode, false);
    query += afterQueryContent;
    query = query + ' ORDER BY iRC.year ASC, mt.description ASC, sta.description ASC,iRC.group_code ';


    if (!isUserValid) {
      query += ' LIMIT 20';
    }
    console.log("Query_State_Current", query)
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}




async function getInflationCurrentRateBackSeries2012(req, isUserValid) {
  try {

    var baseyear = req.query.Base_year;
    var year = req.query.Year;
    var month = req.query.Month;
    var stateCode = req.query.State_code;
    var dataType = req.query.Sector;
    var groupCode = req.query.Group_code;
    var subGroup_No = req.query.Subgroup_code;
    // console.log("groupCode", groupCode)

    let query = '';

    if (dataType == '1') {


      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == '2') {

      query = 'SELECT  iRC.base_year as BaseYear, iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == '3') {

      query = 'SELECT  iRC.base_year as BaseYear, iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    } else if (dataType == undefined) {
      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';

    } else {

      query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,sta.description AS State,sec.description  AS Sector,gro.description  AS Group,subG.description  AS SubGroup,iRC.index AS Index,iRC.inflation AS Inflation,iRC.release_status  AS Status FROM cpi_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN SECTOR as sec ON iRC.sector_code = sec.sector_code JOIN STATE as sta ON iRC.state_code = sta.state_code JOIN subgroups as subG ON iRC.subgroup_code = subG.subgroup_code JOIN groups as gro ON iRC.group_code = gro.group_code ';
    }


    var mainBaseyear = projectUtils.findCommAndStringAllCaseCPI(baseyear, 'iRC.base_year');
    var mainYear = projectUtils.findCommAndStringAllCaseCPI(year, 'iRC.year');
    var mainMonths = projectUtils.findCommAndStringAllCaseCPI(month, 'iRC.month');
    var mainState = projectUtils.findCommAndStringAllCaseCPI(stateCode, 'iRC.state_code');
    var mainSlno = projectUtils.findCommAndStringAllCaseCPI(groupCode, 'iRC.group_code');
    var mainSubGroupCode = projectUtils.findCommAndStringAllCaseCPI(subGroup_No, 'iRC.subgroup_code');

    if (dataType != undefined) {
      query = projectUtils.checkAndIsExitOrNotCPI(query, dataType)
    }
    query = projectUtils.addCurrentOrBackCPI(query, 'Back')


    var afterQueryContent = projectUtils.createQueryCPI(mainBaseyear, mainYear, mainMonths, mainState, mainSlno, mainSubGroupCode, false);
    query += afterQueryContent;
    query = query + ' ORDER BY iRC.year ASC, mt.description ASC, sta.description ASC,iRC.group_code ';

    if (!isUserValid) {
      query += ' LIMIT 20';
    }
    console.log("Query_State_Back", query)
    const result = await poolCPI.query(query);
    return result.rows;

  } catch (error) {
    console.error(error);
    return null;
  }
}





async function getAllIndiaItemInflationCombined2012(req, isUserValid) {
  try {

    totalRows = ' LIMIT 20 ';

    var baseyear = req.query.Base_year;
    var year = req.query.Year;
    var month = req.query.Month;
    var item = req.query.Item;

    let query = 'SELECT iRC.base_year as BaseYear,  iRC.year  AS Year,mt.description  AS Month,itCode.description AS Item,iRC.index,iRC.inflation,iRC.release_status AS Status FROM item_fact as iRC JOIN MONTH as mT ON iRC.month = mt.month JOIN ITEMS as itCode ON iRC.item_code = itCode.item_code';

    var mainBaseyear = projectUtils.findCommAndStringAllCaseCPI(baseyear, 'iRC.base_year');
    var mainYear = projectUtils.findCommAndStringAllCaseCPI(year, 'iRC.year');
    var mainMonths = projectUtils.findCommAndStringAllCaseCPI(month, 'iRC.month');
    var mainItem = projectUtils.findCommAndStringAllCaseCPI(item, 'iRC.item_code');

    var afterQueryContent = projectUtils.createQueryCPI(mainBaseyear, mainYear, mainMonths, mainItem, '', '', true);
    query += afterQueryContent;
    if (!isUserValid) {
      query += ' LIMIT 20';
    }
    const result = await poolCPI.query(query);
    // console.log("query_Item", query)
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}




async function getAllMonths() {
  try {
    let query = 'select month,description from Month';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAllSector() {
  try {
    let query = 'select sector_code,description from Sector';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAllState() {
  try {
    let query = 'select state_code,description from State';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getAllItems() {
  try {
    let query = 'select item_code,description from Items';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getAllGroups() {
  try {
    let query = 'select group_code,description from Groups';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



async function getAllSubgroups() {
  try {
    let query = 'select subgroup_code,description from Subgroups';
      // query += ' LIMIT 10';
    const result = await poolCPI.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}



module.exports = {
  getInflationCurrentRate2012,
  getInflationCurrentRateBackSeries2012,
  getAllIndiaItemInflationCombined2012,
  getAllMonths,
  getAllSector,
  getAllState,
  getAllItems,
  getAllGroups,
  getAllSubgroups,
};
