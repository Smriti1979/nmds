/** @format */

import { pool } from "../../db/index.js";

/**
 * Create Product
 */
export const createProduct = async (req, res) => {
  const {
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
  } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      return res
        .status(405)
        .json({ error: `Only developer can create the product` });
    }
    await pool.query("BEGIN");
    const productQuery = `INSERT INTO product(id, title, count, icon, period, tooltip, type, url, table, swagger, viz) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    await pool.query(productQuery, [
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
    ]);

    const categories = category.split(",").map((cat) => cat.trim());
    for (const cat of categories) {
      const categoryExistsQuery = `SELECT 1 FROM theme WHERE category = $1`;
      const categoryExistsResult = await pool.query(categoryExistsQuery, [cat]);

      if (categoryExistsResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `Category '${cat}' not found in theme table` });
      }
      const productThemeQuery = `INSERT INTO ProductTheme(productId, category) VALUES($1, $2)`;
      await pool.query(productThemeQuery, [id, cat]);
    }

    await pool.query("COMMIT");
    return res.status(200).send({
      data: {
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
        category: categories,
      },
      msg: "Product created successfully",
      statusCode: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Creating Product:   ${error.message}` });
  }
};

/**
 * -----Create theme ------
 *
 */

export const createTheme = async (req, res) => {
  const { category, name } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      return res
        .status(405)
        .json({ error: `Only developer can create the Theme` });
    }
    if (
      [category, name].some(
        (item) => item == null || item == undefined || item.trim() === ""
      )
    ) {
      return res.status(403).json({ error: `category,name are required` });
    }
    const sqlQuery = `INSERT INTO theme(category,name) VALUES($1,$2)`;
    await pool.query(sqlQuery, [category, name]);
    const result = await pool.query("SELECT * FROM theme WHERE category=$1", [
      category,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Product not found after insertion` });
    }
    return res.status(200).send({
      data: result.rows[0],
      msg: "Product created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Creating Product:  ${error.message}` });
  }
};

/**
 * -------Create Meta data
 */

export const createMetadata = async (req, res) => {
  const {
    Product,
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
  } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      return res
        .status(405)
        .json({ error: `Only developer can create the MetaData` });
    }
    const metaQuery = `INSERT INTO MetaData(product,title,category,geography,frequency,timePeriod,dataSource,description,lastUpdateDate,futureRelease,basePeriod,keystatistics,NMDS,nmdslink,remarks) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;
    await pool.query(metaQuery, [
      Product,
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
    const result = await pool.query(`SELECT * FROM MetaData where product=$1`, [
      Product,
    ]);
    if (result.rows.length == 0) {
      return res.status(402).json({ error: `Error in creating metaData` });
    }

    return res.status(200).send({
      data: result.rows[0],
      msg: "Meata data create successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error in Creating Metadata: ${error.message}` });
  }
};
