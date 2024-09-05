const encrypt = (data) => {
  return Buffer.from(data).toString('base64');
};

const databaseLimit = () => {
  return 'LIMIT 10';
};




const findCommAndStringAllCaseCPI = (dataString, typeOfQuery) => {
  var queryRowData = '';
  var query = '';
  if (dataString != undefined) {

    var dataArray = dataString.split(',')

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] == ',' || dataArray[i] == '') {
      } else {
        queryRowData += "'" + dataArray[i].trimEnd() + "'" + ',';
      }
    }
    if (queryRowData.endsWith(',')) {
      query = `${typeOfQuery} IN (${queryRowData.substring(0, queryRowData.length - 1)})`;
    } else {
      query = `${typeOfQuery} IN (${queryRowData})`;
    }
  }

  return query;
};




const checkAndIsExitOrNotCPI = (query, sectorType) => {
  var rawQuery = '';
  if (query.includes('WHERE') || query.includes('where')) {
    rawQuery = ' AND iRC.sector_code IN ('  + sectorType + ')';
  } else {
    rawQuery = ' WHERE iRC.sector_code  IN (' + sectorType  + ')';
  }
  return query + rawQuery;
};




const addCurrentOrBackCPI = (query, isType) => {
  var rawQuery = '';
  if (query.includes('WHERE') || query.includes('where')) {

    if (isType == 'Back') {
      rawQuery = ' AND iRC.series  =  ' + "'Back'" + '';
    } else {
      rawQuery = ' AND iRC.series =  ' + "'Current'" + '';
    }
  } else {
    if (isType == 'Back') {
      rawQuery = ' WHERE iRC.series =  ' + "'Back'" + '';
    } else {
      rawQuery = ' WHERE iRC.series =  ' + "'Current'" + '';
    }

  }

  return query + rawQuery;
};



const createQueryCPI = (query1, query2, query3, query4, query5, query6, isWhereAdd) => {

  var query = '';
  const result = [];

  if (query1 == undefined || query1 == '') {
  } else {
    result.push(query1);
  }
  if (query2 == undefined || query2 == '') {
  } else {
    result.push(query2);
  }
  if (query3 == undefined || query3 == '') {
  } else {
    result.push(query3);
  }
  if (query4 == undefined || query4 == '') {
  } else {
    result.push(query4);
  }
  if (query5 == undefined || query5 == '') {
  } else {
    result.push(query5);
  }
  if (query6 == undefined || query6 == '') {
  } else {
    result.push(query6);
  }

  if (result.length > 0 && isWhereAdd) {
    query += ' WHERE ';
  } else {
    query += ' AND';
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] == ',' || result[i] == '') {
    } else {
      if (i == (result.length - 1)) {
        query += " "+result[i].trimEnd();
      } else {
        query += " "+result[i].trimEnd() + ' AND ';
      }
    }
  }

  if (query.endsWith('AND') || query.endsWith(' AND') ) {
    query = query.substring(0, query.length - 3);
  }
  return query;
};





const createQueryAnnualIIP = (query1, query2, query3, query4, isWhereAdd) => {

  var query = '';
  const result = [];

  if (query1 == undefined || query1 == '') {
  } else {
    result.push(query1);
  }
  if (query2 == undefined || query2 == '') {
  } else {
    result.push(query2);
  }
  if (query3 == undefined || query3 == '') {
  } else {
    result.push(query3);
  }
  if (query4 == undefined || query4 == '') {
  } else {
    result.push(query4);
  }

  if (result.length > 0 && isWhereAdd) {
    query += ' WHERE ';
  } else {
    query += ' AND';
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] == ',' || result[i] == '') {
    } else {
      if (i == (result.length - 1)) {
        query += " "+result[i].trimEnd();
      } else {
        query += " "+result[i].trimEnd() + ' AND';
      }
    }
  }

  if (query.endsWith('AND') || query.endsWith(' AND ') ) {
    query = query.substring(0, query.length - 3);
  }
  console.log("queryData" ,query)
  return query;
};




