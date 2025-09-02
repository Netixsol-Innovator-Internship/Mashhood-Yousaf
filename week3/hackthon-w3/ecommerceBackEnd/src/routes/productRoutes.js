const express = require("express");

const productController = require("../controllers/productController");
const upload = require("../middlewares/multerCloudinary");
const { checkAuth } = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", productController.getProducts);
// router.get("/", productController.getProducts);
router.get("/category/:category", productController.getProductsByCategory);

// protectedRoutes
router.post(
  "/",
  checkAuth,
  requireRole("admin", "superAdmin"),
  upload.single("image"),
  productController.createProduct
);

router.get(
  "/productsForAdmin",
  checkAuth,
  requireRole("admin", "superAdmin"),
  productController.getProductsForAdminPage
);

router.get("/:id", productController.getProductsByID);

router.patch(
  "/:id",
  checkAuth,
  requireRole("admin", "superAdmin"),
  productController.updateProducts
);
router.delete(
  "/:id",
  checkAuth,
  requireRole("superAdmin"),
  productController.deleteProduct
);

module.exports = router;
