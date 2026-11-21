import { Schema, model } from "mongoose";

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
    //custom validator for greater than 0
    validate: {
      /*
        calls the arrow function and passes in the price being saved as value
        returns true if price is valid otherwise returns false
        if false an error is added for the price field
      */
      validator: (value) => value > 0,

      /*
        message only gets used when the validator returns false
        it gets a props object that has details about the failure
        props.value is the value that failed
        props.path is the field name
      */
      message: (props) => `${props.value} is not valid. Price must be greater than 0`,
    }
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

const Product = model("Product", productSchema);

export default Product;
