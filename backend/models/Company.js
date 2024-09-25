
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  pot: { type: Number, default: 0, min: 0 }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;