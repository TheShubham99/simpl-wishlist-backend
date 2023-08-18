// wishlist.js
const express = require('express');
const router = express.Router();
var Airtable = require('airtable');
const axios = require('axios');
var base = new Airtable({ apiKey: 'patuuwMwGmAjND2nB.283a8c42b2e50f0ec514e62b0f6849710fac6ab3261d3eb60f86ce2850db5faa' }).base('appgcV0MxZ8v0LEL7');


router.get('/wishlist/:userId', (req, res) => {
    var wishlist = []

    const userId = req.params.userId;
    base('Wishlists').select({
        filterByFormula: `user_id = "${userId}"`,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        wishlist = []
        records.forEach(function (record) {
            const jsonFieldValue = record.get('product_details'); // JSON data as string
            const jsonData = JSON.parse(jsonFieldValue); // Parse the JSON string

            const response = {
                id: record.get('id'),
                product_id: jsonData.id,
                product_name: jsonData.title,
                variant_id: jsonData.variants[0].id,
                initial_price: parseInt(record.get('initial_price') * 100),
                images: [
                    jsonData.images[0].src,
                ],
                product_url: record.get('product_url'),
                vendor: jsonData.vendor,
                current_price: parseInt(jsonData.variants[0].price * 100),
                is_in_stock: record.get('is_in_stock') || false,
            }

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
    const productURL = req.body.product_url

    const createPayload = {
        user_id: userId,
        product_id: product.id,
        product_name: product.title,
        product_url: productURL,
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

            initiateCart(wishListId, productURL, product).then((response) => {
                const redirection_url = response.data.redirection_url + "&wishlist-id=" + wishListId
                res.json({
                    success: true,
                    redirection_url: redirection_url
                })

            }).catch((error) => {
                console.log(error);
            });

        });
    });
})
// Export the router
module.exports = router;

const initiateCart = (wishListId, productURL, product) => {
    let cartPayload = JSON.stringify({
        "source": "pdp",
        "unique_id": wishListId,
        "selected_variant": {
            "variant_id": product.variants[0].id,
            "quantity": 1,
            "product_url": productURL
        },
        "product": product
    });

    const urlObject = new URL(productURL);

    // Extract the base URL (protocol and domain)
    const shopDomain = urlObject.hostname;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://pi3-backend.stagingsimpl.com/api/v2/cart/initiate',
        headers: {
            'content-type': 'application/json',
            'shopify-shop-domain': shopDomain,
        },
        data: cartPayload
    };

    return axios.request(config)

}
// const buyNow = () =>{
//     if(document.location.href.includes("wishlist=true")){
//         const button = document.getElementById('simpl_buynow-button');

// // Simulate a button click
// button.click();
//     }
// }