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