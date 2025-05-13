const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
//const userRoutes = require('./routes/authRoutes');
const authRoutes = require('./routes/authRoutes');
const brandRoutes = require('./routes/brandRoutes');
const orderRoutes = require('./routes/orderRoutes');
const blogRoutes = require('./routes/blogRoutes');


const bodyParser = require('body-parser');// Thêm

const app = express();
app.use(cors());
app.use(express.json());

// có thể tăng hơn nếu ảnh lớn
app.use(bodyParser.json({ limit: '20mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/orders', orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
//app.use('/api/auth', authRoutes);
app.use('/api/', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/blogs', blogRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
