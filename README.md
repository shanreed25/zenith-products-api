# Zenith Products API

**An RESTful API using Node.js, Express, and Mongoose. The API handles all fundamental CRUD operations and include advanced features like filtering, sorting, and pagination to manage a large and complex products catalog.**


### Project Setup
- [X] **Initialize Project:** Create a new project directory, initialize it with `npm`, and install `express`, `mongoose`, and `dotenv`.
- [X] **Environment:** Create a `.env` file to store your `MONGO_URI` connection string and a `PORT` for the server.
- [X] **Security:** Create a `.gitignore` file and ensure `node_modules/` and `.env` are listed.
- [ ] **Project Structure:** Your application must be well-structured with separate directories for your database connection logic, Mongoose models, and Express routes.
    - [ ]server.js (main entry point)
    - [ ]config/ (or db/) for connection.js
    - [ ]models/ for Product.js
    - [ ]routes/ for productRoutes.js