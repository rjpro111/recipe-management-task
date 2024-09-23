const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });




// Create a new recipe
router.post('/', protect, upload.single('image'), createRecipe);

// Get all recipes or filter by query
router.get('/', getRecipes);

// Get a recipe by ID
router.get('/:id', getRecipeById);

// Update a recipe
router.put('/:id', protect, upload.single('image'), updateRecipe);

// Delete a recipe
router.delete('/:id', protect, deleteRecipe); // Add the delete route here

module.exports = router;

