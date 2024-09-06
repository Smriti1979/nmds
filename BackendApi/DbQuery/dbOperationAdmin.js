/** @format */

const db = require("../models/index.js");
const { Pool } = require("pg");
require("dotenv").config();
// DB connection for ASI
const pooladmin = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});

/**
 * --------Admin validation-----------
 *
 */

async function EmailValidation(email) {
  const query = "SELECT * FROM adminusers WHERE email = $1";
  const result = await pooladmin.query(query, [email]);
  return result.rows[0];
}

/***
 * 
 * --------Create Product--------------
 * 
 */

async function createProductdb(
  id,
  title,
  count,
  icon,
  period,
  tooltip,
  type,
  url,
  tables,
  swagger,
  viz,
  category
) {
  try {
    await pooladmin.query("BEGIN");

    const productQuery = `INSERT INTO product(id, title, count, icon, period, tooltip, type, url, tables, swagger, viz) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    await pooladmin.query(productQuery, [
      id,
      title,
      count,
      icon,
      period,
      tooltip,
      type,
      url,
      tables,
      swagger,
      viz,
    ]);

    const categories = category.split(",").map((cat) => cat.trim());

    for (const cat of categories) {
      const categoryExistsQuery = `SELECT 1 FROM theme WHERE category = $1`;
      const categoryExistsResult = await pooladmin.query(categoryExistsQuery, [
        cat,
      ]);

      if (categoryExistsResult.rows.length === 0) {
        return {
          error: true,
          errorCode: 405,
          errorMessage: `Category '${cat}' not found in theme table`,
        };
      }

      const productThemeQuery = `INSERT INTO producttheme("productId", category) VALUES($1, $2)`;
      await pooladmin.query(productThemeQuery, [id, cat]);
    }

    await pooladmin.query("COMMIT");
    return categories;
  } catch (error) {
    await pooladmin.query("ROLLBACK");
    console.error(error);
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Problem in db unable to create product: ${error.message}`,
    };
  }
}
/**
 * create theme
 */
async function createThemedb(category, name) {
  try {
    const sqlQuery = `INSERT INTO theme(category,name) VALUES($1,$2)`;
    await pooladmin.query(sqlQuery, [category, name]);
    const result = await pooladmin.query(
      "SELECT * FROM theme WHERE category=$1",
      [category]
    );
    if (result.rows.length === 0) {
      return {
        error: true,
        errorCode: 405,
        errorMessage: `product not found after insertion`,
      };
    }
    return result.rows[0];
  } catch (error) {
    return {
      error: true,
      errorCode: 405,
      errorMessage: `Problem in db unable to create theme`,
    };
  }
}
/**
 * Metadata
 */
async function createMetadatadb(
  product,
  title,
  category,
  geography,
  frequency,
  timePeriod,
  dataSource,
  description,
  lastUpdateDate,
  futureRelease,
  basePeriod,
  keystatistics,
  NMDS,
  nmdslink,
  remarks
) {
  try {
    // const metaQuery = `INSERT INTO metadata(product,title,category,geography,frequency,timePeriod,dataSource,description,lastUpdateDate,futureRelease,basePeriod,keystatistics,NMDS,nmdslink,remarks) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;
    const metaQuery = `INSERT INTO metadata(product,title,category,geography,frequency,"timePeriod","dataSource",description,"lastUpdateDate","futureRelease","basePeriod",keystatistics,"NMDS",nmdslink,remarks) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;

    await pooladmin.query(metaQuery, [
      product,
      title,
      category,
      geography,
      frequency,
      timePeriod,
      dataSource,
      description,
      lastUpdateDate,
      futureRelease,
      basePeriod,
      keystatistics,
      NMDS,
      nmdslink,
      remarks,
    ]);
    const result = await pooladmin.query(
      `SELECT * FROM metadata where product=$1`,
      [product]
    );
    if (result.rows.length == 0) {
      return {
        error: true,
        errorCode: 400,
        errorMessage: `Error in creating metadata`,
      };
    }
    return result.rows[0];
  } catch (error) {
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Error in createMetadatadb ${error}`,
    };
  }
}

/**
 *
 * -----------Get product ------------
 *
 */

