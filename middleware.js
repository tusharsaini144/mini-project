const Product = require('./models/product');
const {productSchema} = require('./schemas')
const {reviewSchema} = require('./schemas')

module.exports.isLoggedIn = (req,res,next)=>{
    
    req.session.returnUrl = req.originalUrl;
    
    if(req.xhr && !req.isAuthenticated())
    {
        if(req.session.returnUrl)
        {
            delete req.session.returnUrl;
        }
        return res.status(401).json({msg:'You need to Login First'});
    }
    
    if(!req.isAuthenticated())
    {
        // console.log(req.session);
        req.flash('error','You need to login First!!');
        return res.redirect('/login');
    }
    
    next();

}

module.exports.validateProduct = (req,res,next)=>{

    // console.log('hi1 in validate in');
    const { name, img, desc, price } = req.body;
    const{error} =  productSchema.validate({name,img,price,desc}); 
    if(error)
    {
        const msg = error.details.map((err)=>{return err.message});
        return res.render('error',{err:msg});
    }
    // console.log('hi1 in validate after');
    next();
}


module.exports.validateReview = (req,res,next)=>{
    const {rating,comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment});

    if(error)
    {
        const msg = error.details.map((err)=>{err.message});
        return res.render('error',{err:msg});
    }

    next();
}



module.exports.isSeller = (req,res,next)=>{
    // console.log('hi1 in is seller before');
    if(!(req.user.role && req.user.role==='seller'))
    {
        req.flash('error','Access restricted!');
        console.log('hi1 in seller in middle');
        return res.redirect('/products');
    }
    // console.log('hi1 in is seller after');
    next();
}

module.exports.isProductAuthor = async (req,res,next) =>{
    // getting productid 
    const {id} = req.params;
    const product = await Product.findById(id);

    if(!product.author.equals(req.user._id))
    {
        req.flash('error','Access restricted!');
        return res.redirect(`/products/${id}`);
    }
    next();
    
}

