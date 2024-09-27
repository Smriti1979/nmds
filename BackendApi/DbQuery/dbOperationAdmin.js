/** @format */

const db = require("../models/index.js");
const { Pool } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
// DB connection for ASI
const pooladmin = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASETPM,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
});


async function  createUserdb(username,password,title,name,email,phno,address){
  const hashedPassword = await bcrypt.hash(password, 10);
  const query='INSERT INTO adminusers(username,password,title,name,email,phno,address,"createdDate") VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
  console.log("hello") 
  await pooladmin.query(query, [username,hashedPassword,title,name,email,phno,address,new Date()]);

 const user=await pooladmin.query(`SELECT username,title,name,email,phno,address,"createdDate"  FROM adminusers where username=$1`,[username])
 if (user.rows.length === 0) {
  return {
    error: true,
    errorCode: 405,
    errorMessage: `unable to create user`,
  };
}
 return user.rows[0];
}
async function  getUserdb(){
 const user=await pooladmin.query(`SELECT username,title,name,email,phno,address,"createdDate"  FROM adminusers `)
if (user.rows.length === 0) {
  return {
    error: true,
    errorCode: 405,
    errorMessage: `unable to get user`,
  };
}
 return user.rows;
}
async function getUserByUsernameDb(username) {
  const user = await pooladmin.query(
    `SELECT username, title, name, email, phno, address, "createdDate" FROM adminusers WHERE username = $1`,
    [username]
  );
  if (user.rows.length === 0) {
    return {
      error: true,
      errorCode: 404,
      errorMessage: `User not found`,
    };
  }
  return user.rows[0];
}
async function deleteUserDb(username) {
  const query = `DELETE FROM adminusers WHERE username = $1 RETURNING *`;
  const user = await pooladmin.query(query, [username]);

  if (user.rows.length === 0) {
    return {
      error: true,
      errorCode: 404,
      errorMessage: `User not found`,
    };
  }
  return user.rows[0];
}
async function updateUserDb(username, title, name, email, phno, address, password) {
  let hashedPassword;
  
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10); // Hash the new password if provided
  }

  const query = `UPDATE adminusers SET 
                  title = $1, 
                  name = $2, 
                  email = $3, 
                  phno = $4, 
                  address = $5,
                  password = COALESCE($6, password) -- Only update password if a new one is provided
                WHERE username = $7 
                RETURNING *`;

  const user = await pooladmin.query(query, [
    title, name, email, phno, address, hashedPassword, username
  ]);

  if (user.rows.length === 0) {
    return {
      error: true,
      errorCode: 404,
      errorMessage: `User not found`,
    };
  }
  return user.rows[0];
}

/**
 * --------Admin validation-----------
 *
 */