async function getProuductdb(productId) {
  const getQuery = `SELECT * FROM product WHERE id = $1`;
  const productResult = await pooladmin.query(getQuery, [productId]);
  console.log(productId);
  console.log(productResult);
  if (productResult.rows.length === 0) {
    return {
      error: true,
      errorCode: 400,
      errorMessage: `Unable to fetch data from ProductTable`,
    };
  }
  const getQueryCategory = `SELECT category FROM producttheme WHERE "productId" = $1`;
  const categoriesResult = await pooladmin.query(getQueryCategory, [productId]);
  const product = productResult.rows[0];
  const categories = categoriesResult.rows.map((row) => row.category);
  product["category"] = categories;
  return product;
}

/*
 * -----------Get MetaData------------
 */

async function getMetaDatadb(product) {
  const getQuery = `SELECT * FROM  metadata where product=$1`;
  const data = await pooladmin.query(getQuery, [product]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from metaTable`,
    };
  }
  return data.rows[0];
}

/**
 *
 * ---------------Get Theme--------------
 *
 */

async function getThemedb(category) {
  const getQuery = `SELECT * FROM theme where category=$1`;
  const data = await pooladmin.query(getQuery, [category]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from theme Table`,
    };
  }
  return data.rows[0];
}
/**
 *
 * ---------------Update product Domain--------------
 *
 */
async function updateProductDomdb(
  id,
  title,
  count,
  period,
  tooltip,
  type,
  viz,
  category
) {
  try {
    await pooladmin.query("BEGIN");

    // Update product details
    const productQuery = `UPDATE product SET 
          title = $1, 
          count = $2, 
          period = $3, 
          tooltip = $4, 
          type = $5, 
          viz = $6 
          WHERE id = $7`;
    await pooladmin.query(productQuery, [
      title,
      count,
      period,
      tooltip,
      type,
      viz,
      id,
    ]);

    // Handle categories
    const categories = category.split(",").map((cat) => cat.trim());
    const existingCategories = await pooladmin.query(
      `SELECT category FROM producttheme WHERE "productId" = $1`,
      [id]
    );
    const existingCategoryList = existingCategories.rows.map(
      (row) => row.category
    );

    // Add new categories
    for (const cat of categories) {
      if (!existingCategoryList.includes(cat)) {
        const categoryExistsQuery = `SELECT 1 FROM theme WHERE category = $1`;
        const categoryExistsResult = await pooladmin.query(
          categoryExistsQuery,
          [cat]
        );

        if (categoryExistsResult.rows.length === 0) {
          return {
            error: true,
            errorCode: 402,
            errorMessage: `Category '${cat}' not found in theme table`,
          };
        }
        const productThemeQuery = `INSERT INTO producttheme("productId", category) VALUES($1, $2)`;
        await pooladmin.query(productThemeQuery, [id, cat]);
      }
    }

    const getQuery = `SELECT * FROM product WHERE id = $1`;
    const productResult = await pooladmin.query(getQuery, [id]);
    if (productResult.rows.length === 0) {
      return {
        error: true,
        errorCode: 402,
        errorMessage: `Unable to fetch data from ProductTable`,
      };
    }

    const getQueryCategory = `SELECT category FROM producttheme WHERE "productId" = $1`;
    const categoriesResult = await pooladmin.query(getQueryCategory, [id]);
    const product = productResult.rows[0];
    const Allcategory = categoriesResult.rows.map((row) => row.category);
    product["category"] = Allcategory;

    await pooladmin.query("COMMIT");
    return product;
  } catch (error) {
    await pooladmin.query("ROLLBACK");
    return {
      error: true,
      errorCode: 402,
      errorMessage: error,
    };
  }
}

/**
 * --------------------Update Product Developer ------------------
 */

