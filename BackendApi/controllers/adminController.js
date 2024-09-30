/** @format */

const { generateAccessToken } = require("../helper_utils/generateAccessToken");
const bcrypt = require("bcrypt");
const admindb = require("../DbQuery/dbOperationAdmin");
// var AES = require("crypto-js/aes");
const {
  EmailValidation,
  createProductdb,
  createagencydb,
  getProductByIddb,
  getProductdb,
  getMetaDataByIddb,
  getagencyByIddb,
  getMetaDataByVersionP,
  getMetaDataByVersionPV,
  updateProductDevdb,
  updateProductDomdb,
  updateagencydb,
  deleteagencydb,
  updateMetadatadb,
  deleteProductdb,
  deleteMetadatadb,
  getagencydb,
  createMetadatadb,
  getMetaDatadb,
  searchMetaDatadb,
  createUserdb,
  getUserdb,
  getUserByUsernameDb,
  deleteUserDb,
  updateUserDb
} = admindb;


/**
 * 
 * ---Create user access
 * 
 */

const createUser=async(req,res)=>{
  let {username,password,title,name,email,phno,address}=req.body;
  const user = req.user;
    if (user.title !== "CC_User") {
      return res
        .status(405)
        .json({ error: `Only CC_User can create the user` });
    }
  try {
    // use it for encryption and decryption
    // const key = process.env.PASSWORD_KEY;
    // password = AES.decrypt(password, key);
    const user = await createUserdb(username,password,title,name,email,phno,address);
    if (user.error == true) {
      return res.status(403).json({ error: user.error });
    }
    return res.status(201).send({
      data: {
        user
      },
      msg: "user creates successfully",
      statusCode: true,
    });

  } catch (error) {
    return res.status(500).json({ error: `Error in signIn User ${error}` });
  }

}
const getUser=async(req,res)=>{
  const user = req.user;
    if (user.title !== "CC_User") {
      return res
        .status(405)
        .json({ error: `Only CC_User can create the user` });
    }
  try {

    const user = await getUserdb();
    if (user.error == true) {
      return res.status(400).json({ error: `User does not exist` });
    }
    return res.status(201).send({
      data: {
        user
      },
      msg: "user creates successfully",
      statusCode: true,
    });

  } catch (error) {
    return res.status(500).json({ error: `Error in getting all user ${error}` });
  }

}
const getUserByUsername = async (req, res) => {
  let { username } = req.params;
  const user = req.user;
  if (user.title !== "CC_User") {
    return res.status(405).json({ error: `Only CC_User can access this data` });
  }
  try {
    const user = await getUserByUsernameDb(username);
    if (user.error == true) {
      return res.status(400).json({ error: user.errorMessage });
    }
    return res.status(200).send({
      data: user,
      msg: "User fetched successfully",
      statusCode: true,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error fetching user: ${error}` });
  }
};
const deleteUser = async (req, res) => {
  let { username } = req.params;
  const user = req.user;
  if (user.title !== "CC_User"){
    return res.status(405).json({ error: `Only CC_User can delete the user` });
  }
  if (username == "CC_User"){
    return res.status(405).json({ error: `you can not delete CC_User` });
  }
  try {
    const deletedUser = await deleteUserDb(username);
    if (deletedUser.error == true) {
      return res.status(404).json({ error: deletedUser.errorMessage });
    }
    return res.status(200).send({
      msg: "User deleted successfully",
      statusCode: true,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error deleting user: ${error}` });
  }
};
const updateUser = async (req, res) => {
  let { username } = req.params;
  let { title, name, email, phno, address, password } = req.body; // Password is now part of the request body
  const user = req.user;

  if (user.title !== "CC_User") {
    return res.status(405).json({ error: `Only CC_User can update the user` });
  }

  try {
    const updatedUser = await updateUserDb(username, title, name, email, phno, address, password); // Pass password to the update function
    if (updatedUser.error == true) {
      return res.status(404).json({ error: updatedUser.errorMessage });
    }
    return res.status(200).send({
      data: {username, title, name, email, phno, address,},
      msg: "User updated successfully",
      statusCode: true,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error updating user: ${error}` });
  }
};


/**
 * Sign In
 */
const signInAdmin = async (req, res) => {
  const userAgents = req.headers['x-from-swagger'];
 const userAgent = req.headers['user-agent'] || ''
  let { username, password } = req.body;
  try {
    const key = process.env.PASSWORD_KEY;
    if (!userAgents && !userAgent.includes('Postman') ) {
      // password = AES.decrypt(password, key);
    }
    const UsersDetail = await EmailValidation(username);
    if (UsersDetail?.error == true) {
      return res.status(403).json({ error: `User does not exist` });
    }
    const correctpassword = await bcrypt.compare(
      password,
      UsersDetail.password
    );
    if (!correctpassword) {
      return res.status(403).json({ error: `Required correct password` });
    }

    const adminAccessToken = generateAccessToken({
      username: username,
      id: UsersDetail.id,
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,

    };  
    res.cookie('adminAccessToken', adminAccessToken, cookieOptions);
    return res.status(200).send({
      data: {
        username: username,
        role:UsersDetail.title,
        token:adminAccessToken
      },
      msg: "UserVerified",
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
    const authorId=req.user.id
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
      authorId,
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
      .status(error?.errorCode || 500)
      .json({ error: `Error in Creating product: ${error}` });
  }
};
/**
 * -----Create agency ------
 *
 */

const createagency = async (req, res) => {
  const { category, name } = req.body;
  try {
    const user = req.user;
    if (user.title !== "admin") {
      return res
        .status(405)
        .json({ error: `Only admin can create the agency}` });
    }

    const result = await createagencydb(category, name);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res.status(201).send({
      data: result,
      msg: "agency created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Error in Creating agency: ${error.message}` });
  }
};

