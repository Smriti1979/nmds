/** @format */

import { Router } from "express";
import {
  createMetadata,
  createProduct,
  createTheme,
} from "../controllers/create/Create.js";
import { verifyJWT } from "../middleware/user.auth.middleware.js";
import {
  getMetaDataById,
  getProuductById,
  getThemeById,
} from "../controllers/get/getData.js";
import {
  updatedMetadata,
  updateProduct,
  updateTheme,
} from "../controllers/update/edit.js";
import {
  deleteMetadata,
  deleteProduct,
  deleteTheme,
} from "../controllers/delete/delete.js";
import { signIn } from "../controllers/auth/auth.js";
const router = Router();

router.route("/signin").post(signIn);

router.route("/product").post(verifyJWT, createProduct);
router.route("/product/:productId").get(verifyJWT, getProuductById);
router.route("/product/:id").patch(verifyJWT, updateProduct);
router.route("/product/:id").delete(verifyJWT, deleteProduct);

router.route("/theme").post(verifyJWT, createTheme);
router.route("/theme/:category").get(verifyJWT, getThemeById);
router.route("/theme/:category").patch(verifyJWT, updateTheme);
router.route("/theme/:category").delete(verifyJWT, deleteTheme);

router.route("/metadata").post(verifyJWT, createMetadata);
router.route("/metadata/:Product").get(verifyJWT, getMetaDataById);
router.route("/metadata/:Product").patch(verifyJWT, updatedMetadata);
router.route("/metadata/:Product").delete(verifyJWT, deleteMetadata);

export default router;
