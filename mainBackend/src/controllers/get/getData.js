/** @format */

import { pool } from "../../db/index.js";

export const getProuductById = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      error: "productID is required",
    });
  }

  try {
    const getQuery = `SELECT * FROM product WHERE id = $1`;
    const productResult = await pool.query(getQuery, [productId]);
    if (productResult.rows.length === 0) {
      return res.status(400).json({
        error: "Unable to fetch data from ProductTable",
      });
    }
    const getQueryCategory = `SELECT category FROM ProductTheme WHERE productId = $1`;
    const categoriesResult = await pool.query(getQueryCategory, [productId]);
    const product = productResult.rows[0];
    const categories = categoriesResult.rows.map((row) => row.category);
    product["category"] = categories;
    return res.status(200).send({
      data: product,
      msg: "Product data",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error.message}` });
  }
};

export const getMetaDataById = async (req, res) => {
  const { Product } = req.params;
  if (Product == undefined) {
    return res.status(400).json({
      error: "productID is required",
    });
  }
  try {
    const getQuery = `SELECT * FROM  MetaData where product=$1`;
    const data = await pool.query(getQuery, [Product]);

    if (data.rows.length == 0) {
      return res.status(400).json({
        error: "Unable to fetch data from metaTable",
      });
    }
    return res.status(200).send({
      data: data.rows[0],
      msg: "Meta data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Unable to fetch data Error ${error}` });
  }
};

export const getThemeById = async (req, res) => {
  const { category } = req.params;
  if (category == undefined) {
    return res.status(400).json({
      error: "category is required",
    });
  }
  try {
    const getQuery = `SELECT * FROM Theme where category=$1`;
    const data = await pool.query(getQuery, [category]);
    if (data.rows.length == 0) {
      return res.status(400).json({
        error: "Unable to fetch data from Theme Table",
      });
    }
    return res.status(200).send({
      data: data.rows[0],
      msg: "Theme data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Unable to get theme ${error}` });
  }
};
