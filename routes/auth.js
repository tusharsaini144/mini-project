const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


// router.get('/fakeuser',async (req,res)=>{

//     const user = {
//         email:'namana@gamil.com',
//         username : 'krnaman',
//     }

//     await User.register('user');
// })
router.get('/register', (req, res) => {
    
    res.render('auth/signup');
});

router.post('/register', async (req, res) => {
    

    try {
        const { username, password, email,role } = req.body;
        const user = new User({ username, email,role });
        const newUser = await User.register(user, password);

        req.login(newUser, function(err) {
            if (err){
                return next(err);
            }

            req.flash('success', 'Welcome , You are Registered Successfully');
            return res.redirect('/products');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});


router.get('/login',(req,res)=>{
    res.render('auth/login');
})

router.post('/login',
  passport.authenticate('local', { 
        failureRedirect: '/login',
        keepSessionInfo: true,// important
        failureFlash: true
  }),
    (req, res) => {

        //   console.log(req.user);
        let name = req.user.username;
        name = name[0].toUpperCase() + name.slice(1);
        req.flash('success', `Welcome Back Again!! ${name}`);

        let redirectUrl = req.session.returnUrl || '/products';
        // console.log(req.session.returnUrl);

        // Removing review string from the url -> e.g = '/products/61a0dcdca41c19fe6bce6e02/review'
        // So that we can redirect to show page to add the review again!!
        if (redirectUrl && redirectUrl.indexOf('review') !== -1) {
            redirectUrl = redirectUrl.split('/');
            redirectUrl.pop();
            redirectUrl = redirectUrl.join('/');
        }

        res.redirect(redirectUrl);
        delete req.session.returnUrl;
});



// router.get('/logout', (req, res) => {
    
//     req.logout();
    
//     res.redirect('/products');
// })
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','GoodByeee!!');
      res.redirect('/products');
    });
  });



module.exports = router;

