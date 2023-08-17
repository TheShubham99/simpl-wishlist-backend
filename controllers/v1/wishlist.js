// wishlist.js
const express = require('express');
const router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patuuwMwGmAjND2nB.283a8c42b2e50f0ec514e62b0f6849710fac6ab3261d3eb60f86ce2850db5faa' }).base('appgcV0MxZ8v0LEL7');


router.get('/wishlist/:userId', (req, res) => {
    var wishlist = []

    const userId = req.params.userId;
    base('Wishlists').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        filterByFormula: `user_id = "${userId}"`,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        wishlist = []
        records.forEach(function (record) {
            const jsonFieldValue = record.get('product_details'); // JSON data as string
            const jsonData = JSON.parse(jsonFieldValue); // Parse the JSON string

            console.log(jsonData)

            const response = {
                id: jsonData.id,
                product_name: jsonData.product_name,
                variant_id: jsonData.variant_id,
                initial_price: 10000,
                images: [
                    "xyz.jpg",
                ],
                vendor: jsonData.vendor,
                current_price: jsonData.current_price,
                is_in_stock: true,
            }
            console.log(response)
            wishlist.push(response)
        });
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');

        res.json(wishlist)
    });
});

router.post('/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;
    const product = req.body.product
    var redirection_url = ""

    const createPayload = {
        user_id: userId,
        product_id: product.id,
        product_name: product.title,
        variant_id: product.variants[0].id,
        initial_price: parseInt(product.variants[0].price * 100),
        product_details: JSON.stringify(product)
    }

    base('Wishlists').create([
        {
            "fields": createPayload
        }
    ], function (err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function (record) {
            const wishListId = record.getId()
            redirection_url = "https://checkout.stagingsimpl.com/wishlist/" + wishListId
            res.json({ success: true, redirection_url: redirection_url })
        });
    });
})
// Export the router
module.exports = router;

// const buyNow = () =>{
//     if(document.location.href.includes("wishlist=true")){
//         const button = document.getElementById('simpl_buynow-button');

// // Simulate a button click
// button.click();
//     }
// }