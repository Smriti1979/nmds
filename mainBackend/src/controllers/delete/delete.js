/** @format */

import { pool } from "../../db/index.js";


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (id == null || id == undefined || id == "") {
    return res.status(403).json({
      error: "id in invalid",
    });
  }
  
  try {
    const user=req.user;
    if(!user.developer){
      return res.status(403).json({
        error: "Only developer can delete",
      });
  
    }
    const productQuery = `DELETE FROM product  WHERE id=$1;`;
    const metaDataQuery = `DELETE FROM MetaData  WHERE product=$1;`;
    const CategoryQuery = `DELETE FROM ProductTheme  WHERE productId=$1;`;
    await pool.query(metaDataQuery, [id]);
    await pool.query(CategoryQuery, [id]);
    await pool.query(productQuery, [id]);
    return res.status(200).send({
      data: [],
      msg: "product deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `unable to delete the product ${error}` });
  }
};


export const deleteMetadata =async (req, res) => {
  const { Product } = req.params;
  if (Product == null || Product == undefined || Product == "") {
    return res.status(403).json({ error: `product in invalid` });
  }
  const user=req.user;
  if(!user.developer){
    return res.status(403).json({ error: `Only developer can delete` });

  }
  try {
    const metaDataQuery = `DELETE FROM MetaData  WHERE product=$1;`;
    await pool.query(metaDataQuery, [Product]);
    return res.status(200).send({
      data: [],
      msg: "metaData deleted successfully",
      statusCode: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `unable to delete the MetaData ${error}` });

  }
};


export const deleteTheme = async (req, res) => {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ error: `Category is invalid` });
    }
    const user=req.user;
    if(!user.developer){
    
      return res.status(403).json({ error: `Only developer can delete` });
    }
    const client = await pool.connect();
    try {
    await client.query('BEGIN');
    // Get associated products
    const getProductsQuery = `SELECT productId FROM ProductTheme WHERE category = $1`;
    const productsResult = await client.query(getProductsQuery, [category]);
    const productIds = productsResult.rows.map(row => row.productId);
      // Remove associated entries from ProductTheme
      const deleteProductThemeQuery = `DELETE FROM ProductTheme WHERE category = $1`;
      await client.query(deleteProductThemeQuery, [category]);
      // Remove associated entries from MetaData
      const deleteMetaDataQuery = `DELETE FROM MetaData WHERE category = $1`;
      await client.query(deleteMetaDataQuery, [category]);
  
      // Remove products if they are not associated with any other category
      if (productIds.length > 0) {
        const checkProductCategoryQuery = `
          SELECT p.id FROM product p
          LEFT JOIN ProductTheme pt ON p.id = pt.productId
          WHERE p.id = ANY($1::varchar[]) AND pt.productId IS NULL
        `;

        const remainingProductsResult = await client.query(checkProductCategoryQuery, [productIds]);
        const remainingProductIds = remainingProductsResult.rows.map(row => row.id);
        if (remainingProductIds.length > 0) {
          const deleteProductQuery = `DELETE FROM product WHERE id = ANY($1::varchar[])`;
          await client.query(deleteProductQuery, [remainingProductIds]);
        }
      }
  
      // Remove the theme itself
      const deleteThemeQuery = `DELETE FROM Theme WHERE category = $1`;
      await client.query(deleteThemeQuery, [category]);
  
      await client.query('COMMIT');
      return res.status(200).send({
        data: [],
        msg: "Theme and associated data successfully deleted",
        statusCode: true,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      return res
      .status(500)
      .json({ error: `Unable to delete the theme: ${error.message}` });
    } finally {
      client.release();
    }
  };
