require("dotenv").config();
const connectDB = require("./config/mongodb");
const app = require("./app");
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`auth-service running on port ${PORT}`);
});