async function updateProductDevdb(
  id,
  title,
  count,
  icon,
  period,
  tooltip,
  type,
  url,
  tables,
  swagger,
  viz,
  category
) {
  try {
    await pooladmin.query("BEGIN");

    // Update product details
    const productQuery = `UPDATE product SET 
            title = $1, 
            count = $2, 
            icon = $3, 
            period = $4, 
            tooltip = $5, 
            type = $6, 
            url = $7, 
            tables = $8, 
            swagger = $9, 
            viz = $10 
            WHERE id = $11`;

    await pooladmin.query(productQuery, [
      title,
      count,
      icon,
      period,
      tooltip,
      type,
      url,
      tables,
      swagger,
      viz,
      id,
    ]);

    // Handle categories
    const categories = category.split(",").map((cat) => cat.trim());
    const existingCategories = await pooladmin.query(
      `SELECT category FROM producttheme WHERE "productId" = $1`,
      [id]
    );
    const existingCategoryList = existingCategories.rows.map(
      (row) => row.category
    );

    // Add new categories
    for (const cat of categories) {
      if (!existingCategoryList.includes(cat)) {
        const categoryExistsQuery = `SELECT 1 FROM theme WHERE category = $1`;
        const categoryExistsResult = await pooladmin.query(
          categoryExistsQuery,
          [cat]
        );

        if (categoryExistsResult.rows.length === 0) {
          return {
            error: true,
            errorCode: 402,
            errorMessage: `Category '${cat}' not found in theme table`,
          };
        }
        const productThemeQuery = `INSERT INTO producttheme("productId", category) VALUES($1, $2)`;
        await pooladmin.query(productThemeQuery, [id, cat]);
      }
    }
    const getQuery = `SELECT * FROM product WHERE id = $1`;
    const productResult = await pooladmin.query(getQuery, [id]);
    if (productResult.rows.length === 0) {
      return {
        error: true,
        errorCode: 402,
        errorMessage: `Unable to fetch data from ProductTable`,
      };
    }

    const getQueryCategory = `SELECT category FROM producttheme WHERE "productId" = $1`;
    const categoriesResult = await pooladmin.query(getQueryCategory, [id]);
    const product = productResult.rows[0];
    const Allcategory = categoriesResult.rows.map((row) => row.category);
    product["category"] = Allcategory;

    await pooladmin.query("COMMIT");
    return product;
  } catch (error) {
    await pooladmin.query("ROLLBACK");
  }
}

/**
 * 
 * ---------Update Theme 
 * 
 */

