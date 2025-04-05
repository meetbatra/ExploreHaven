const from = document.querySelector('.from-date');
const to = document.querySelector('.to-date');
const priceDisplay = document.querySelector('.total-price');
const pricePerNight = parseFloat(document.querySelector('.booking-form').dataset.price);

const calculatePrice = () => {
    const fromInp = new Date(from.value);
    const toInp = new Date(to.value);
    if(fromInp && toInp && fromInp < toInp){
        const nights = Math.floor((toInp.getTime()-fromInp.getTime())/86400000);
        const totalPrice = nights * pricePerNight;
        priceDisplay.textContent = totalPrice.toLocaleString('en-IN');
    }else{
        priceDisplay.textContent = '0';
    }
}

from.addEventListener('change', calculatePrice);
to.addEventListener('change', calculatePrice);