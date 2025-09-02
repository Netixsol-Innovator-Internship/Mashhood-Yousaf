const express = require("express");
const { checkAuth } = require("../middlewares/verifyToken");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/add", checkAuth, cartController.addToCart);
router.get("/", checkAuth, cartController.getCart);
router.put("/update-quantity", checkAuth, cartController.updateQuantity);
router.delete("/removeItem", checkAuth, cartController.removeItemFromCart);

module.exports = router;