async function updateThemedb(name, category) {
  const updateQuery = `UPDATE theme SET name=$1 where category=$2 `;
  await pooladmin.query(updateQuery, [name, category]);
  const getQuery = `SELECT * FROM theme where category=$1`;
  const data = await pooladmin.query(getQuery, [category]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from theme Table`,
    };
  }
  return data.rows[0];
}

/*
*
*---------Update Metadata Domain------------
*
*/

async function updateMetadataDomdb(
  title,
  category,
  geography,
  frequency,
  timePeriod,
  dataSource,
  description,
  lastUpdateDate,
  futureRelease,
  basePeriod,
  keystatistics,
  NMDS,

  remarks,
  product
) {
  const metaQuery = `
    UPDATE metadata
    SET title = $1,
        category = $2,            
        geography = $3,
        frequency = $4,
        "timePeriod" = $5,
        "dataSource" = $6,
        description = $7,
        "lastUpdateDate" = $8,
        "futureRelease" = $9,
        "basePeriod" = $10,
        keystatistics = $11,
        "NMDS" = $12,
        remarks = $13
    WHERE product = $14
  `;
  const result = await pooladmin.query(metaQuery, [
    title,
    category,
    geography,
    frequency,
    timePeriod,
    dataSource,
    description,
    lastUpdateDate,
    futureRelease,
    basePeriod,
    keystatistics,
    NMDS,

    remarks,
    product,
  ]);

  if (result.rowCount === 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `metadata not found for the given product`,
    };
  }

  const updatedResult = await pooladmin.query(
    `SELECT * FROM metadata WHERE product = $1`,
    [product]
  );
  return updatedResult.rows[0];
}

/**
 * 
 * -----------Update Metadata Developer-------------
 * 
 */

async function updateMetadataDevdb(
  title,
  category,
  geography,
  frequency,
  timePeriod,
  dataSource,
  description,
  lastUpdateDate,
  futureRelease,
  basePeriod,
  keystatistics,
  NMDS,
  nmdslink,
  remarks,
  product
) {
  // Update metadata record
  const metaQuery = `
       UPDATE metadata
       SET title = $1,
           category = $2,            
           geography = $3,
           frequency = $4,
           "timePeriod" = $5,
           "dataSource" = $6,
           description = $7,
           "lastUpdateDate" = $8,
           "futureRelease" = $9,
           "basePeriod" = $10,
           keystatistics = $11,
           "NMDS" = $12,
           nmdslink = $13,
           remarks = $14
       WHERE product = $15
     `;
  const result = await pooladmin.query(metaQuery, [
    title,
    category,
    geography,
    frequency,
    timePeriod,
    dataSource,
    description,
    lastUpdateDate,
    futureRelease,
    basePeriod,
    keystatistics,
    NMDS,
    nmdslink,
    remarks,
    product,
  ]);

  if (result.rowCount === 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `no metadata to found`,
    };
  }

  const updatedResult = await pooladmin.query(
    `SELECT * FROM metadata WHERE product = $1`,
    [product]
  );
  return updatedResult.rows[0];
}
/***
 * 
 * -----------delete Product-----------
 * 
 */
async function deleteProductdb(id) {
  const productQuery = `DELETE FROM product  WHERE id=$1;`;
  const metaDataQuery = `DELETE FROM metadata  WHERE product=$1;`;
  const CategoryQuery = `DELETE FROM producttheme  WHERE "productId"=$1;`;
  await pooladmin.query(metaDataQuery, [id]);
  await pooladmin.query(CategoryQuery, [id]);
  await pooladmin.query(productQuery, [id]);
}

/***
 * 
 * ------Delete MetaData -------------
 * 
 */

async function deleteMetadatadb(product) {
  const metaDataQuery = `DELETE FROM metadata  WHERE product=$1;`;
  await pooladmin.query(metaDataQuery, [product]);
}

/***
 * 
 * ------Delete Theme -------------
 * 
 */
async function deleteThemedb(category) {
  try {
    await pooladmin.query("BEGIN");
    // Get associated products
    const getProductsQuery = `SELECT "productId" FROM producttheme WHERE category = $1`;
    const productsResult = await pooladmin.query(getProductsQuery, [category]);
    const productIds = productsResult.rows.map((row) => row.productId);
    // Remove associated entries from producttheme
    const deleteProductThemeQuery = `DELETE FROM producttheme WHERE category = $1`;
    await pooladmin.query(deleteProductThemeQuery, [category]);
    // Remove associated entries from metadata
    const deleteMetaDataQuery = `DELETE FROM metadata WHERE category = $1`;
    await pooladmin.query(deleteMetaDataQuery, [category]);

    // Remove products if they are not associated with any other category
    if (productIds.length > 0) {
      const checkProductCategoryQuery = `
              SELECT p.id FROM product p
              LEFT JOIN producttheme pt ON p.id = pt."productId"
              WHERE p.id = ANY($1::varchar[]) AND pt."productId" IS NULL
            `;

      const remainingProductsResult = await pooladmin.query(
        checkProductCategoryQuery,
        [productIds]
      );
      const remainingProductIds = remainingProductsResult.rows.map(
        (row) => row.id
      );
      if (remainingProductIds.length > 0) {
        const deleteProductQuery = `DELETE FROM product WHERE id = ANY($1::varchar[])`;
        await pooladmin.query(deleteProductQuery, [remainingProductIds]);
      }
    }

    // Remove the theme itself
    const deleteThemeQuery = `DELETE FROM theme WHERE category = $1`;
    await pooladmin.query(deleteThemeQuery, [category]);

    await pooladmin.query("COMMIT");
  } catch (error) {
    await pooladmin.query("ROLLBACK");
  }
}


module.exports = {
  EmailValidation,
  deleteThemedb,
  deleteMetadatadb,
  deleteProductdb,
  updateMetadataDevdb,
  updateMetadataDomdb,
  updateThemedb,
  updateProductDevdb,
  updateProductDomdb,
  getThemedb,
  getMetaDatadb,
  getProuductdb,
  createMetadatadb,
  createThemedb,
  createProductdb,
};
