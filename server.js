const express = require('express');
const app = express();
const cors = require('cors');


// Import controllers
const elbController = require('./controllers/elb');
const wishlistController = require('./controllers/v1/wishlist');
const wishlistCheckoutController = require('./controllers/v1/checkout');

app.use(cors());
// Middleware to handle preflight requests
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.setHeader('Access-Control-Allow-Credentials', "true");
    res.setHeader('Access-Control-Allow-Methods', "POST, GET, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Expose-Headers", "Content-Length,X-Csrf-Token");
    res.send();
});

app.use(express.json());
// Use controllers for specific routes
app.use('/', elbController);
app.use('/api/v1', wishlistController);
app.use('/api/v1', wishlistCheckoutController);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});