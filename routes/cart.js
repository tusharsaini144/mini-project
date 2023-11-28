const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const Product = require("../models/product");

const stripe = require("stripe")('sk_test_51NCgZhSGLp42UHm4pPgngGPHKynyCkkbe8oH7mFwVyGt6TozUodCPX6I3B1yLj9J6Czuah6wD88B2uQKGyo31EHH00kG40YstW');


router.get("/user/cart", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");
  const totalAmount = user.cart.reduce((sum,curr)=>sum+curr.price,0);
  res.render("cart/cart", { user ,totalAmount});
});





router.post("/user/:productid/add", isLoggedIn, async (req, res) => {
  const { productid } = req.params;
  const userid = req.user._id;
  const product = await Product.findById(productid);
  const user = await User.findById(userid);
  user.cart.push(product);
  user.save();
  res.redirect("/user/cart");
});

router.get('/checkout/:price', async(req, res) => {
  // console.log(req.params.price)
  // res.send("ok")
  const session = await stripe.checkout.sessions.create({
    payment_method_types:[
      'card',
    ],
    line_items: [{
      price_data: {
        currency: 'INR',
        product_data: {
          name: 'all items',
        },
        unit_amount: req.params.price*100,
      },
      quantity: "1",
    }],
    phone_number_collection: {
      enabled: true,
    },
    mode:'payment',
    success_url:'http://localhost:8080/orders/success',
    cancel_url:'http://localhost:8080/orders/failure'
  });
  res.redirect(303,session.url);
})




module.exports = router;