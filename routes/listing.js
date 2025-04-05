const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
require('dotenv').config();
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage })

router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))
  
router.get('/new', isLoggedIn, listingController.renderNewForm);
  
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
  
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.post('/search', wrapAsync(listingController.searchListing));

module.exports = router;