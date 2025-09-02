const mongoose = require("mongoose");
const Products = require("../models/productSchema");
const ErrorResponse = require("../utils/errorResponse");
// const User = require("../models/userSchema");

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sample Product
 *               description:
 *                 type: string
 *                 example: This is a sample product.
 *               price:
 *                 type: number
 *                 example: 500
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error or image missing
 *       500:
 *         description: Server error
 */

const createProduct = async (req, res, next) => {
  // if (!["admin", "superAdmin"].includes(req.userData.role)) {
  //   return res
  //     .status(403)
  //     .json({ message: "Only admins or SuperAdmin can create products" });
  // }

  let {
    name,
    description,
    price,
    category,
    origin,
    flavor,
    qualities,
    caffeine,
    allergens,
  } = req.body;

  category = category.trim();
  if (
    name.trim().length < 3 ||
    description.trim().length < 7 ||
    !price ||
    Number(price) < 100 ||
    Number(price) > 10000 ||
    !category ||
    category.trim().length < 3
  ) {
    const error = new ErrorResponse(
      "Invalid input: name, category must be at least 3 chars, description at least 7 chars, and  price must be between 100 and 10000",
      400,
      {},
      false
    );
    return next(error);
  }
  if (!req.file) {
    const error = new ErrorResponse("Image is required", 400, {}, false);
    return next(error);
  }
  console.log("req.file ==> ", req.file);

  const createdProduct = new Products({
    name,
    description,
    price,
    category,
    origin,
    flavor,
    qualities,
    caffeine,
    allergens,
    image: req.file.path,
  });

  try {
    let existingProduct = await Products.findOne({ name });

    if (existingProduct) {
      const error = new ErrorResponse(
        "user different name , this product is already exists",
        404,
        existingProduct,
        false
      );
      return next(error);
    }

    await createdProduct.save();
  } catch (err) {
    console.error("Error while saving Product:", err);
    const error = new ErrorResponse(
      "Error while creating product",
      500,
      {},
      false
    );
    return next(error);
  }

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: createdProduct,
  });
};

const dummy = async (req, res, next) => {
  res.json({
    data: await Products.find({}),
  });
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */

const getProducts = async (req, res, next) => {
  let products;
  try {
    const categoriesWithOneProductEach = await Products.aggregate([
      {
        $group: {
          _id: "$category", // category wise group karna
          product: { $first: "$$ROOT" }, // har category ka pehla product lena
        },
      },
    ]);

    // Sirf products ki list nikalni hai response me (aggregation me product field me hai)
    products = categoriesWithOneProductEach.map((item) => item.product);
    console.log("products from aggragation", products);
    if (products.length === 0) {
      const error = new ErrorResponse("Zero products found in DB", 404);
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching products:", err.message || err);
    const error = new ErrorResponse(
      "error catched getting products, server error",
      500,
      { err: err.message || err.toString() },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "  products data",
    data: products,
  });
};

const getProductsByCategory = async (req, res, next) => {
  const category = req.params.category.trim().toLowerCase();
  let products;
  try {
    products = await Products.find({ category });
    console.log("products from category", products);

    if (!products || products.length === 0) {
      const error = new ErrorResponse(
        `No products found in category: ${category}`,
        404
      );
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching products:", err.message || err);
    const error = new ErrorResponse(
      "error catched getting products, server error",
      500,
      { err: err.message || err.toString() },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: `${category} category products data`,
    data: products,
  });
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

const getProductsByID = async (req, res, next) => {
  const productId = req.params.id;
  let product;
  try {
    product = await Products.findById(productId);
    if (!product) {
      const error = new ErrorResponse("no product found", 404, {}, false);
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    const error = new ErrorResponse(
      "error Catched while getting product by Id",
      500,
      { err },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Product for provided ID",
    data: product,
  });
};

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedName
 *               - updatedDescription
 *               - updatedPrice
 *             properties:
 *               updatedName:
 *                 type: string
 *                 example: Updated Product
 *               updatedDescription:
 *                 type: string
 *                 example: Updated description here.
 *               updatedPrice:
 *                 type: number
 *                 example: 799
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

const updateProducts = async (req, res, next) => {
  const { id } = req.params;
  const { updatedName, updatedDescription, updatedPrice } = req.body;
  console.log('id', id)
  console.log('req.body', req.body)
  console.log('type of updatedPrice', typeof updatedPrice)
  
  if (!updatedName.trim() || !updatedDescription.trim()) {
    const error = new ErrorResponse(
      "Name and description is required",
      404,
      {},
      false
    );
    return next(error);
  }
  if (
    !updatedPrice ||
    Number(updatedPrice) < 100 ||
    Number(updatedPrice) > 10000
  ) {
    console.log('type of updatedPrice', typeof updatedPrice)
    const error = new ErrorResponse(
      "The price must be between 100 and 10000",
      400,
      {},
      false
    );
    return next(error);
  }

  let product;
  try {
    product = await Products.findById(req.params.id);
    if (!product) {
      const error = new ErrorResponse("Product not found", 404, {}, false);
      return next(error);
    }
    console.log('product', product)
    
    product.name = updatedName;
    product.description = updatedDescription;
    product.price = updatedPrice;
    
    await product.save();
    console.log('product', product)
  } catch (err) {
    console.error("Error updating Product:", err);
    const error = new ErrorResponse(
      "Error while updating Product",
      500,
      {},
      false
    );
    return next(error);
  }
  console.log('product', product)
  res.status(200).json({
    success: true,
    message: "Products updated successfully",
    data: product,
  });
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

const deleteProduct = async (req, res, next) => {
  // if (req.userData.role !== "superAdmin") {
  //   return res
  //     .status(403)
  //     .json({ message: "Only SuperAdmins can delete products." });
  // }

  let deletedProduct;
  try {
    deletedProduct = await Products.findById(req.params.id);
    if (!deletedProduct) {
      const error = new ErrorResponse(
        "No product for provided ID",
        400,
        {},
        false
      );
      return next(error);
    }

    // if (deletedProduct.id !== req.userData.userId) {
    //   const error = new Error(
    //     "You are not allowed ( Authorized ) to delete this Product"
    //   );
    //   error.status = 401;
    //   return next(error);
    // }

    await deletedProduct.deleteOne();
  } catch (err) {
    console.error("Error deleting Product:", err);
    const error = new ErrorResponse(
      "Error while deleting Product",
      500,
      {},
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};

// for admin

const getProductsForAdminPage = async (req, res, next) => {
  let products;
  try {
    products = await Products.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
        data: {},
      });
    }
  } catch (err) {
    console.error("Error fetching products:", err.message || err);
    const error = new ErrorResponse(
      "error catched getting products, server error",
      500,
      { err: err.message || err.toString() },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "  products data",
    data: products,
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductsByID,
  updateProducts,
  deleteProduct,
  getProductsByCategory,
  dummy,
  getProductsForAdminPage,
};