const createQueryMonthlyIIP = (query1, query2, query3, query4, query5, isWhereAdd) => {

  var query = '';
  const result = [];

  if (query1 == undefined || query1 == '') {
  } else {
    result.push(query1);
  }
  if (query2 == undefined || query2 == '') {
  } else {
    result.push(query2);
  }
  if (query3 == undefined || query3 == '') {
  } else {
    result.push(query3);
  }
  if (query4 == undefined || query4 == '') {
  } else {
    result.push(query4);
  }
  if (query5 == undefined || query5 == '') {
  } else {
    result.push(query5);
  }

  if (result.length > 0 && isWhereAdd) {
    query += ' WHERE ';
  } else {
    query += ' AND';
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] == ',' || result[i] == '') {
    } else {
      if (i == (result.length - 1)) {
        query += " "+result[i].trimEnd();
      } else {
        query += " "+result[i].trimEnd() + ' AND';
      }
    }
  }

  if (query.endsWith('AND') || query.endsWith(' AND ') ) {
    query = query.substring(0, query.length - 3);
  }
  console.log("queryData" ,query)
  return query;
};




const createQueryASI = (query1, query2, query3, query4, query5, query6, isWhereAdd) => {

  var query = '';
  const result = [];

  if (query1 == undefined || query1 == '') {
  } else {
    result.push(query1);
  }
  if (query2 == undefined || query2 == '') {
  } else {
    result.push(query2);
  }
  if (query3 == undefined || query3 == '') {
  } else {
    result.push(query3);
  }
  if (query4 == undefined || query4 == '') {
  } else {
    result.push(query4);
  }
  if (query5 == undefined || query5 == '') {
  } else {
    result.push(query5);
  }
  if (query6 == undefined || query6 == '') {
  } else {
    result.push(query6);
  }

  if (result.length > 0 && isWhereAdd) {
    query += ' WHERE ';
  } else {
    query += ' AND';
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] == ',' || result[i] == '') {
    } else {
      if (i == (result.length - 1)) {
        query += " "+result[i].trimEnd();
      } else {
        query += " "+result[i].trimEnd() + ' AND';
      }
    }
  }

  if (query.endsWith('AND') || query.endsWith(' AND ') ) {
    query = query.substring(0, query.length - 3);
  }
  // console.log("queryData....." ,query)
  return query;
};





const createQueryNAS = (query1, query2, query3, query4, query5, query6, query7, query8, query9, query10, query11, isWhereAdd) => {

  var query = '';
  const result = [];

  if (query1 == undefined || query1 == '') {
  } else {
    result.push(query1);
  }
  if (query2 == undefined || query2 == '') {
  } else {
    result.push(query2);
  }
  if (query3 == undefined || query3 == '') {
  } else {
    result.push(query3);
  }
  if (query4 == undefined || query4 == '') {
  } else {
    result.push(query4);
  }
  if (query5 == undefined || query5 == '') {
  } else {
    result.push(query5);
  }
  if (query6 == undefined || query6 == '') {
  } else {
    result.push(query6);
  }
  if (query7 == undefined || query7 == '') {
  } else {
    result.push(query7);
  }
  if (query8 == undefined || query8 == '') {
  } else {
    result.push(query8);
  }
  if (query9 == undefined || query9 == '') {
  } else {
    result.push(query9);
  }
  if (query10 == undefined || query10 == '') {
  } else {
    result.push(query10);
  }
  if (query11 == undefined || query11 == '') {
  } else {
    result.push(query11);
  }

  if (result.length > 0 && isWhereAdd) {
    query += ' WHERE ';
  } else {
    query += ' AND';
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] == ',' || result[i] == '') {
    } else {
      if (i == (result.length - 1)) {
        query += " "+result[i].trimEnd();
      } else {
        query += " "+result[i].trimEnd() + ' AND';
      }
    }
  }

  if (query.endsWith('AND') || query.endsWith(' AND ') ) {
    query = query.substring(0, query.length - 3);
  }
  // console.log("queryData....." ,query)
  return query;
};



module.exports = {
  encrypt,
  createQueryCPI,
  addCurrentOrBackCPI,
  checkAndIsExitOrNotCPI,
  findCommAndStringAllCaseCPI,
  createQueryAnnualIIP,
  createQueryMonthlyIIP,
  createQueryASI,
  createQueryNAS
};