let slides = document.querySelectorAll('.character-carousel a');
let index = 0;

slides[0].classList.add('active');

setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}, 4000);


