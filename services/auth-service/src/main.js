require("dotenv").config();
const connectDB = require("./config/mongodb");
const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

connectDB();

app.listen(PORT, () => {
  console.log(`auth-service running on port ${PORT}`);
});
