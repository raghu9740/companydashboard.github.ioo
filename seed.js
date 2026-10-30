require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("./models/Company");
const companies = require("./data/companies.json");

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/company_explorer";
  await mongoose.connect(uri);
  await Company.deleteMany({});
  await Company.insertMany(companies);
  console.log(`Successfully seeded ${companies.length} companies.`);
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error); process.exit(1); });
