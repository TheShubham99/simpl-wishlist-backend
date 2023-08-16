const express = require('express');
const app = express();

// Import controllers
const elbController = require('./controllers/elb');
const wishlistController = require('./controllers/v1/wishlist');

// Use controllers for specific routes
app.use('/', elbController);
app.use('/api/v1', wishlistController);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});