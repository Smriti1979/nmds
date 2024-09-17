/** @format */

const { generateAccessToken } = require("../helper_utils/genrateAccessToken");
const bcrypt = require("bcrypt");
const admindb = require("../DbQuery/dbOperationAdmin");
const {
  EmailValidation,
  createProductdb,
  createThemedb,
  getProductByIddb,
  getProuduct,
  getMetaDataByIddb,
  getThemeByIddb,
  updateProductDevdb,
  updateProductDomdb,
  updateThemedb,
  deleteThemedb,
  updateMetadatadb,
  deleteProductdb,
  deleteMetadatadb,
  getThemedb,
  createMetadatadb,
  getMetaDatadb,
} = admindb;
/**
 * Sign In
 */
const signInAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserssDetail = await EmailValidation(username);
    if (UserssDetail?.error == true) {
      return res.status(403).json({ error: `User does not exist` });
    }
    const correctpassword = await bcrypt.compare(
      password,
      UserssDetail.password
    );
    if (!correctpassword) {
      return res.status(403).json({ error: `Required correct password` });
    }

    const adminAccessToken = generateAccessToken({
      username: username,
      id: UserssDetail.id,
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    };  return res.status(200).send({
      data: {
        eamil: username,
      },
      msg: "UserVerfied",
      statusCode: true,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error in signIn User ${error}` });
  }
};

/**
 * Create product
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
    table,
    swagger,
    viz,
    category,
  } = req.body;
  try {
    const productID=id.toLowerCase()
    const user = req.user;
    if (user.title !== "admin") {
      return res
        .status(405)
        .json({ error: `Only admin can create the product` });
    }
    const categories = await createProductdb(
      productID,
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
      res
    );
    if (categories?.error == true) {
      throw categories?.errorMessage;
    }

    return res.status(201).send({
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
      msg: "product created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Creating product: ${error}` });
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
    if (user.title !== "admin") {
      return res
        .status(405)
        .json({ error: `Only admin can create the theme}` });
    }

    const result = await createThemedb(category, name);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res.status(201).send({
      data: result,
      msg: "theme created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Creating theme: ${error.message}` });
  }
};

/**
 * Metadata
 */
const createMetadata = async (req, res) => {
  const {
    Product,
    title,
    Category,
    Geography,
    Frequency,
    TimePeriod,
    DataSource,
    Description,
    lastUpdateDate,
    FutureRelease,
    BasePeriod,
    Keystatistics,
    NMDS,
    nmdslink,
    remarks,
  } = req.body;
  try {
    const user = req.user;
    if (user.title !== "admin") {
      return res
        .status(405)
        .json({ error: `Only admin can create the metadata` });
    }
    const productID=Product.toLowerCase()
    const result = await createMetadatadb(
      productID,
      title,
      Category,
      Geography,
      Frequency,
      TimePeriod,
      DataSource,
      Description,
      lastUpdateDate,
      FutureRelease,
      BasePeriod,
      Keystatistics,
      NMDS,
      nmdslink,
      remarks
    );

    if (result?.error == true) {
      throw result?.errorMessage;
    }

    return res.status(201).send({
      data: result,
      msg: "Meata data create successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Error in Creating Metadata: ${error}` });
  }
};
/*
Get product 
*/
const getProductById = async (req, res) => {
  let { productId } = req.params;
  productId=productId.toLowerCase()
  const user = req.user;
  if (user.title !== "admin" && user.title !== "domain") {
    return res
      .status(405)
      .json({ error: `Only admin can see the product` });
  }
  if (!productId) {
    return res.status(400).json({ error: `productID is required` });
  }
  try {
    const product = await getProductByIddb(productId);

    if (product?.error == true) {
      throw product?.errorMessage;
    }
    return res.status(200).send({
      data: product,
      msg: "product data",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
};
const getProduct = async (req, res) => {
  try {
    const user = req.user;
    if (user.title !== "admin" && user.title !== "domain") {
      return res
        .status(405)
        .json({ error: `Only admin can see the product` });
    }
    const product = await getProuduct();
    if (product?.error == true) {
      throw product?.errorMessage;
    }
    return res.status(200).send({
      data: product,
      msg: "product data",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
};

/**
 * metadata
 */
const getMetaData = async (req, res) => {
  try {
    const metadata = await getMetaDatadb();
    if (metadata?.error == true) {
      throw metadata?.errorMessage;
    }
    return res.status(200).send({
      data: metadata,
      msg: "product data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
};
const getMetaDataById = async (req, res) => {
  const { Product } = req.params;
  if (Product == undefined) {
    return res.status(400).json({ error: `productID is required` });
  }
  try {
    const metadata = await getMetaDataByIddb(Product);
    if (metadata?.error == true) {
      throw metadata?.errorMessage;
    }
    return res.status(200).send({
      data: metadata,
      msg: "product data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
};
/**
 *
 * ---------Get Theme---------
 *
 */
const getTheme = async (req, res) => {
  try {
    const user = req.user;
    if (user.title !== "admin" && user.title !== "domain") {
      return res
        .status(403) 
        .json({ error: "Only developers or domain users can access the theme." });
    }
    const theme = await getThemedb();

    if (theme?.error == true) {
      throw theme?.errorMessage;
    }

    return res.status(200).send({
      data: theme,
      msg: "theme data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Unable to get theme ${error}` });
  }
};
const getThemeById = async (req, res) => {
  const user = req.user;
  if (user.title !== "admin" && user.title !== "domain") {
    return res
      .status(403) 
      .json({ error: "Only developers or domain users can access the theme." });
  }
  const { category } = req.params;
  if (category == undefined) {
    return res.status(400).json({ error: `category is required` });
  }
  try {
    const theme = await getThemeByIddb(category);

    if (theme?.error == true) {
      throw theme?.errorMessage;
    }

    return res.status(200).send({
      data: theme,
      msg: "theme data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Unable to get theme ${error}` });
  }
};

/**
 *
 * --------Update Product-------------------------
 *
 */

const updateProduct = async (req, res) => {
  let  { id } = req.params;
  id=id.toLowerCase()
  const user = req.user;
  if (user.title !== "admin" && user.title !== "domain") {
    return res
      .status(405)
      .json({ error: `Only admin and domain can edit ` });
  }
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
    if (user.title == "domain") {
      const product = await updateProductDomdb(
        id,
        title,
        count,
        period,
        tooltip,
        type,
        viz,
        category
      );

      if (product?.error == true) {
        throw product?.errorMessage;
      }

      return res.status(200).send({
        data: product,
        msg: "product updated successfully",
        statusCode: true,
      });
    } else if (user.title == "admin") {
      const product = await updateProductDevdb(
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
      );

      if (product?.error == true) {
        throw product?.errorMessage;
      }

      return res.status(200).send({
        data: product,
        msg: "product updated successfully",
        statusCode: true,
      });
    } else {
      res.status(400).json({ error: `Unkown user ` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error in Updating product ${error}` });
  }
};

/**
 *
 * --------Update Theme----------------
 *
 */
const updateTheme = async (req, res) => {
  const { category } = req.params;
  const { name } = req.body;
  const user = req.user;
  if (user.title !== "admin" && user.title !== "domain") {
    return res
      .status(405)
      .json({ error: `Only admin and domain can edit ` });
  }
  if (name == "" || name == null || name == undefined) {
    return res.status(405).json({ error: `category,name are required` });
  }
  if (category == null || category == undefined || category == "") {
    return res.status(405).json({ error: `Category is undefined` });
  }
  try {
    const theme = await updateThemedb(name, category);
    if (theme?.error == true) {
      throw theme?.errorMessage;
    }

    return res.status(200).send({
      data: theme,
      msg: "theme updated successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ error: `Error in Updating theme data: ${error}` });
  }
};

/**
 *
 * ----------Update MetaData----------
 *
 */

const updatedMetadata = async (req, res) => {
  let { Product } = req.params;
  Product=Product.toLowerCase()
  const {
    title,
    Category,
    Geography,
    Frequency,
    TimePeriod,
    DataSource,
    Description,
    lastUpdateDate,
    FutureRelease,
    BasePeriod,
    Keystatistics,
    NMDS,
    nmdslink,
    remarks,
  } = req.body;

  try {
    const user = req.user;
    if(user.title=="admin" || user.title==Product || user.title=="domain"){
      const result = await updateMetadatadb(
        Product,
        title,
        Category,
        Geography,
        Frequency,
        TimePeriod,
        DataSource,
        Description,
        lastUpdateDate,
        FutureRelease,
        BasePeriod,
        Keystatistics,
        NMDS,
        nmdslink,
        remarks
      );
    if (result?.error === true) {
        throw result?.errorMessage;
      }
      return res.status(200).send({
        data: result,
        msg: "Metadata updated successfully",
        statusCode: true,
      });
    }
    else{
      return res.status(403).send({
        msg: "Invalid user",
        statusCode: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error in updating metadata: ${error.message}` });
  }
};

/**
 *
 * -------Delete Product----------
 *
 */

const deleteProduct = async (req, res) => {
  const user = req.user;
  if (user.title !== "admin") {
    return res
      .status(405)
      .json({ error: `Only admin can delete the product` });
  }
  let { id } = req.params;
  id=id.toLowerCase()
  if (id == null || id == undefined || id == "") {
    return res.status(405).json({ error: `id in invalid` });
  }

  try {
    const result = await deleteProductdb(id);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res.status(200).send({
      data: [],
      msg: "product deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(503)
      .json({ error: `unable to delete the product ${error}` });
  }
};

/***
 *
 * --------------Delete MetaData-----------
 *
 */

const deleteMetadata = async (req, res) => {
  let { Product } = req.params;
  Product=Product.toLowerCase()
  const user = req.user;
  if (user.title !== "admin" && user.title !== Product) {
    return res
      .status(405)
      .json({ error: `Only admin can delete the METADATA` });
  }
  if (Product == null || Product == undefined || Product == "") {
    return res.status(400).json({ error: `product not define ` });
  }

  try {
    const result = await deleteMetadatadb(Product);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res.status(200).send({
      data: [],
      msg: "metadata deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: `unable to delete the metadata ${error}` });
  }
};

/**
 *
 * --------Delete Theme----------
 *
 */

const deleteTheme = async (req, res) => {
  const { category } = req.params;
  const user = req.user;
  if (user.title !== "admin" ) {
    return res
      .status(405)
      .json({ error: `Only admin can delete the Theme` });
  }
  if (!category) {
    return res.status(405).json({ error: `Category is invalid` });
  }

  try {
    const result = await deleteThemedb(category);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res
      .status(200)
      .json({ message: "theme and associated data successfully deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Unable to delete the theme: ${error}` });
  }
};

module.exports = {
  getMetaDataById,
  getThemeById,
  updateProduct,
  updateTheme,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteTheme,
  getProductById,
  createMetadata,
  createTheme,
  createProduct,
  signInAdmin,
  getTheme,
  getProduct,
  getMetaData,
};
