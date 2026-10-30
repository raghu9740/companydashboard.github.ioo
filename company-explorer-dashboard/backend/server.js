require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Company = require("./models/Company");
const seedCompanies = require("./data/companies.json");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({status:"ok", service:"Company Explorer API"}));

app.get("/api/companies", async (req, res) => {
  try {
    const { name, industry, country } = req.query;
    const filter = {};
    if (name) filter.name = name; // exact company-name match
    if (industry) filter.industry = industry;
    if (country) filter.country = country;

    if (mongoose.connection.readyState === 1) {
      const companies = await Company.find(filter).sort({name:1}).lean();
      return res.json(companies);
    }

    // API remains demo-ready without MongoDB, using the same assignment seed data.
    const result = seedCompanies.filter(c =>
      (!name || c.name === name) &&
      (!industry || c.industry === industry) &&
      (!country || c.country === country)
    );
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    res.status(500).json({message:"Unable to load companies"});
  }
});

app.get("/api/companies/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({message:"MongoDB is not connected"});
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({message:"Company not found"});
    res.json(company);
  } catch {
    res.status(400).json({message:"Invalid company ID"});
  }
});

async function start() {
  const port = process.env.PORT || 5000;
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS:2500});
      console.log("Connected to MongoDB");
      const count = await Company.countDocuments();
      if (count === 0) {
        await Company.insertMany(seedCompanies);
        console.log(`Seeded ${seedCompanies.length} companies`);
      }
    } catch (error) {
      console.warn("MongoDB is unavailable; API will use bundled seed data.");
      console.warn(error.message);
    }
  } else {
    console.warn("MONGODB_URI is not set; API will use bundled seed data.");
  }
  app.listen(port, () => console.log(`Company Explorer API running at http://localhost:${port}`));
}
start();
