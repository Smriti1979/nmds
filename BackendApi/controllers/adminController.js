
const { generateAccessToken } = require("../helper_utils/genrateAccessToken");
const bcrypt = require("bcrypt");
const admindb = require("../DbQuery/dbOperationAdmin");
const {
  EmailValidation,
  createProductdb,
  createThemedb,
  getProuductdb,
  getMetaDatadb,
  getThemedb,
  updateProductDevdb,
  updateProductDomdb,
  updateThemedb,
  updateMetadataDomdb,
  deleteThemedb,
  updateMetadataDevdb,
  deleteProductdb,
  deleteMetadatadb,
} = admindb;

/**
 * Sign In
 */
const signInAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const UserssDetail = await EmailValidation(email);
    if (UserssDetail?.error == true) {
      res.status(403).json({ error: `User does not exist` });
    }
    const correctpassword = await bcrypt.compare(
      password,
      UserssDetail.password
    );
    if (!correctpassword) {
      res.status(403).json({ error: `Required correct password` });
    }

    const adminAccessToken = generateAccessToken({
      email: email,
      id: UserssDetail.id,
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    };

    res.cookie("adminAccessToken", adminAccessToken, cookieOptions);
    res.status(200).send({
      data: {
        eamil: email,
      },
      msg: "UserVerfied",
      statusCode: true,
    });
  } catch (error) {
    res.status(500).json({ error: `Error in signIn User ${error}` });
  }
};

/**
 * Create Product
 */
const createProduct = async (req, res) => {
  const {
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
    category,
  } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      res.status(405).json({ error: `Only developer can create the product` });
    }
    const categories = await createProductdb(
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
      category,
      res
    );
    if (categories?.error == true) {
      throw categories?.errorMessage;
    }

    res.status(200).send({
      data: {
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
        category: categories,
      },
      msg: "Product created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Error in Creating Product: ${error.message}` });
  }
};
/**
 * -----Create theme ------
 *
 */

const createTheme = async (req, res) => {
  const { category, name } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      res.status(405).json({ error: `Only developer can create the Theme}` });
    }

    const result = await createThemedb(category, name);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    res.status(200).send({
      data: result,
      msg: "Theme created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Error in Creating Theme: ${error.message}` });
  }
};

/**
 * Metadata
 */
const createMetadata = async (req, res) => {
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
      res.status(405).json({ error: `Only developer can create the MetaData` });
    }


    const result = await createThemedb(
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
      remarks
    );

    if (result?.error == true) {
      throw result?.errorMessage;
    }

    res.status(200).send({
      data: result,
      msg: "Meata data create successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: `Error in Creating Metadata: ${error.message}}` });
  }
};
/*
Get Product 
*/
const getProuduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ error: `productID is required` });
  }
  try {
    const product = await getProuductdb(productId);

    if (product?.error == true) {
      throw product?.errorMessage;
    }
    res.status(200).send({
      data: product,
      msg: "Product data",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error.message}` });
  }
};

/**
 * MetaData
 */

const getMetaData = async (req, res) => {
  const { Product } = req.params;
  if (Product == undefined) {
    res.status(400).json({ error: `productID is required` });
  }
  try {
    const metaData = await getMetaDatadb(Product);
    if (metaData?.error == true) {
      throw metaData?.errorMessage;
    }
    res.status(200).send({
      data: metaData,
      msg: "Product data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: `Unable to fetch data Error=${error}` });
  }
};

const getTheme = async (req, res) => {
  const { category } = req.params;
  if (category == undefined) {
    res.status(400).json({ error: `category is required` });
  }
  try {
    const theme = await getThemedb(category);

    if (theme?.error == true) {
      throw theme?.errorMessage;
    }

    res.status(200).send({
      data: theme,
      msg: "Theme data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Unable to get theme ${error}` });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
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
    category,
  } = req.body;
  try {
    const user = req.user;
    if (!user.developer) {
      const product = await updateProductDomdb(
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
      );

      if (product?.error == true) {
        throw product?.errorMessage;
      }

      res.status(200).send({
        data: product,
        msg: "Product updated successfully",
        statusCode: true,
      });
    }

    const product = await updateProductDevdb(
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
    );
    
    if (product?.error == true) {
      throw product?.errorMessage;
    }

    res.status(200).send({
      data: product,
      msg: "Product updated successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error in Updating Product ${error}` });
  }
};
const updateTheme = async (req, res) => {
  const { category } = req.params;
  const { name } = req.body;
  if (name == "" || name == null || name == undefined) {
    res.status(405).json({ error: `category,name are required` });
  }
  if (category == null || category == undefined || category == "") {
    res.status(405).json({ error: `Category is undefined` });
  }
  try {
    const user = req.user;
    if (!user.developer) {
      res.status(405).json({ error: `Only developer can edit the theme` });
    }
    const theme = await updateThemedb(name, category);
    if (theme?.error == true) {
      throw theme?.errorMessage;
    }

    res.status(200).send({
      data: theme,
      msg: "Theme updated successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: `Error in Updating Theme data: ${error}` });
  }
};

const updatedMetadata = async (req, res) => {
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
    res.status(400).json({ error: `All filed are required` });
  }
  try {
    const user = req.user;
    if (!user.developer) {
      const result = await updateMetadataDomdb(
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
        Product
      );
      if (result?.error == true) {
        throw result?.errorMessage;
      }
      res.status(200).send({
        data: result,
        msg: "MetaData updated successfully",
        statusCode: true,
      });
    }
    const result = await updateMetadataDevdb(
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
      Product
    );
    if (result?.error == true) {
      throw result?.errorMessage;
    }

    res.status(200).send({
      data: result,
      msg: "MetaData updated successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: `Error in Updating MetaData: ${error.message}` });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (id == null || id == undefined || id == "") {
    res.status(405).json({ error: `id in invalid` });
  }

  try {
    const user = req.user;
    if (!user.developer) {
      res.status(405).json({ error: `Only developer can delete` });
    }
    const result =await deleteProductdb(id);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    res.status(200).send({
      data: [],
      msg: "product deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({ error: `unable to delete the product ${error}` });
  }
};

const deleteMetadata = async (req, res) => {
  const { Product } = req.params;
  if (Product == null || Product == undefined || Product == "") {
    res.status(400).json({ error: `Product not define ` });
  }
  const user = req.user;
  if (!user.developer) {
    res.status(400).json({ error: `Only developer can delete` });
  }
  try {
    const result=await deleteMetadatadb(Product);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    res.status(200).send({
      data: [],
      msg: "metaData deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: `unable to delete the MetaData ${error}` });
  }
};

const deleteTheme = async (req, res) => {
  const { category } = req.params;
  if (!category) {
    res.status(405).json({ error: `Category is invalid` });
  }
  const user = req.user;
  if (!user.developer) {
    res.status(405).json({ error: `Only developer can delete` });
  }

  try {
    const result=await deleteThemedb(category);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    res
      .status(200)
      .json({ message: "Theme and associated data successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Unable to delete the theme: ${error.message}` });
  }
};

module.exports = {
  getMetaData,
  getTheme,
  updateProduct,
  updateTheme,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteTheme,
  getProuduct,
  createMetadata,
  createTheme,
  createProduct,
  signInAdmin,
};