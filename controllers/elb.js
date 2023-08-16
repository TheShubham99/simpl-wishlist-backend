// elb.js
const express = require('express');
const router = express.Router();

// Define user-related routes and handlers
router.get('/elb-check', (req, res) => {
    res.send("Hello from simpl wishlist backend!")
});

// Export the router
module.exports = router;