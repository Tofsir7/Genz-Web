const mongoose = require('mongoose');
const app = require('./index');
const env = require('dotenv');
env.config();

const port = process.env.PORT||8000;
// Connecting to MongoDB
const MONGO_URI = process.env.MONGO_URI;
const config = { useNewUrlParser: true, useUnifiedTopology: true };
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, config);
    console.log("✅ MongoDB Connected Successfully");
    app.listen(port,"0.0.0.0", ()=>{
  console.log(`Server is RUNNING on port: http://127.0.0.1:${port}`);
})
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectDB();

