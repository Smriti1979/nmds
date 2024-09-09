/** @format */

import { pool } from "../../db/index.js";

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
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
      await pool.query("BEGIN");

      // Update product details
      const productQuery = `UPDATE product SET 
            title = $1, 
            count = $2, 
            period = $3, 
            tooltip = $4, 
            type = $5, 
            viz = $6 
            WHERE id = $7`;
      await pool.query(productQuery, [
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
      const existingCategories = await pool.query(
        `SELECT category FROM ProductTheme WHERE productId = $1`,
        [id]
      );
      const existingCategoryList = existingCategories.rows.map(
        (row) => row.category
      );

      // Add new categories
      for (const cat of categories) {
        if (!existingCategoryList.includes(cat)) {
          const categoryExistsQuery = `SELECT 1 FROM Theme WHERE category = $1`;
          const categoryExistsResult = await pool.query(categoryExistsQuery, [
            cat,
          ]);

          if (categoryExistsResult.rows.length === 0) {
            return res
              .status(404)
              .json({ error: `Category '${cat}' not found in Theme table` });
          }
          const productThemeQuery = `INSERT INTO ProductTheme(productId, category) VALUES($1, $2)`;
          await pool.query(productThemeQuery, [id, cat]);
        }
      }

      const getQuery = `SELECT * FROM product WHERE id = $1`;
      const productResult = await pool.query(getQuery, [id]);
      if (productResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `Unable to fetch data from ProductTable` });
      }

      const getQueryCategory = `SELECT category FROM ProductTheme WHERE productId = $1`;
      const categoriesResult = await pool.query(getQueryCategory, [id]);
      const product = productResult.rows[0];
      const Allcategory = categoriesResult.rows.map((row) => row.category);
      product["category"] = Allcategory;

      await pool.query("COMMIT");
      return res.status(200).send({
        data: product,
        msg: "Product updated successfully",
        statusCode: true,
      });
    }
    await pool.query("BEGIN");

    // Update product details
    const productQuery = `UPDATE product SET 
        title = $1, 
        count = $2, 
        icon = $3, 
        period = $4, 
        tooltip = $5, 
        type = $6, 
        url = $7, 
        table = $8, 
        swagger = $9, 
        viz = $10 
        WHERE id = $11`;

    await pool.query(productQuery, [
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
    const existingCategories = await pool.query(
      `SELECT category FROM ProductTheme WHERE productId = $1`,
      [id]
    );
    const existingCategoryList = existingCategories.rows.map(
      (row) => row.category
    );

    // Add new categories
    for (const cat of categories) {
      if (!existingCategoryList.includes(cat)) {
        const categoryExistsQuery = `SELECT 1 FROM Theme WHERE category = $1`;
        const categoryExistsResult = await pool.query(categoryExistsQuery, [
          cat,
        ]);

        if (categoryExistsResult.rows.length === 0) {
          return res
            .status(404)
            .json({ error: `Category '${cat}' not found in Theme table` });
        }
        const productThemeQuery = `INSERT INTO ProductTheme(productId, category) VALUES($1, $2)`;
        await pool.query(productThemeQuery, [id, cat]);
      }
    }
    await pool.query("COMMIT");
    return res.status(200).send({
      data: {
        id: id,
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
      msg: "Product updated successfully",
      statusCode: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Updating Product ${error.message}` });
  }
};

export const updateTheme = async (req, res) => {
  const { category } = req.params;
  const { name } = req.body;
  if (name == "" || name == null || name == undefined) {
    return res.status(402).json({ error: `name is not define ` });
  }
  if (category == null || category == undefined || category == "") {
    return res.status(402).json({ error: `Category is undefined` });
  }
  try {
    const user = req.user;
    if (!user.developer) {
      return res
        .status(402)
        .json({ error: `Only developer can edit the theme` });
    }
    const updateQuery = `UPDATE Theme SET name=$1 `;
    await pool.query(updateQuery, [name]);
    const getQuery = `SELECT * FROM Theme where category=$1`;
    const data = await pool.query(getQuery, [category]);
    if (data.rows.length == 0) {
      return res
        .status(402)
        .json({ error: `Unable to fetch data from Theme Table` });
    }
    return res.status(200).send({
      data: data.rows[0],
      msg: "Theme data",
      statusCode: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Updating Theme data: ${error.message}` });
  }
};

export const updatedMetadata = async (req, res) => {
  const { Product } = req.params;
  const {
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
  if (
    [
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
    ].some((item) => item == null || item == undefined || item.trim() === "")
  ) {
    return res.status(403).json({
      error: ` title,category,geography,frequency,timePeriod,dataSource,description,lastUpdateDate,futureRelease,basePeriod,keystatistics,NMDS,nmdslink,remarks ALL ARE REQUIRED`,
    });
  }
  try {
    const user = req.user;
    if (!user.developer) {
      const metaQuery = `
      UPDATE MetaData
      SET title = $1,
          category = $2,            
          geography = $3,
          frequency = $4,
          timePeriod = $5,
          dataSource = $6,
          description = $7,
          lastUpdateDate = $8,
          futureRelease = $9,
          basePeriod = $10,
          keystatistics = $11,
          NMDS = $12,
          remarks = $13
      WHERE product = $14
    `;
      const result = await pool.query(metaQuery, [
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
        Product,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: `MetaData not found for the given product`,
        });
      }

      const updatedResult = await pool.query(
        `SELECT * FROM MetaData WHERE product = $1`,
        [Product]
      );
      return res.status(200).send({
        data: updatedResult.rows[0],
        msg: "MetaData updated successfully",
        statusCode: true,
      });
    }
    // Update MetaData record
    const metaQuery = `
        UPDATE MetaData
        SET title = $1,
            category = $2,            
            geography = $3,
            frequency = $4,
            timePeriod = $5,
            dataSource = $6,
            description = $7,
            lastUpdateDate = $8,
            futureRelease = $9,
            basePeriod = $10,
            keystatistics = $11,
            NMDS = $12,
            nmdslink = $13,
            remarks = $14
        WHERE product = $15
      `;
    const result = await pool.query(metaQuery, [
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
      Product,
    ]);

    if (result.rowCount === 0) {
      return res.status(403).json({
        error: `MetaData not found for the given product`,
      });
    }

    const updatedResult = await pool.query(
      `SELECT * FROM MetaData WHERE product = $1`,
      [Product]
    );

    return res.status(200).send({
      data: updatedResult.rows[0],
      msg: "Meta data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error in Updating MetaData: ${error.message}` });
  }
};
