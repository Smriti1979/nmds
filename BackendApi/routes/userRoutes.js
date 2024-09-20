/** @format */

//importing modules
const express = require("express");


const { verifyJWT } = require("../auth/user.auth.middleware.js");
const adminController = require("../controllers/adminController.js");
const {
  signInAdmin,
  createProduct,
  createTheme,
  createMetadata,
  getProductById,
  getMetaDataById,
  getThemeById,
  updateProduct,
  updateTheme,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteTheme,
  getTheme,
  getMetaData,
  getProduct,
  getMetaDataByVersion
} = adminController;
const router = express.Router();

const app = express();

app.use(express.json());


router.route("/signin").post(signInAdmin);
router.route("/admin/product").post(verifyJWT, createProduct);
router.route("/admin/product/:productId").get(verifyJWT, getProductById);
router.route("/admin/product").get(verifyJWT, getProduct);
router.route("/admin/product/:id").put(verifyJWT, updateProduct);
router.route("/admin/product/:id").delete(verifyJWT, deleteProduct);

router.route("/admin/theme").post(verifyJWT, createTheme);
router.route("/admin/theme/:category").get(verifyJWT, getThemeById);
router.route("/admin/theme").get(verifyJWT, getTheme);
router.route("/admin/theme/:category").put(verifyJWT, updateTheme);
router.route("/admin/theme/:category").delete(verifyJWT, deleteTheme);

router.route("/admin/metadata").post(verifyJWT, createMetadata);
router.route("/admin/metadata/version").get(verifyJWT, getMetaDataByVersion);
router.route("/admin/metadata/:Product").get(verifyJWT, getMetaDataById);
router.route("/admin/metadata").get(verifyJWT, getMetaData);
router.route("/admin/metadata/:Product").put(verifyJWT, updatedMetadata);
router.route("/admin/metadata/:Product").delete(verifyJWT, deleteMetadata);

module.exports = router;
