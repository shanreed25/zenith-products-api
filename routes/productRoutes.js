import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

//==============================Helper Functions=====================================
//category========================================================================
function categoryFilter(category) {
  if (category) {
    /*
        for category=electronics
        returns Electronics
      */
    return category[0].toUpperCase() + category.slice(1);
  }
}

//minPrice and maxPrice==========================================================
function priceFilter(minPrice, maxPrice) {
  const price = {};

  if (minPrice) {
    const min = Number(minPrice);
    if (Number.isNaN(min)) {
      return null; // its not a number
    }
    price.$gte = min;//a new key named $gte: { $gte: 15 }
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (Number.isNaN(max)) {
      return null;// its not a number
    }
    price.$lte = max;//a new key named $lte: { $lte: 250 }
  }

  /*
      for ?minPrice=15&maxPrice=250
      returns { '$gte': 15, '$lte': 250 }
    */
  return price;
}

function sortByFliter(sortBy) {
  const sortByObject = {};
  if (sortBy) {
    const sortByArray = sortBy.split("_"); // if it is ?sortBy=price_desc, price_desc becomes ['price', 'desc']
    const field = sortByArray[0]; // 'price'
    const order = sortByArray[1]; // 'desc'

    /*
        with Mongoose 
        .sort({ price: 1 }) means ascending
        .sort({ price: -1 }) means descending
      */
    const sortOrder = order === "desc" ? -1 : 1;
    sortByObject[field] = sortOrder;
    return sortByObject;
  }

  return sortByObject;
}

function paginationFilter(page, limit) {
  page = Number(page);
  limit = Number(limit);

  /*
    (page || 1): when page is falsy(NaN for something like 'hi' or 0) use 1
    if a negative number is passed for page that negative number wins ((-5 || 1), 1)
    (-5, 1) then 1 wins
  */
  const pageNum = Math.max(page || 1, 1); //number of pages
  const limitNum = Math.max(limit || 10, 1); //number of documents for each page

  /*
    (pageNum(4) - 1), current page is pageNum, so there are pageNum - 1 earlier pages
    3 * limitNum(3),  skips 9 products
  */
  const skipNum = (pageNum - 1) * limitNum; //how many documents to skip

  return [limitNum, skipNum];
}

//================================ROUTES============================================
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
    // const sort = {};

    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    if (category) {
      //add a key only when categoryFilter() returns something to filter on
      filter.category = categoryFilter(category);
    }

    const price = priceFilter(minPrice, maxPrice);

    if (price === null) {
      return res
        .status(400)
        .json({ error: "minPrice and maxPrice must be numbers" });
    }

    if (Object.keys(price).length > 0) {
      //add a key only when priceFilter() returns something to filter on
      filter.price = price;
    }

    const sort = sortByFliter(sortBy); //empty object passed to sort({}), gives default order

    const pagination = paginationFilter(page, limit);
    const limitNum = pagination[0];
    const skipNum = pagination[1];
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
