import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"], // custom error message
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String], //array of strings
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = model.apply("Product", productSchema);

export default Product;
