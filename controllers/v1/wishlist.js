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
            wishlist.push(jsonData)
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
        
        console.log(res)
        res.json(wishlist)
    });
});

// Export the router
module.exports = router;

// const buyNow = () =>{
//     if(document.location.href.includes("wishlist=true")){
//         const button = document.getElementById('simpl_buynow-button');

// // Simulate a button click
// button.click();
//     }
// }