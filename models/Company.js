const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  industry: { type: String, required: true, trim: true },
  employees: { type: Number, required: true, min: 0 },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
