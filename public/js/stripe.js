import axios from 'axios';
const stripe=Stripe('pk_test_51OJJuLSAEy6HCCWnpJLQCVDzsOIGJGoPofUxm1wGKUtO9c5AcX8ox87q4ZJxfrYuPTHHc3r7GFTOtYhwkb3FMrkr00zeNWVZNs')
export const bookTour=async tourId=>{
    try{
        //1) Checkout Session from endpoint from API
        const session=await axios(`http:127.0.0.1:8000//api/v1/bookings/checkout-session/${tourId}`);
        //2) create checkout form + charge crdit card
        stripe.redirectTocheckout({
            sessionId:session.data.session.id
        })
        console.log(session);
    }
    catch(err){
        console.log(err);
    }
}
 