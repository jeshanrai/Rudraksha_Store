const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Prices
  costPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  discountRate: { type: Number, default: 0, min: 0, max: 100 },

  // Description and benefits
  description: { type: String },
  benefits: { type: String },

  // Stock & categorization
  stock: { type: Number, default: 0, min: 0 },
  mukhi: { type: Number },
  category: { type: String },

  // Images (Base64 or URLs)
  images: [{ type: String }],

  // Compatibility field (mirrors sellingPrice)
  price: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Sync price with sellingPrice and update timestamp before save
productSchema.pre('save', function (next) {
  this.price = this.sellingPrice;
  this.updatedAt = new Date();
  next();
});

// Virtual field for profit margin (%) = (sellingPrice - costPrice)/costPrice
productSchema.virtual('profitMargin').get(function () {
  if (!this.costPrice || this.costPrice === 0) return 0;
  return (((this.sellingPrice - this.costPrice) / this.costPrice) * 100).toFixed(2);
});

module.exports = mongoose.model('Product', productSchema);
