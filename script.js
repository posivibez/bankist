'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

header.addEventListener('click', function () {
  message.remove();
});

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  console.log(s1coords);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();

    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav clicking fading
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const logo = document.querySelector('#logo');

const handleHover = function (e) {
  const over = e.target;

  navLinks.forEach(t => {
    if (t != over) {
      t.style.opacity = this;
    }
  });
  logo.style.opacity = this;
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

// window.addEventListener('scroll', function(){

//   if(window.pageYOffset > navHeight) {
//     console.log('trigger');
//     document.querySelector('.nav').classList.add('sticky');
//   } else if(window.pageYOffset === 0) {
//     console.log('triggerREMOVE');
//     document.querySelector('.nav').classList.remove('sticky');
//   }
// });

// const obsCallback = function (entries, observer) {
//   console.log('triggered');
//   entries.forEach(entry => {
//     console.log(entry.isIntersecting);

//     if (entry.intersectionRatio === 0) {
//       document.querySelector('.nav').classList.add('sticky');
//     } else {
//       document.querySelector('.nav').classList.remove('sticky');
//     }
//   });
// };

// const obsOptions = {
//   root: null, //if interested in entire viewport
//   threshold: 0,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(header);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//SECTION REVEAL

const sections = document.querySelectorAll('section');

//NEED TO PASS IN OBSERVER TO UNOBSERVE
const sectShow = function (entries, observer) {
  // entries.forEach(entry => {
  //   if (entry.isIntersecting) {
  //     entry.target.classList.remove('section--hidden');
  //   }
  // });

  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //UNOBSERVE
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectShow, {
  root: null,
  threshold: 0.1,
});

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//LAZY LOAD IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  //GOOD TO ONLY REMOVE BLUR FILTER AFTER IMG LOADED
  //OTHERWISE ON SLOWCONNECTION MAY SEE BLURRY BAD IMG FOR WHILE
  //UNTIL NEW IMG LOADS
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER

const slides = document.querySelectorAll('.slide');

const slider = document.querySelector('.slider');

const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');

// slides.forEach(slide => console.log(slide));
// console.log(slides);

const dotContainer = document.querySelector('.dots');

const createDots = function() {
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};

createDots();

// let count = 99;
const goToSlide = function(slide) {
  // activateDot(slide);
  slides.forEach((s,i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });

  activateDot(slide);
};

let currSlide = 0;
const totalSlides = slides.length;
goToSlide(currSlide);



const nextSlide = function() {
  if(currSlide === totalSlides - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
};

const prevSlide = function() {
  if(currSlide === 0) {
    currSlide = totalSlides - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
};

sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  console.log(e);
  if(e.key === 'ArrowLeft') prevSlide();
  if(e.key === 'ArrowRight') nextSlide();
});



function activateDot(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const dots = document.querySelectorAll('.dots__dot');

const updateDots = function(slide) {

};

//USE EVENT DELEGATION! NOT EVENT LISTENERS TO EACH ITEM
// dots.forEach((dot, i) => {
//   dot.addEventListener('click', function(){
//     goToSlide(i);
//   });
// });

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
  }
});

// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('DOM loaded', e);
// });

// //ONLY OCCURS IF DO SOMETHING ON PAGE SOME SCROLL
// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });


// const setSlides = function (slidePosition) {
  
//   slides.forEach((s, i) => {
//     s.style.transform = `translateX(${i * 100 - slidePosition * 100}%)`;
//   });

//   // if (position === 0) {
//   //   slides.forEach((s, i) => {
//   //     s.style.transform = `translateX(${i * 100}%)`;
//   //   });
//   // } else if (position === 1) {
//   // } else if (position === 2) {
//   // }
// };

// sliderBtnLeft.addEventListener('click', function () {
//   count--;
//   console.log(count % 3);

//   const position = count % 3;
//   setSlides(position);
// });

// sliderBtnRight.addEventListener('click', function () {
//   count++;
//   console.log(count % 3);

//   const position = count % 3;
//   setSlides(position);
// });

// slider.style.overflow = 'visible';

// let slidePosition = 100;
// let count = 0;
// let leftCount = 0;
// let rightCount = 0;

// slides.forEach((s, i) => (s.style.transform = `translateX(${slidePosition*i}%)`));

// sliderBtnLeft.addEventListener('click', function(){
//   count--;
//   console.log(Math.abs(count%3));

//   leftCount++;
//   const leftCountEvery3 = leftCount%3;

//   slides.forEach((s,i) => {
//     if(leftCountEvery3 === 1) {
//       s.style.transform = `translateX(${(i*100) - (leftCountEvery3 * 200)}%)`;
//     } else if(leftCountEvery3 === 2) {
//       s.style.transform = `translateX(${(i*100) - (leftCountEvery3 * 50)}%)`;
//     } else if(leftCountEvery3 === 0) {
//       s.style.transform = `translateX(${(i*100)}%)`;
//     }

//   });
// })

// sliderBtnRight.addEventListener('click', function(){
//   count++;
//   console.log(Math.abs(count%3));

//   rightCount++;
//   const rightCountEvery3 = rightCount%3;

//   slides.forEach((s,i) => {
//     s.style.transform = `translateX(${(i*100) - (rightCountEvery3 * 100)}%)`;
//   });

//   // if(countEvery3 === 1) {
//   //   slides.forEach((s,i) => {
//   //     s.style.transform = `translateX(${(i * 100) - 100}%)`;
//   //   });
//   // } else if (countEvery3 === 2) {
//   //   console.log('trigger 2');
//   //   slides.forEach((s,i) => {
//   //     s.style.transform = `translateX(${(i * 100) - 200}%)`;
//   //   });
//   // } else if (countEvery3 === 0) {
//   //   console.log('trigger 0');
//   //   console.log(slides);
//   //   slides.forEach((s,i) => {
//   //     console.log(i*100);
//   //     s.style.transform = `translateX(${i*100}%)`;
//   //   });
//   // }

// });
