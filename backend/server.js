// Load environment variables from .env file FIRST before anything else
require("dotenv").config();

const app = require("./app");
const { seedAdmin } = require("./utils/seedAdmin");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Mera Illaca backend server is running on port ${PORT}`);
  // Seed the dev admin user if it doesn't already exist
  await seedAdmin();
});
