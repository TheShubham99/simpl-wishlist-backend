const express = require('express');
const router = express.Router();
var Airtable = require('airtable');
const axios = require('axios');
var base = new Airtable({ apiKey: 'patuuwMwGmAjND2nB.283a8c42b2e50f0ec514e62b0f6849710fac6ab3261d3eb60f86ce2850db5faa' }).base('appgcV0MxZ8v0LEL7');



router.post('/wishlist/checkout/:wishlistID', (req, res) => {
    // initiate checkout and send the url back

    const wishlistID = req.params.wishlistID;

    base('Wishlists').select({
        filterByFormula: `id = "${wishlistID}"`,
        view: "Grid view",
        maxRecords: 1
    }).firstPage((err, records) => {


        if (err) {
            console.error(err);
            return;
        }

        const productDetails = records[0].fields.product_details; // JSON data as string
        const product = JSON.parse(productDetails); // Parse the JSON string

        const productURL = records[0].fields.product_url;



        initiateCart(wishlistID, productURL, product).then((response) => {
            const redirection_url = response.data.redirection_url
            res.json({
                success: true,
                redirection_url: redirection_url
            })
        });
    })
})

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

// Export the router
module.exports = router;