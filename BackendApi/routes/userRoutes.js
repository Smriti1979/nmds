/** @format */

//importing modules
const express = require("express");

const { verifyJWT } = require("../auth/user.auth.middleware.js");
const pimdController = require("../controllers/pimdController.js");
const {
  signInpimd,
  createProduct,
  createagency,
  createMetadata,
  getProductById,
  getMetaDataById,
  getagencyById,
  updateProduct,
  updateagency,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteagency,
  getagency,
  searchMetaData,
  getMetaData,
  getProduct,
  getMetaDataByVersion,
  createUser,
  getUser,
  getUserByUsername,
  deleteUser,
  updateUser,
  updateroles
} = pimdController;
const router = express.Router();

const app = express();

app.use(express.json());

router.route("/pimd/meta/search").get(searchMetaData); 


router.route("/signin").post(signInpimd);

router.route("/pimd/user").post(verifyJWT,createUser); //only PIMD or role 1 can do this
router.route("/pimd/user").get(verifyJWT,getUser); //anyone with JWT can do this
router.route("/pimd/user/:username").get(verifyJWT,getUserByUsername); // /pimd/user/test1 (write the actual username)
router.route("/pimd/user/:username").delete(verifyJWT,deleteUser); //only PIMD or role 1 can do this
router.route("/pimd/user/:username").put(verifyJWT,updateUser); //only PIMD or role 1 can do this
router.route("/pimd/user/:username/roles").patch(verifyJWT, updateroles); //only PIMD or role 1 can do this

router.route("/pimd/agency").post(verifyJWT, createagency); //only PIMD or role 1,2 can do this
router.route("/pimd/agency/:category").get(verifyJWT, getagencyById); //anyone with JWT can do this
router.route("/pimd/agency").get(verifyJWT, getagency); //anyone with JWT can do this
router.route("/pimd/agency/:category").put(verifyJWT, updateagency); //we can only update name of a particular category //only PIMD or role 1,2 can do this
router.route("/pimd/agency/:category").delete(verifyJWT, deleteagency); //only PIMD or role 1 can do this

//you cannot create product without agency
router.route("/pimd/product").post(verifyJWT, createProduct); //only PIMD or role 1,2 can do this
router.route("/pimd/product/:productId").get(verifyJWT, getProductById); //anyone with JWT can do this
router.route("/pimd/product").get(verifyJWT, getProduct); //anyone with JWT can do this
router.route("/pimd/product/:id").put(verifyJWT, updateProduct); //only PIMD or role 1,2 can do this
router.route("/pimd/product/:id").delete(verifyJWT, deleteProduct); //only PIMD or role 1 can do this

router.route("/pimd/metadata").post(verifyJWT, createMetadata); //only PIMD or role 1,2 can do this
router.route("/pimd/metadata/version").get(verifyJWT, getMetaDataByVersion); //anyone with JWT can do this
router.route("/pimd/metadata/:Product").get(getMetaDataById); //anyone can do this
router.route("/pimd/metadata").get(getMetaData); //anyone can do this
router.route("/pimd/metadata/:Product").put(verifyJWT, updatedMetadata); //only PIMD or role 1,2 can do this
router.route("/pimd/metadata/:Product").delete(verifyJWT, deleteMetadata); //only PIMD or role 1 can do this


module.exports = router;
