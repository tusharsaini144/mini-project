// const User = require("../../models/user");



const allLikeButton = document.querySelectorAll('.like-button');

async function likeButton(productid,btn){
    try{
        const response = await axios({
            method: 'post',
            url: `/products/${productid}/like`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
        }); 
        // console.log(btn.childern);
        // console.log(response);
        if (btn.children[0].classList.contains('fas')) {
            btn.children[0].classList.remove('fas');
            btn.children[0].classList.add('far');
        } else {
            btn.children[0].classList.add('fas');
            btn.children[0].classList.remove('far');
        }
    }
    catch(err)
    {
        window.location.replace('/login');
        console.log(err.message);
    }
}
for (let btn of allLikeButton) {
  btn.addEventListener('click', () => {
    // console.log(btn);
    let productid = btn.getAttribute('product-id');
    // User.wishList.push(productid);
    likeButton(productid,btn);
  });
}