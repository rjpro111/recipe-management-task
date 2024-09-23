const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

exports.createRecipe = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const { title, ingredients, instructions, cuisine } = req.body;

  try {
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      cuisine,
      image: req.file ? `uploads/${req.file.filename}` : null, // Store the image path with a filename
      author: req.user._id,
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Invalid recipe data' });
  }
};


// @desc    Get all recipes or filter by query
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  try {
    const { cuisineType, author, title } = req.query;
    let query = {};

    if (cuisineType) {
      query.cuisineType = { $regex: cuisineType, $options: 'i' };
    }

    if (author) {
      query.author = author;
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const recipes = await Recipe.find(query).populate('author', 'username');
    res.json(recipes);
  } catch (error) { 
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a recipe

exports.updateRecipe = async (req, res) => {
  
  const { title, ingredients, instructions, cuisine, image } = req.body;

  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this recipe' });
    }

    // If new image is uploaded, remove the old one
    if (req.file) {
      const oldImagePath = path.join(__dirname, '../uploads', recipe.image); // Adjust path as necessary
      console.log(oldImagePath);
      

      // Check if old image exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image from uploads folder
      }

      // Set new image path to the recipe (assuming `req.file.filename` is the new image name)
      recipe.image = req.file.filename;
    }

    // Update other fields
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.cuisine = cuisine || recipe.cuisine;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
};


// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this recipe' });
    }

    // Delete the associated image file if it exists
    if (recipe.image) {
      console.log("dddd"+recipe.image);
      
      const imagePath = path.join(__dirname, '..', recipe.image); // Adjust path as needed
      console.log('Image path:', imagePath); // Log the path for debugging

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath); // Use synchronous unlink
          console.log('Image deleted successfully');
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      } else {
        console.log('Image file does not exist');
      }
    }

    // Delete the recipe
    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
};