/**
 * Metadata
 */
const createMetadata = async (req, res) => {
  try {

    const user = req.user;

    if (user.title !== "admin") {
      return res.status(405).json({ error: `Only admin can create metadata` });
    }

  

    // Exclude predefined fields and store the rest in the `data` column as JSON
    const {Product, ...dynamicData } = req.body; // Capture all other dynamic fields into `dynamicData`
    const productID = Product.toLowerCase();
    const result = await createMetadatadb({
      Product: productID,
      data: dynamicData,  // Store the remaining dynamic fields as JSON
      user_id: user.id,
      version: 1,
      latest: true,
    });

    if (result?.error) {
      throw result?.errorMessage;
    }

    return res.status(201).send({
      data: result,
      msg: "Metadata created successfully",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Error in creating metadata: ${error}` });
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
    const product = await getProductdb();
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
      msg: "metadata",
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
  const user=req.user
  if(user.title!="admin" && user.title!=Product && user.title!="domain"){
    return res
    .status(400)
    .json({ error: `only admin domain and ${user.title} can access the api ` });
  }
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
      msg: "metadata",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
};
const getMetaDataByVersion=async(req,res)=>{
  const { product, version } = req.query;
  try {
    if(version==null && product!==null){
      const metadata=await getMetaDataByVersionP(product)
      if (metadata?.error == true) {
        throw metadata?.errorMessage;
      }
      return res.status(200).send({
        data: metadata,
        msg: "meta data",
        statusCode: true,
      });
    }
    else if(product!=null && version!=null){
      const metadata=await getMetaDataByVersionPV(product,version)
      if (metadata?.error == true) {
        throw metadata?.errorMessage;
      }
      return res.status(200).send({
        data: metadata,
        msg: "meta data",
        statusCode: true,
      });
    }
    else{
      return res.status(200).send({
        msg: "product is required",
        statusCode: true,})
    }
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: `Unable to fetch data Error=${error}` });
  }
}

const searchMetaData=async(req,res)=>{
  const searchParams = req.query;
 
  try {
   
    const metadata=await searchMetaDatadb(searchParams);
    if(metadata?.error){
      return res.status(400).send({
        data: [],
        msg: "data not found",
        statusCode: false,
      });
    }
    return res.status(200).send({
      data: metadata,
      msg: "meta data",
      statusCode: true,
    });
  
  } catch (error) {
    return res
    .status(500)
    .json({ error: `Unable to fetch data Error=${error}` });
  }
}
/**
 *
 * ---------Get agency---------
 *
 */
const getagency = async (req, res) => {
  try {
    const user = req.user;
    if (user.title !== "admin" && user.title !== "domain") {
      return res
        .status(403) 
        .json({ error: "Only developers or domain users can access the agency." });
    }
    const agency = await getagencydb();

    if (agency?.error == true) {
      throw agency?.errorMessage;
    }

    return res.status(200).send({
      data: agency,
      msg: "agency data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Unable to get agency ${error}` });
  }
};
const getagencyById = async (req, res) => {
  const user = req.user;
  if (user.title !== "admin" && user.title !== "domain") {
    return res
      .status(403) 
      .json({ error: "Only developers or domain users can access the agency." });
  }
  const { category } = req.params;
  if (category == undefined) {
    return res.status(400).json({ error: `category is required` });
  }
  try {
    const agency = await getagencyByIddb(category);

    if (agency?.error == true) {
      throw agency?.errorMessage;
    }

    return res.status(200).send({
      data: agency,
      msg: "agency data",
      statusCode: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Unable to get agency ${error}` });
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
      res.status(400).json({ error: `Unknown user ` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error in Updating product ${error}` });
  }
};

/**
 *
 * --------Update agency----------------
 *
 */
const updateagency = async (req, res) => {
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
    const agency = await updateagencydb(name, category);
    if (agency?.error == true) {
      throw agency?.errorMessage;
    }

    return res.status(200).send({
      data: agency,
      msg: "agency updated successfully",
      statusCode: true,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ error: `Error in Updating agency data: ${error}` });
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
  const {...metadata}=req.body

  try {
    const user = req.user;
    const user_id=user.id
    if(user.title=="admin" || user.title==Product || user.title=="domain"){
      const result = await updateMetadatadb(
        Product,
        metadata,
        user_id
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
      .json({ error: `Error in updating metadata: ${error}` });
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
 * --------Delete agency----------
 *
 */

const deleteagency = async (req, res) => {
  const { category } = req.params;
  const user = req.user;
  if (user.title !== "admin" ) {
    return res
      .status(405)
      .json({ error: `Only admin can delete the agency` });
  }
  if (!category) {
    return res.status(405).json({ error: `Category is invalid` });
  }

  try {
    const result = await deleteagencydb(category);
    if (result?.error == true) {
      throw result?.errorMessage;
    }
    return res
      .status(200)
      .json({ message: "agency and associated data successfully deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Unable to delete the agency: ${error}` });
  }
};

module.exports = {
  getMetaDataById,
  getagencyById,
  updateProduct,
  updateagency,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteagency,
  getProductById,
  createMetadata,
  createagency,
  createProduct,
  signInAdmin,
  getagency,
  getProduct,
  getMetaData,
  getMetaDataByVersion,
  searchMetaData,
  createUser,
  getUser,
  getUserByUsername,
  deleteUser,
  updateUser
};
