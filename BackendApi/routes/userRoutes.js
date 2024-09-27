/** @format */

//importing modules
const express = require("express");


const { verifyJWT } = require("../auth/user.auth.middleware.js");
const adminController = require("../controllers/adminController.js");
const {
  signInAdmin,
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
  updateUser
} = adminController;
const router = express.Router();

const app = express();

app.use(express.json());

router.route("/admin/meta/search").get(searchMetaData); 


router.route("/signin").post(signInAdmin);

router.route("/admin/user").post(verifyJWT,createUser);
router.route("/admin/user").get(verifyJWT,getUser);
router.route("/admin/user/:username").get(verifyJWT,getUserByUsername);
router.route("/admin/user/:username").delete(verifyJWT,deleteUser);
router.route("/admin/user/:username").put(verifyJWT,updateUser);


router.route("/admin/product").post(verifyJWT, createProduct);
router.route("/admin/product/:productId").get(verifyJWT, getProductById);
router.route("/admin/product").get(verifyJWT, getProduct);
router.route("/admin/product/:id").put(verifyJWT, updateProduct);
router.route("/admin/product/:id").delete(verifyJWT, deleteProduct);

router.route("/admin/agency").post(verifyJWT, createagency);
router.route("/admin/agency/:category").get(verifyJWT, getagencyById);
router.route("/admin/agency").get(verifyJWT, getagency);
router.route("/admin/agency/:category").put(verifyJWT, updateagency);
router.route("/admin/agency/:category").delete(verifyJWT, deleteagency);

router.route("/admin/metadata").post(verifyJWT, createMetadata);
router.route("/admin/metadata/version").get(verifyJWT, getMetaDataByVersion);
router.route("/admin/metadata/:Product").get(verifyJWT, getMetaDataById);
router.route("/admin/metadata").get(verifyJWT, getMetaData);
router.route("/admin/metadata/:Product").put(verifyJWT, updatedMetadata);
router.route("/admin/metadata/:Product").delete(verifyJWT, deleteMetadata);

module.exports = router;
