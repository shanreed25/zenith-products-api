import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

//GET /api/products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();

//     res.status(200).json(products);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Error getting products", error: err.message });
//   }
// });

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

//DELETE /api/products/:id (Delete a Product)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET /api/products (Read All Products with Advanced Querying)
router.get("/", async (req, res) => {
  try {
    /*
        dynamically build the query, so the filter object starts empty 
        and only gets keys for the parameters that were sent
        if no sort or filter is sent then they stay empty objects {}
        */
    const filter = {};
    const sort = {}

    const { category, minPrice, maxPrice, sortBy } = req.query;
    
    //category========================================================================
    if (category) {
      filter.category = category;
    }

    //minPrice and maxPrice==========================================================
    /*{ price: { $gte: 20 } } is what will tell MongoDB to 
     return products where the price field is greater than or equal to 20
     */
    if (minPrice || maxPrice) {
      //creates { price: {} }
      filter.price = {};
      //a new key named $gte: { price: { $gte: 20 } }
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    //sortBy============================================================================
    if(sortBy){
      const sortByArray = sortBy.split('_');// if it is ?sortBy=price_desc, price_desc becomes ['price', 'desc']
      const field = sortByArray[0]; // 'price'
      const order = sortByArray[1]; // 'desc'

      /*
        with Mongoose 
        .sort({ price: 1 }) means ascending
        .sort({ price: -1 }) means descending
      */
      const sortOrder = order === 'desc' ? -1 : 1
      sort[field] = sortOrder
    }

    // console.log(filter);

    const products = await Product.find(filter).sort(sort);

    res.json(products);
  } catch (err) {}
});

export default router;