async function EmailValidation(username) {
  const query = "SELECT * FROM adminusers WHERE username = $1";
  const result = await pooladmin.query(query, [username]);
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
  table,
  swagger,
  viz,
  category,
  authorId
) {
  try {
    await pooladmin.query("BEGIN");

    const productQuery = `INSERT INTO product(id, title, count, icon, period, tooltip, type, url, "table", swagger, viz,"authorId","createdDate") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13)`;
    await pooladmin.query(productQuery, [
      id,
      title,
      count,
      icon,
      period,
      tooltip,
      type,
      url,
      table,
      swagger,
      viz,
      authorId,
      new Date()
    ]);

    const categories = category.split(",").map((cat) => cat.trim());

    for (const cat of categories) {
      const categoryExistsQuery = `SELECT 1 FROM agency WHERE category = $1`;
      const categoryExistsResult = await pooladmin.query(categoryExistsQuery, [
        cat,
      ]);

      if (categoryExistsResult.rows.length === 0) {
        return {
          error: true,
          errorCode: 405,
          errorMessage: `Category '${cat}' not found in agency table`,
        };
      }

      const productagencyQuery = `INSERT INTO productagency("productId", category) VALUES($1, $2)`;
      await pooladmin.query(productagencyQuery, [id, cat]);
    }

    await pooladmin.query("COMMIT");
    return categories;
  } catch (error) {
    await pooladmin.query("ROLLBACK");
    console.error(error);
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Problem in db unable to create product: ${error}`,
    };
  }
}
/**
 * create agency
 */
async function createagencydb(category, name) {
  try {
    const sqlQuery = `INSERT INTO agency(category,name,"createdDate") VALUES($1,$2,$3)`;
    await pooladmin.query(sqlQuery, [category, name,new Date()]);
    const result = await pooladmin.query(
      "SELECT * FROM agency WHERE category=$1",
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
      errorMessage: `Problem in db unable to create agency`,
    };
  }
}
/**
 * Metadata
 */
async function createMetadatadb({ Product, data, user_id, version, latest }) {
  try {
    const metaQuery = `INSERT INTO metadata("Product", data, user_id, version, latest,"createdDate") 
                       VALUES($1, $2, $3, $4, $5,$6)`;

    await pooladmin.query(metaQuery, [
      Product,

      data, 
      user_id,
      version,
      latest,
      new Date()
    ]);

    const result = await pooladmin.query(
      `SELECT * FROM metadata WHERE "Product"=$1 AND latest=true`,
      [Product]
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
      errorMessage: `Error in createMetadatadb: ${error}`,
    };
  }
}

/**
 *
 * -----------Get product ------------
 *
 */
async function getProductdb() {
  try {
    const getQuery = `SELECT * FROM product`;
    const productResult = await pooladmin.query(getQuery);
    if (productResult.rows.length === 0) {
      return {
        error: true,
        errorCode: 400,
        errorMessage: `Unable to fetch data from ProductTable`,
      };
    }
    return productResult.rows;
  } catch (error) {
    return {
      error: true,
      errorCode: 400,
      errorMessage: `Unable to fetch data from ProductTable=${error}`,
    };
  }
}


async function getProductByIddb(productId) {
  try {
    const getQuery = `SELECT * FROM product WHERE id = $1`;
    const productResult = await pooladmin.query(getQuery, [productId]);
    if (productResult.rows.length === 0) {
      return {
        error: true,
        errorCode: 400,
        errorMessage: `Unable to fetch data from ProductTable`,
      };
    }
    const getQueryCategory = `SELECT category FROM productagency WHERE "productId" = $1`;
    const categoriesResult = await pooladmin.query(getQueryCategory, [
      productId,
    ]);
    const product = productResult.rows[0];
    const categories = categoriesResult.rows.map((row) => row.category);
    product["category"] = categories;
    return product;
  } catch (error) {
    return {
      error: true,
      errorCode: 400,
      errorMessage: `Unable to fetch data from ProductTable=${error}`,
    };
  }
}



/*
 * -----------Get MetaData------------
 */
async function getMetaDatadb() {
  try {
    const getQuery = `SELECT * FROM  metadata  where latest=true ORDER BY "createdDate" DESC`;
    const data = await pooladmin.query(getQuery);
    if (data.rows.length == 0) {
      return {
        error: true,
        errorCode: 402,
        errorMessage: `Unable to fetch data from metaTable`,
      };
    }
    return data.rows;
  } catch (error) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from metaTable=${error}`,
    };
  }
}
async function getMetaDataByIddb(Product) {
  const getQuery = `SELECT * FROM  metadata where "Product"=$1  AND  latest=true`;
  const data = await pooladmin.query(getQuery, [Product]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from metaTable`,
    };
  }
  return data.rows[0];
}
async function searchMetaDatadb(searchParams) {
  try {
  
    let getQuery = 'SELECT * FROM metadata WHERE true';
    
    // Dynamically add conditions for regular table fields
    if (searchParams.version) {
      getQuery += ` AND version = ${searchParams.version}`;
    }
    if (searchParams.Product) {
      getQuery += ` AND "Product" = '${searchParams.Product}'`;
    }
    if (searchParams.latest) {
      getQuery += ` AND latest = ${searchParams.latest}`;
    }
    if (searchParams.user_id) {
      getQuery += ` AND user_id = ${searchParams.user_id}`;
    }
    Object.keys(searchParams).forEach((key) => {
      if (!['version', 'Product', 'latest', 'user_id'].includes(key)) {
        getQuery += ` AND data->>'${key}' ILIKE '%${searchParams[key]}%'`;
      }
    });
    getQuery += ' ORDER BY "createdDate" DESC';
    
    const data = await pooladmin.query(getQuery);

    if (data.rows.length === 0) {
      return {
        error: true,
        errorCode: 402,
        errorMessage: `No metadata found`,
      };
    }

    return data.rows;
  } catch (error) {
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Error fetching metadata: ${error}`,
    };
  }
}


