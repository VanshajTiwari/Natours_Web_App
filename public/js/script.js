const stripe=Stripe('pk_test_51OrPfTSEKBr8JpNzGjqdll7by7l7g2uqavBNbpVBSHrXpeh8Bqzm2tf3AFpC4Q01QK8rgKjSNEFjCDgoPgnFDcrm00nIAracCz')
console.log(stripe);
const bookTour=async tourId=>{
    try{
        //1) Checkout Session from endpoint from API
        const session=await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        //2) create checkout form + charge crdit card
        stripe.redirectToCheckout({
            sessionId:session.data.session.id
        })
        console.log(session);
    }
    catch(err){
        console.log(err);
    }
}
const profile=document.querySelector("#profile_image_")
if(profile)
profile.addEventListener("click",(e)=>{
    document.querySelector("#profile_image").click();
});
const bookTourBtn=document.querySelector('#book-tour');

if(bookTourBtn){
    bookTourBtn.addEventListener('click',(e)=>{
        e.target.textContent="Processing...."
        const {tourId}=e.target.dataset;
        bookTour(tourId);
    })
}