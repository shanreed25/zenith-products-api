# Zenith Products API

**An RESTful API using Node.js, Express, and Mongoose. The API handles all fundamental CRUD operations and include advanced features like filtering, sorting, and pagination to manage a large and complex products catalog.**


### Project Setup
- [X] **Initialize Project:** Create a new project directory, initialize it with `npm`, and install `express`, `mongoose`, and `dotenv`.
- [X] **Environment:** Create a `.env` file to store your `MONGO_URI` connection string and a `PORT` for the server.
- [X] **Security:** Create a `.gitignore` file and ensure `node_modules/` and `.env` are listed.
- [ ] **Project Structure:** Your application must be well-structured with separate directories for your database connection logic, Mongoose models, and Express routes.
    - [X] `server.js` (main entry point)
    - [X] `config/` (or `db/`) for `connection.js`
    - [X] `models/` for `Product.js`
    - [X] `routes/` for `productRoutes.js`


### Schema and Model
- [X] In `models/Product.js`, define a productSchema with the following fields and validation rules:
    - [X] `name`: String, required.
    - [X] `description`: String, required.
    - [X] `price`: Number, required, must be greater than 0.
    - [X] `category`: String, required.
    - [X] `inStock`: Boolean, defaults to true.
    - [X] `tags`: An Array of Strings.
    - [X] `createdAt`: Date, defaults to the current date and time.
- [X] Compile this schema into a model named Product and export it.


### Database Connection
- [X] In your `config/connection.js` file, establish a connection to your MongoDB Atlas database using Mongoose.
- [X] Handle both successful connections and connection errors gracefully by logging appropriate messages to the console.
- [X] Execute this connection logic from `server.js`

### API Routes and Logic
**In `routes/productRoutes.js`, use `express.Router()` to define your API endpoints. The logic for each route should be handled directly within the route file. Implement the following endpoints. All endpoints must handle potential errors with try...catch blocks and return appropriate status codes and JSON responses.**

#### POST /api/products (Create a Product)
- [X] Creates a new product based on the `req.body`.
- [X] Responds with the newly created product and a 201 status code.
- [X] If validation fails, it should return a 400 status code with a descriptive error message.

### GET /api/products/:id (Read a Single Product)
- [ ] Retrieves a single product by its _id.
- [ ] If the product is found, responds with the product object.
- [ ] If no product is found, responds with a 404 status code.