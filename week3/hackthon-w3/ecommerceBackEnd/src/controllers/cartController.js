const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");

const ErrorResponse = require("../utils/errorResponse");

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64ee4eac1c0a2c56b2348cde
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *       404:
 *         description: User or Product not found
 *       500:
 *         description: Server error
 */

const addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userData.userId;
  let cart;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new ErrorResponse("User not found", 404, {}, false));
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return next(new ErrorResponse("Product not found", 404, {}, false));
    }

    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    console.log("cart", cart);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Increase quantity if already in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    console.log("itemIndex", itemIndex);

    await cart.save();
  } catch (err) {
    console.log("err", err);
    const error = new ErrorResponse(
      "Error catched while adding to cart",
      500,
      { err },
      false
    );
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       400:
 *         description: Cart is empty
 *       500:
 *         description: Failed to fetch cart
 */


const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userData.userId }).populate(
      "items.product"
    );

    if (!cart) {
      const error = new ErrorResponse(
        "Seems like cart is Empty",
        400,
        {},
        false
      );
      return next(error);
    }
    console.log("cart in get", cart);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    return next(new ErrorResponse("Failed to fetch cart", 500, {}, false));
  }
};


/**
 * @swagger
 * /api/cart/update-quantity:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64ee4eac1c0a2c56b2348cde
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantity updated
 *       400:
 *         description: Invalid product or quantity
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */


const updateQuantity = async (req, res, next) => {
  const userId = req.userData.userId;
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return next(
      new ErrorResponse("Invalid product or quantity", 400, {}, false)
    );
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return next(new ErrorResponse("Cart not found", 404, {}, false));

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new ErrorResponse("Item not in cart", 404, {}, false));
    }
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: cart,
    });
  } catch (err) {
    return next(new ErrorResponse("Server error", 500, err));
  }
};

/**
 * @swagger
 * /api/cart/removeItem:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64ee4eac1c0a2c56b2348cde
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: No product to remove
 *       500:
 *         description: Server error
 */

const removeItemFromCart = async (req, res, next) => {
  const userId = req.userData.userId;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      const error = new ErrorResponse(
        "Seems Like Cart is empty or cart not present",
        400,
        {},
        false
      );
      return next(error);
    }

    const productExists = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!productId || !productExists) {
      const error = new ErrorResponse(
        "No Product to Remove, product not exists",
        400,
        {},
        false
      );
      return next(error);
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item Removed From Cart",
      data: cart,
    });

    // console.log('cart from remove ', cart)
  } catch (err) {
    const error = new ErrorResponse(
      "error catched while removing Item",
      500,
      { err },
      false
    );
    return next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeItemFromCart,
};
