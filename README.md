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
- [ ] In `models/Product.js`, define a productSchema with the following fields and validation rules:
    - [ ] `name`: String, required.
    - [ ] `description`: String, required.
    - [ ] `price`: Number, required, must be greater than 0.
    - [ ] `category`: String, required.
    - [ ] `inStock`: Boolean, defaults to true.
    - [ ] `tags`: An Array of Strings.
    - [ ] `createdAt`: Date, defaults to the current date and time.
- [ ] Compile this schema into a model named Product and export it.


### Database Connection
- [X] In your `config/connection.js` file, establish a connection to your MongoDB Atlas database using Mongoose.
- [X] Handle both successful connections and connection errors gracefully by logging appropriate messages to the console.
- [X] Execute this connection logic from `server.js`.