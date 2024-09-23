const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    cuisine: { type: String, required: true },
    image: { type: String }, // Include image field
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema); // Ensure this line is correct
