import 'dotenv/config';
import express from 'express';
import connectToDB from './config/connection.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

app.use('/api/products', productRoutes)


app.get('/', (req, res) => {
  res.json({ message: 'Zenith Products API started' });
});


await connectToDB();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});