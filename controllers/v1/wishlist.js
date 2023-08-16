// wishlist.js
const express = require('express');
const router = express.Router();

// Define user-related routes and handlers
router.get('/wishlist/:userId', (req, res) => {
    const wishlist = [
        {
            "product_name": "Washing machine",
            "thumbnails": [
                "https://i.ytimg.com/vi/xPITpF1YNQ0/maxresdefault.jpg",
                "https://www.shutterstock.com/shutterstock/photos/2199731701/display_1500/stock-photo-young-handsome-man-putting-dirty-laundry-into-washing-machine-winking-looking-at-the-camera-with-2199731701.jpg"
            ],
            "price_in_paise": 2000000
        }
    ]

    res.json(wishlist)
});

// Export the router
module.exports = router;