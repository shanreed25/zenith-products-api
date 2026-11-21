import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

//GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error getting products", error: err.message });
  }
});


//POST /api/products (Create a Product)
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    //if schema validation fails
    if (err.name === "ValidationError") {
      // create an array of the error messages
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: errorMessages });
    }

    //if wrong type is use for a field
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ errors: [`Invalid value for ${err.path}`] });
    }

    //server problem
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


//GET /api/products/:id (Read a Single Product)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // helper that checks the format up front
  // rejects badly formatted ids before hitting the database
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


//PUT /api/products/:id (Update a Product)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      //new: true,           // returnDocument: 'after' replaces new: true
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }

    if (err.name === "CastError") {
      return res.status(400).json({ error: `Invalid value for ${err.path}` });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
