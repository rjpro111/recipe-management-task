// // routes/auth.js
// const express = require('express');
// const multer = require('multer');
// const { registerUser, loginUser, getMe } = require('../controllers/authController');
// const router = express.Router();
// const path = require('path');

// // Setup multer for image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Specify the upload folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Append timestamp to filename
//   }
// });

// // Use multer with basic storage configuration
// const upload = multer({ storage });

// // Register a new user
// router.post('/register', upload.single('profilePic'), registerUser);

// // Login user
// router.post('/login', loginUser);

// // Get current logged in user
// router.get('/me', getMe);

// module.exports = router;

const express = require('express');
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/authController');  // Import the controller functions

const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route to register a new user
router.post('/register', upload.single('profilePic'), registerUser);  // Calls the registerUser controller function

// Route to login an existing user
router.post('/login', loginUser);  // Calls the loginUser controller function

module.exports = router;  // Export the router

