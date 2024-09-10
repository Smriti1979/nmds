/** @format */

//importing modules
const express = require("express");

const userController = require("../controllers/userController");
const { signup, login, getUser, updateUser, getAllLog } = userController;

const cpiController = require("../controllers/cpiController");
const {
  getAllIndiaSiIndicesOrInflationData,
  getAllIndiaItemIndicesOrInflationCombined,
  getMonths,
  getSector,
  getState,
  getItems,
  getGroups,
  getSubgroups,
} = cpiController;

const iipController = require("../controllers/iipController");
const {
  getMonth,
  getFrequency,
  getCategory,
  getSubcategory,
  getIIPAnnual,
  getIIPMonthly,
} = iipController;

const asiController = require("../controllers/asiController");
const { getIndicator, getStates, getNic, getASIData } = asiController;

const nasController = require("../controllers/nasController");
const {
  getIndicators,
  getApproach,
  getRevision,
  getAccount,
  getFreq,
  getQuarterly,
  getInstitutional,
  getIndustry,
  getSubindustry,
  getNASData,
} = nasController;

const { verifyJWT } = require("../auth/user.auth.middleware.js");
const adminController = require("../controllers/adminController.js");
const {
  signInAdmin,
  createProduct,
  createTheme,
  createMetadata,
  getProuductById,
  getMetaDataById,
  getThemeById,
  updateProduct,
  updateTheme,
  updatedMetadata,
  deleteProduct,
  deleteMetadata,
  deleteTheme,
} = adminController;
const router = express.Router();

const app = express();

app.use(express.json());

router.get("/users", getUser);
router.get("/users/getAllLog", getAllLog);
router.get("/users/:email", updateUser);
router.post("/users/usersignup", signup);
router.post("/users/login", login);

router.get("/cpi/getCPIIndex", getAllIndiaSiIndicesOrInflationData);
router.get("/cpi/getItemIndex", getAllIndiaItemIndicesOrInflationCombined);
router.get("/cpi/getMonths", getMonths);
router.get("/cpi/getSector", getSector);
router.get("/cpi/getState", getState);
router.get("/cpi/getItems", getItems);
router.get("/cpi/getGroups", getGroups);
router.get("/cpi/getSubgroups", getSubgroups);

router.get("/iip/getMonth", getMonth);
router.get("/iip/getFrequency", getFrequency);
router.get("/iip/getCategory", getCategory);
router.get("/iip/getSubcategory", getSubcategory);
router.get("/iip/getIIPAnnual", getIIPAnnual);
router.get("/iip/getIIPMonthly", getIIPMonthly);

router.get("/asi/getIndicator", getIndicator);
router.get("/asi/getStates", getStates);
router.get("/asi/getNic", getNic);
router.get("/asi/getASIData", getASIData);

router.get("/nas/getIndicators", getIndicators);
router.get("/nas/getApproach", getApproach);
router.get("/nas/getRevision", getRevision);
router.get("/nas/getAccount", getAccount);
router.get("/nas/getFreq", getFreq);
router.get("/nas/getQuarterly", getQuarterly);
router.get("/nas/getInstitutional", getInstitutional);
router.get("/nas/getIndustry", getIndustry);
router.get("/nas/getSubindustry", getSubindustry);
router.get("/nas/getNASData", getNASData);

router.route("/signin").post(signInAdmin);
router.route("/admin/product").post(verifyJWT, createProduct);
router.route("/admin/product/:productId").get(verifyJWT, getProuductById);
router.route("/admin/product/:id").patch(verifyJWT, updateProduct);
router.route("/admin/product/:id").delete(verifyJWT, deleteProduct);

router.route("/admin/theme").post(verifyJWT, createTheme);
router.route("/admin/theme/:category").get(verifyJWT, getThemeById);
router.route("/admin/theme/:category").patch(verifyJWT, updateTheme);
router.route("/admin/theme/:category").delete(verifyJWT, deleteTheme);

router.route("/admin/metadata").post(verifyJWT, createMetadata);
router.route("/admin/metadata/:product").get(verifyJWT, getMetaDataById);
router.route("/admin/metadata/:product").patch(verifyJWT, updatedMetadata);
router.route("/admin/metadata/:product").delete(verifyJWT, deleteMetadata);

module.exports = router;