async function  getMetaDataByVersionP(product) {
  const getQuery=`SELECT * FROM metadata where "Product"=$1`;
  const data = await pooladmin.query(getQuery, [product]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from metaTable`,
    };
  }
  return data.rows;
}

async function  getMetaDataByVersionPV(product,version) {
  const getQuery=`SELECT * FROM metadata where "Product"=$1 AND version=$2`;
  const data = await pooladmin.query(getQuery, [product,version]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from metaTable`,
    };
  }
  return data.rows;
}


/**
 *
 * ---------------Get agency--------------
 *
 */
async function getagencydb() {
  try {
    const getQuery = `SELECT * FROM agency `;
    const data = await pooladmin.query(getQuery);
    if (data.rows.length == 0) {
      return {
        error: true,
        errorCode: 402,
        errorMessage: `Unable to fetch data from agency Table`,
      };
    }
    return data.rows;
  } catch (error) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from agency=${error}`,
    };
  }
}

async function getagencyByIddb(category) {
  const getQuery = `SELECT * FROM agency where category=$1`;
  const data = await pooladmin.query(getQuery, [category]);
  console.log(category)
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from agency Table`,
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
      `SELECT category FROM productagency WHERE "productId" = $1`,
      [id]
    );
    const existingCategoryList = existingCategories.rows.map(
      (row) => row.category
    );

    // Add new categories
    for (const cat of categories) {
      if (!existingCategoryList.includes(cat)) {
        const categoryExistsQuery = `SELECT 1 FROM agency WHERE category = $1`;
        const categoryExistsResult = await pooladmin.query(
          categoryExistsQuery,
          [cat]
        );

        if (categoryExistsResult.rows.length === 0) {
          return {
            error: true,
            errorCode: 402,
            errorMessage: `Category '${cat}' not found in agency table`,
          };
        }
        const productagencyQuery = `INSERT INTO productagency("productId", category) VALUES($1, $2)`;
        await pooladmin.query(productagencyQuery, [id, cat]);
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

    const getQueryCategory = `SELECT category FROM productagency WHERE "productId" = $1`;
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
 * --------------------Update Product admin ------------------
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
  table,
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
            "table" = $8, 
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
      table,
      swagger,
      viz,
      id,
    ]);

    // Handle categories
    const categories = category.split(",").map((cat) => cat.trim());
    const existingCategories = await pooladmin.query(
      `SELECT category FROM productagency WHERE "productId" = $1`,
      [id]
    );
    const existingCategoryList = existingCategories.rows.map(
      (row) => row.category
    );

    // Add new categories
    for (const cat of categories) {
      if (!existingCategoryList.includes(cat)) {
        const categoryExistsQuery = `SELECT 1 FROM agency WHERE category = $1`;
        const categoryExistsResult = await pooladmin.query(
          categoryExistsQuery,
          [cat]
        );

        if (categoryExistsResult.rows.length === 0) {
          return {
            error: true,
            errorCode: 402,
            errorMessage: `Category '${cat}' not found in agency table`,
          };
        }
        const productagencyQuery = `INSERT INTO productagency("productId", category) VALUES($1, $2)`;
        await pooladmin.query(productagencyQuery, [id, cat]);
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

    const getQueryCategory = `SELECT category FROM productagency WHERE "productId" = $1`;
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
 * ---------Update agency
 *
 */

async function updateagencydb(name, category) {
  const updateQuery = `UPDATE agency SET name=$1 where category=$2 `;
  await pooladmin.query(updateQuery, [name, category]);
  const getQuery = `SELECT * FROM agency where category=$1`;
  const data = await pooladmin.query(getQuery, [category]);
  if (data.rows.length == 0) {
    return {
      error: true,
      errorCode: 402,
      errorMessage: `Unable to fetch data from agency Table`,
    };
  }
  return data.rows[0];
}

/*
 *
 *---------Update Metadata Domain------------
 *
 */

async function updateMetadatadb(
  Product,
  metadata,
  user_id
) {

  try {
    await pooladmin.query("BEGIN");
    const getQuery=`SELECT * FROM metadata where latest=true AND "Product"=$1`
    const data=await pooladmin.query(getQuery,[Product])
    if(data.rowCount==0){
      return {
        error: true,
        errorCode: 400,
        errorMessage: `Error in getting metadata`,
      };
    }
    const {version}=data.rows[0];
    const newVersion=version+1;
    await pooladmin.query(`Update metadata SET latest=$1 where "Product"=$2 ANd version=$3 `,[false,Product,version])
    const metaQuery = `INSERT INTO metadata("Product",data,version,latest,user_id,"createdDate") VALUES($1,$2,$3,$4,$5,$6)`;

    await pooladmin.query(metaQuery, [
      Product,
      metadata,
      newVersion,
      true,
      user_id,
      new Date()
    ]);
    const result = await pooladmin.query(
      `SELECT * FROM metadata where "version"=$1 And "Product"=$2`,
      [newVersion,Product]
    );
    if (result.rows.length == 0) {
      return {
        error: true,
        errorCode: 400,
        errorMessage: `Error in update metadata`,
      };
    }
    await pooladmin.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await pooladmin.query("ROLLBACK");
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Error in createMetadatadb ${error}`,
    };
  }
}





/***
 *
 * -----------delete Product-----------
 *
 */
async function deleteProductdb(id) {
  try {
    const productQuery = `DELETE FROM product  WHERE id=$1;`;
    const metaDataQuery = `DELETE FROM metadata  WHERE "Product"=$1;`;
    const CategoryQuery = `DELETE FROM productagency  WHERE "productId"=$1;`;
    await pooladmin.query(metaDataQuery, [id]);
    await pooladmin.query(CategoryQuery, [id]);
    await pooladmin.query(productQuery, [id]);
  } catch (error) {
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Error deleting product: ${error}`,
    };
  }
}

/***
 *
 * ------Delete MetaData -------------
 *
 */

async function deleteMetadatadb(Product) {
 try {
   const metaDataQuery = `DELETE FROM metadata  WHERE "Product"=$1;`;
   await pooladmin.query(metaDataQuery, [Product]);
 } catch (error) {
  return {
    error: true,
    errorCode: 500,
    errorMessage: `Error deleting MetaData: ${error}`,
  };
 }
}

/***
 *
 * ------Delete agency -------------
 *
 */
async function deleteagencydb(category) {
  try {
    // Start a transaction
    await pooladmin.query("BEGIN");

    // Get associated products from the productagency table
    const getProductsQuery = `SELECT "productId" FROM productagency WHERE category = $1`;
    const productsResult = await pooladmin.query(getProductsQuery, [category]);
    const productIds = productsResult.rows.map((row) => row.productId);

    // Remove associated entries from the productagency table
    const deleteProductagencyQuery = `DELETE FROM productagency WHERE category = $1`;
    await pooladmin.query(deleteProductagencyQuery, [category]);

    if (productIds.length > 0) {
      await pooladmin.query("ROLLBACK");
      return {
        error: true,
        errorCode: 500,
        errorMessage: `Error deleting agency Product already exist`,
      };
    }

    // Finally, remove the agency itself
    const deleteagencyQuery = `DELETE FROM agency WHERE category = $1`;
    await pooladmin.query(deleteagencyQuery, [category]);

    // Commit the transaction
    await pooladmin.query("COMMIT");

    return {
      success: true,
      message: `agency and associated products deleted successfully.`,
    };
  } catch (error) {
    // Rollback transaction in case of an error
    await pooladmin.query("ROLLBACK");
    return {
      error: true,
      errorCode: 500,
      errorMessage: `Error deleting agency: ${error}`,
    };
  }
}






module.exports = {
  EmailValidation,
  deleteagencydb,
  deleteMetadatadb,
  deleteProductdb,
  // updateMetadataDevdb,
  // updateMetadataDomdb,
  updateMetadatadb,
  getMetaDataByVersionP,
  getMetaDataByVersionPV,
  updateagencydb,
  updateProductDevdb,
  updateProductDomdb,
  getagencyByIddb,
  getMetaDataByIddb,
  getProductByIddb,
  createMetadatadb,
  createagencydb,
  createProductdb,
  getMetaDatadb,
  getagencydb,
  getProductdb,
  searchMetaDatadb,
  createUserdb,
  getUserdb,
  getUserByUsernameDb,
  deleteUserDb,
  updateUserDb
};
