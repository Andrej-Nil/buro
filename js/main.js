"use strict";
const _token = getToken();
const POST = 'GET';
const GET = 'GET';
const body = document.querySelector('body');
const KEY_ESC = 27;
const mobileSearchWrap = document.querySelector('#mobileSearchWrap');
const mobileSearchBtn = document.querySelector('#searchBtn');
const elWithScrollX = document.querySelector('.sections-list');
const mainCarousel = document.querySelector('#mainCarousel');
const reviews = document.querySelector('#reviews');
const slider = document.querySelector('#slider');
const mainBg = document.querySelector('.main-bg');
const footer = document.querySelector('.footer');
//обертка для кнопки ввер up-btn
const up = document.querySelector('#up');
//кнопкa ввер up-btn
const upBtn = document.querySelector('#upBtn');
const forms = document.querySelectorAll('.form');

const bgModal = document.querySelector('#shading'); // темный фон окон
const faqModal = document.querySelector('#faqModal'); // темный фон faqModalBg
const closeFaqBtns = document.querySelectorAll('.close-faq-btn');
const application = document.querySelector('#application'); // Онлайн заявка(btn)
const applicationForm = document.querySelector('#applicationForm'); // Онлайн заявка(btn)
const applicationModal = document.querySelector('#applicationModal');// онлайн заявка(окно)
const applicationThanks = document.querySelector('#applicationThanks');// успех(окно)
const order = document.querySelector('#order') // заказ(окно)
const orderForm = document.querySelector('#orderForm');
const orderQuantityInput = document.querySelector('#orderQuantity');
const basket = document.querySelector('#basket');
const basketForm = document.querySelector('#basketForm');
const incQuantityBtn = document.querySelector('#incQuantity');
const decQuantityBtn = document.querySelector('#decQuantity');
const orderPrice = document.querySelector('#orderPrice');
const orderBtns = document.querySelectorAll('.product-card__btn'); // заказ(btn);
const faqForm = document.querySelector('#faqForm');
const faqFormBtn = document.querySelector('#faqFormBtn'); // faq-form (btn)
const dropdownWraps = document.querySelectorAll('.dropdown-wrap');
const mobileMenu = document.querySelector('#mobileNav');
const mobileMenuOpenBtn = document.querySelector('#burgerBtn');
const mobileMenuCloseBtn = document.querySelector('#mobileMenuClose');
const closeBtn = document.querySelectorAll('.close-btn'); // кнопки закрытия модельных окон
const callbackFormModal = document.querySelector('#callbackFormModal')
const callbackForm = document.querySelector('#callbackForm');
const callbackClose = document.querySelectorAll('.callback-close');
const callbackOpenBtn = document.querySelector('#callbackBtn');
const sensitivity = 20; // кол пикселей для регистрации движения
let touchStart = null; // начало движение по сенсеру
let touchPosition = null; // растояние пройденое по сенсеру

const regTel = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/;// проверка телефона
const regMail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;// Проверка на емаил

// Добовляем функцию открытия и закрытия поиска
mobileSearchBtn.addEventListener('click', showSearch);

// Добовлям фунцию для смены позиции mainBg
//window.addEventListener('scroll', changePosition);
// Добовлям фунцию для отображекния эл.
// с кнопкой upBtn
window.addEventListener('scroll', showUp);

document.addEventListener('click', addFavorite);
document.addEventListener('click', addBasket);
document.addEventListener('click', renderOrderCart);

if (basket) {
  basket.addEventListener('click', removeBasketCard);
  basket.addEventListener('click', counterCard);
  basket.addEventListener('input', sendValue);
  //basket.addEventListener('input', (e) => {
  //  debounce(sendValue, 500, e);
  //});
}




async function sendValue(e) {

  const input = e.target.closest('[data-input]');
  if (!input) {
    return;
  }
  const api = input.dataset.link;
  const id = input.dataset.id;
  const card = input.closest('[data-product-card]');
  const msg = card.querySelector('[data-card-msg]');
  const data = {
    '_token': _token,
    'id': id,
  }
  const totalBasketCount = document.querySelector('#totalBasketCount');
  const totalBasketPrice = document.querySelector('#totalBasketPrice');
  let response = null;


  const value = input.value.trim();
  if (isNaN(value)) {
    msg.classList.add('basket-card__msg--is-show');
    msg.innerHTML = 'Введите число';
    return;
  }

  if (value <= 0) {
    input.value = 1;
    msg.classList.remove('basket-card__msg--is-show');
  }

  data.count = value;
  response = await getData(POST, data, api);

  if (!response.res) {
    msg.classList.add('basket-card__msg--is-show');
    msg.innerHTML = response.desc;
    return;
  }

  msg.classList.remove('basket-card__msg--is-show');
  input.value = response.count;

  totalBasketCount.innerHTML = response.card.count;
  totalBasketPrice.innerHTML = response.card.total_price;
}

async function counterCard(e) {
  const btn = e.target.closest('[data-count-btn]');
  if (!btn) {
    return;
  }
  const totalBasketCount = document.querySelector('#totalBasketCount');
  const totalBasketPrice = document.querySelector('#totalBasketPrice');
  const card = btn.closest('[data-product-card]');
  const msg = card.querySelector('[data-card-msg]');
  const counter = btn.closest('[data-counter]');
  const id = counter.dataset.id;
  const api = counter.dataset.link;
  const input = counter.querySelector('[data-input]');
  const value = input.value;
  let res = 0;
  let response = null;
  const data = {
    '_token': _token,
    'id': id,
  };

  input.addEventListener('input', sendValue);
  if (btn.hasAttribute('data-inc')) {

    res = +value + 1;
    data.count = res;
    response = await getData(POST, data, api);

    if (!response.res) {
      console.log(msg)
      msg.classList.add('basket-card__msg--is-show');
      msg.innerHTML = response.desc;
      return;
    }
    input.value = response.count;
    msg.classList.remove('basket-card__msg--is-show');
    totalBasketCount.innerHTML = response.card.count;
    totalBasketPrice.innerHTML = response.card.total_price;
  }
  if (btn.hasAttribute('data-dec')) {
    res = value - 1;
    if (res <= 0) {
      input.value = 1
      return
    }

    data.count = res;
    response = await getData(POST, data, api);
    if (!response.res) {
      console.log(msg)
      msg.classList.add('basket-card__msg--is-show');
      msg.innerHTML = response.desc;
      return;
    }
    input.value = response.count;
    msg.classList.remove('basket-card__msg--is-show');
    totalBasketCount.innerHTML = response.card.count;
    totalBasketPrice.innerHTML = response.card.total_price;
  }
}

async function removeBasketCard(e) {
  const btn = e.target.closest('[data-remove]');
  if (!btn) {
    return;
  }
  const card = btn.closest('[data-product-card]');
  const basketList = document.querySelector('#basketList');
  const totalBasketCount = document.querySelector('#totalBasketCount');
  const totalBasketPrice = document.querySelector('#totalBasketPrice');
  const api = btn.dataset.link;
  const id = btn.dataset.id;
  const data = {
    '_token': _token,
    'id ': id
  }
  const response = await getData(POST, data, api);

  if (response.res) {
    totalBasketCount.innerHTML = response.card.count;
    totalBasketPrice.innerHTML = response.card.total_price.toLocaleString();
    basketList.removeChild(card);
  }

}

if (basketForm) {
  basketForm.addEventListener('submit', (e) => {
    e.preventDefault()
  })
  sendBasketForm()
}

function sendBasketForm() {
  const inputTel = basketForm.querySelector('[name="tel"]');
  const inputMail = basketForm.querySelector('[name="mail"]');
  const inputName = basketForm.querySelector('[name="name"]');
  const submit = basketForm.querySelector('#subminBasket');
  inputTel.addEventListener('blur', () => {
    const value = inputTel.value.trim();
    const res = regexСheck(value, regTel);

    if (!res) {
      inputTel.classList.add('basket-form__input--is-error')
    }
    if (res) {
      inputTel.classList.remove('basket-form__input--is-error')
    }
  })

  inputMail.addEventListener('blur', () => {
    const value = inputMail.value.trim();
    const res = regexСheck(value, regMail);
    if (!res) {
      inputMail.classList.add('basket-form__input--is-error')
    }
    if (res) {
      inputMail.classList.remove('basket-form__input--is-error')
    }
  })

  submit.addEventListener('click', sendBasket)

  async function sendBasket() {
    const api = submit.dataset.link;
    const valueTel = inputTel.value.trim();
    const valueMail = inputMail.value.trim();
    const basketList = document.querySelector('#basketList');
    const basketFormMsg = basketForm.querySelector('#basketFormMsg');
    const totalBasketCount = document.querySelector('#totalBasketCount');
    const totalBasketPrice = document.querySelector('#totalBasketPrice');
    let response = null;
    let res = true;
    let data = null;
    if (!valueTel) {
      inputTel.classList.add('basket-form__input--is-error');
      res = false;
    } else {
      res = regexСheck(valueTel, regTel) && res;
      if (!res) {
        inputTel.classList.add('basket-form__input--is-error');
      }
    }

    if (!valueMail) {
      res = false;
      inputMail.classList.add('basket-form__input--is-error')
    } else {
      res = regexСheck(valueMail, regMail) && res;
      if (!res) {
        inputMail.classList.add('basket-form__input--is-error');
      }
    }


    if (!res) {
      return
    }

    data = new FormData(basketForm);
    data.append('_token', _token);

    response = await getData(POST, data, api)

    if (response.rez) {
      inputTel.value = ''
      inputTel.classList.remove('basket-form__input--is-error');
      inputMail.value = ''
      inputMail.classList.remove('basket-form__input--is-error');
      inputName.value = ''
      inputName.classList.remove('basket-form__input--is-error');
      basketFormMsg.innerHTML = response.desc;
      basketFormMsg.classList.add('basket-form__message--is-show');
      basketList.innerHTML = '<p class="basket__empty">Ваша корзина пустая</p>';
      totalBasketCount.innerHTML = 0;
      totalBasketPrice.innerHTML = 0;
    } else {
      basketFormMsg.innerHTML = response.desc;
      basketFormMsg.classList.add('basket-form__message--is-show');
    }



  }
}



// Добовлям фунцию для прокрутки сраницы вверх
upBtn.addEventListener('click', goUp);
let timeOut;
function goUp() {
  let top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  if (top > 0) {
    window.scrollBy(0, -150);
    timeOut = setTimeout('goUp()', 5);
  } else clearTimeout(timeOut);
}
// Обрезаем длину ссылок в популярных разделай 
strLength('sections-card__link-item', 20);
//strLength('sections-card__title', 34);

applicationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  applicationFormCheck();
});

callbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  callbackFormCheck();
});




if (faqForm) {
  faqForm.addEventListener('submit', (e) => {
    e.preventDefault()
    faqFormCheck()
  })
}
if (order) {
  //Добовляем функции для проверки формы
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault()
    orderFormCheck()
  })

  order.addEventListener('click', removeOrderCard);




  //Добовляем функцию для окраничение ввода в поле количесво товоров
  orderQuantityInput.addEventListener('input', () => {

    setValueCountInput(0)
  });

  //Добовляем функцию для увеличение и уменьшения кол т оваров
  incQuantity.addEventListener('click', increase);
  decQuantity.addEventListener('click', decrease);
}

mobileMenuOpenBtn.addEventListener('click', openMobileMenu);
mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);

//Карусели
if (mainCarousel) {
  mainSlider(mainCarousel, true);
  window.addEventListener(`resize`, () => {
    setHeadingSlider();
  }, false);
}

if (reviews) {
  setHeightreviewSlide()
  mainSlider(reviews)
  window.addEventListener(`resize`, () => {
    setHeightreviewSlide();
  }, false);
}

//Начало slider
if (slider) {
  const slidesWrap = slider.querySelector('#slidesWrap'); // обертка слайдов
  const slides = slider.querySelectorAll('.slider__item'); // слайды
  //isMoving флаг для отслежевание прогресса события transitionend
  //при управлении slidesWrap стрелками
  let isMoving = false;
  let idxActiveSlide = getIndexActiveEl(slides, "slider__item--is-active"); // индех активного слайда
  const dots = slider.querySelectorAll('.slider__dot');

  const fullPicSlider = slider.querySelector('#fullPic');
  const fullPicSlides = slider.querySelectorAll('.full-pic__item');
  const fullPicCloseBtns = slider.querySelectorAll('.full-pic__close');
  slidesWrap.addEventListener('transitionend', movingEvent); // отслеживает окончание движение слайда

  const playBtns = fullPicSlider.querySelectorAll('.full-pic__play');


  const arrowPrev = slider.querySelector('#prevSlide'); // стрелка влево
  const arrowNext = slider.querySelector('#nextSlide'); // стрелка вправо

  const fullPicPrev = slider.querySelector('#fullPicPrev'); // стрелка влево
  const fullPicNext = slider.querySelector('#fullPicNext'); // стрелка вправо

  setCurrentSlide();

  setTotalSlides();

  setBgModalHeight(fullPicSlider);

  window.addEventListener(`resize`, () => {
    setBgModalHeight(fullPicSlider);
  }, false);



  arrowPrev.addEventListener('click', prevSlide);
  arrowNext.addEventListener('click', nextSlide);

  fullPicPrev.addEventListener('click', prevSlide);
  fullPicNext.addEventListener('click', nextSlide);

  slidesWrap.addEventListener('touchstart', function (e) { startTouchMove(e) });
  // Отслеживает путь и растояние
  slidesWrap.addEventListener('touchmove', function (e) { touchMove(e) });
  // Окончание движение
  slidesWrap.addEventListener('touchend', function () { touchEnd(nextSlide, prevSlide) });

  // добовляем dots функцию навигации по слайдам
  Array.from(dots).forEach((el, idx) => {
    el.addEventListener('click', () => {
      dotsManagement(idx)
    })
  });

  // Добовляем функцию на аткытие полного каруели с полным изображением текущего слайда
  Array.from(slides).forEach((el, idx) => {
    el.addEventListener('click', () => {
      showFullPicSlider(idx)
    })
  });
  // Добовляем функцию закытие FullPicSlider
  Array.from(fullPicCloseBtns).forEach((el) => {
    el.addEventListener('click', closeFullPicSlider)
  });

  // Добовляем функцию закытие FullPicSlider нажатием esc
  document.addEventListener('keydown', (e) => {
    if (e.keyCode == KEY_ESC) {
      closeFullPicSlider();
    }
  });

  fullPicPrev.addEventListener('click', () => {
    showCurrentFullPic(idxActiveSlide)
  });
  fullPicNext.addEventListener('click', () => {
    showCurrentFullPic(idxActiveSlide)
  });

  // добовляем функции play
  Array.from(playBtns).forEach((el) => {
    el.addEventListener('click', () => {
      playMovie(el)
    })
  });

  Array.from(fullPicSlides).forEach((el) => {
    const movie = el.querySelector('video');
    if (movie) {
      movie.addEventListener('click', () => {
        stopMovie(movie)
      })
    }

  });



  //вывод номера текущего слайда
  function setCurrentSlide() {
    const currentSlide = document.querySelector('#currentSlide');
    currentSlide.innerHTML = idxActiveSlide + 1;
  }

  //вывод общего количество слайдев
  function setTotalSlides() {
    const totalSlides = slider.querySelector('#totalSlide');
    totalSlides.innerHTML = slides.length;
  }

  // проверяет наличие класса в noteList
  // и возвращает индекс
  function getIndexActiveEl(noteList, className) {
    let index = 0;
    Array.from(noteList).forEach((item, idx) => {
      if (item.classList.contains(className)) {
        index = idx;
        return;
      }
    })

    return index;
  }

  // устанавливает активный класс
  function setActiveEl(noteList, idx, className) {
    Array.from(noteList).forEach((item) => {
      item.classList.remove(className);
    })
    noteList[idx].classList.add(className);
    setCurrentSlide();
  }

  // функции навигации карусалью
  function prevSlide() {

    const stepWidth = slides[1].offsetWidth;
    const coorSlidesWrap = slidesWrap.getBoundingClientRect();
    const coorCarousel = slider.getBoundingClientRect();

    if (coorSlidesWrap.left >= coorCarousel.left) {
      return;
    }
    if (isMoving) {
      return;
    }
    isMoving = true;
    idxActiveSlide -= 1;
    setActiveEl(slides, idxActiveSlide, "slider__item--is-active");
    slidesWrap.style.left = (parseInt(getComputedStyle(slidesWrap)['left'], 10) + stepWidth) + 'px';
    setActiveEl(dots, idxActiveSlide, 'slider__dot--is-activ');
    moveDots();
  }

  function nextSlide() {
    const stepWidth = slides[1].offsetWidth;

    if (idxActiveSlide + 1 >= slides.length) {
      return;
    }
    if (isMoving) {
      return;
    }
    isMoving = true;
    idxActiveSlide += 1;
    setActiveEl(slides, idxActiveSlide, "slider__item--is-active");
    slidesWrap.style.left = (parseInt(getComputedStyle(slidesWrap)['left'], 10) - stepWidth) + 'px';
    setActiveEl(dots, idxActiveSlide, 'slider__dot--is-activ');
    moveDots();
  }

  // функции навигации карусалью точками
  function dotsManagement(idx) {
    const stepWidth = slides[1].offsetWidth;
    const shift = idx * stepWidth;
    idxActiveSlide = parseInt(idx);

    setActiveEl(dots, idx, 'slider__dot--is-activ');
    setActiveEl(slides, idx, "slider__item--is-active");
    slidesWrap.style.left = -shift + 'px';
    moveDots();
  }

  // Меняет значения флага
  function movingEvent() {
    isMoving = false;
  }

  // функция прокрутки точек
  function moveDots() {
    const dotsWidth = dots[0].offsetWidth;
    const matginR = getComputedStyle(dots[0]).marginRight;
    const step = (dotsWidth + parseInt(matginR));
    const totalStep = idxActiveSlide - 1;
    const shift = totalStep * step;
    const dotsWrap = slider.querySelector('#sliderDotsWrap');
    if (idxActiveSlide < 1) {
      return;
    }

    if (dots.length - 2 < idxActiveSlide) {
      return;
    }
    dotsWrap.style.left = -shift + 'px';

  }

  function showFullPicSlider(idx) {
    fullPicSlider.classList.add('full-pic--is-active');
    showCurrentFullPic(idx);
  }

  // закрываем блок с понорозмерными эл
  function closeFullPicSlider() {
    fullPicSlider.classList.remove('full-pic--is-active')
    Array.from(fullPicSlides).forEach((el) => {
      el.classList.remove('full-pic__item--is-active');
      if (el.querySelector('video')) {
        el.querySelector('video').pause();
      }
    })
  }
  //Показать полную версию картинки и текушего слайда
  function showCurrentFullPic(idx) {
    Array.from(fullPicSlides).forEach((el) => {
      el.classList.remove('full-pic__item--is-active');
      if (el.querySelector('video')) {
        el.querySelector('video').pause();
      }
    })

    fullPicSlides[idx].classList.add('full-pic__item--is-active');
  }
}

function mainSlider(el, autoplay) {
  let moving = false;
  // слайды
  let slides = el.querySelectorAll('.main-slider__item');
  let newSlides = null;
  let newLastIdx = null;

  // индекс последнего слайда
  const lastIdx = slides.length - 1;
  //эл. управления
  const reviewNext = el.querySelector('.main-slider__next');
  const reviewPrev = el.querySelector('.main-slider__prev');


  if (slides.length < 3) {
    let firstSlideCopy = slides[0].cloneNode(true);
    let lastSlideCopy = slides[lastIdx].cloneNode(true);
    slides[lastIdx].after(firstSlideCopy);
    slides[0].before(lastSlideCopy);

    newSlides = el.querySelectorAll('.main-slider__item');
    newLastIdx = newSlides.length - 1;
    //добовляем активный класс
    newSlides[1].classList.add('main-slider__item--is-active');
    //добовляем который переносит слайде вправо от лнка карусели
    newSlides[0].classList.add('main-slider__item--is-right');
    // Вырезаем последний слай и ставим его вперед
  } else {

    slides[0].before(slides[lastIdx]);

    newSlides = el.querySelectorAll('.main-slider__item');
    newLastIdx = newSlides.length - 1;
    newSlides[0].classList.add('main-slider__item--is-right');
    newSlides[1].classList.add('main-slider__item--is-active');

  }

  setHeadingSlider()



  if (reviewNext) {
    reviewNext.addEventListener('click', next);
  }
  if (reviewPrev) {
    reviewPrev.addEventListener('click', prev);
  }



  //Начало движения
  el.addEventListener('touchstart', function (e) { startTouchMove(e) });
  // Отслеживает путь и растояние
  el.addEventListener('touchmove', function (e) { touchMove(e) });
  // Окончание движение
  el.addEventListener('touchend', function () { touchEnd(next, prev) });

  function prev() {
    if (moving) {
      return;
    }
    moving = true;
    let slides = el.querySelectorAll('.main-slider__item');
    slides[0].classList.remove('main-slider__item--is-right');
    slides[0].classList.add('main-slider__item--is-active');
    slides[1].classList.remove('main-slider__item--is-active');
    setHeadingSlider()
    setTimeout(() => {
      slides[newLastIdx].classList.add('main-slider__item--is-right');
      slides[0].before(slides[newLastIdx]);
      moving = false;
    }, 200)


  }

  function next() {
    if (moving) {
      return
    }
    moving = true;
    let slides = el.querySelectorAll('.main-slider__item');

    slides[1].classList.add('main-slider__item--is-right');
    slides[1].classList.remove('main-slider__item--is-active');
    slides[2].classList.add('main-slider__item--is-active');
    setHeadingSlider()
    setTimeout(() => {
      slides[0].classList.remove('main-slider__item--is-right');
      slides[newLastIdx].after(slides[0]);
      moving = false;
    }, 200)

  }

  if (autoplay) {
    const interval = +el.getAttribute('data-interval') * 1000
    setInterval(() => {
      next()
    }, interval)
  }

}

// Запускаем видео
function playMovie(el) {
  const parent = el.closest('.full-pic__item');
  const movie = parent.querySelector('video');
  el.classList.add('full-pic__play--is-hide');
  movie.play();
}

function stopMovie(el) {
  const parent = el.closest('.full-pic__item');
  const playBtn = parent.querySelector('.full-pic__play')
  playBtn.classList.remove('full-pic__play--is-hide');
  el.pause();
}

//Конец slider

// Управление каруселью сенсером
// Начало движения
function startTouchMove(e) {
  touchStart = e.changedTouches[0].clientX;
  touchPosition = touchStart;
}

//Отслеживает джижение
function touchMove(e) {
  touchPosition = e.changedTouches[0].clientX;
}

// Конец движения
function touchEnd(next, prev) {
  let distance = touchStart - touchPosition;
  if (distance > 0 && distance >= sensitivity) {
    next();
  }
  if (distance < 0 && distance * -1 >= sensitivity) {
    prev();
  }
}


//Открытие и закрытие модульных окон

//Устанавливает высоту bgModal
setBgModalHeight(bgModal);

window.addEventListener(`resize`, () => {
  setBgModalHeight(bgModal);
  //setBgModalHeight(callbackFormBg);
  adaptDropdownsHeight();
}, false);
if (faqModal) {
  window.addEventListener(`resize`, () => {
    setBgModalHeight(faqModal);
  }, false);
}


// добовляем фунцию отктрытия окна онлайн заявки
application.addEventListener('click', () => {
  showModal(applicationModal)
});

// добовляем фунцию отктрытия окна заказ
Array.from(orderBtns).forEach((el) => {
  el.addEventListener('click', () => { showModal(order) });
});

// Добовляем функцию закрытия для модульных окон
Array.from(closeBtn).forEach((el) => {
  el.addEventListener('click', () => { closeModal(el) });
});

// Добовляем функцию открытия callbackModal
callbackOpenBtn.addEventListener('click', callbackModalOpen)

// Добовляем функцию закрытия callbackModal
Array.from(callbackClose).forEach((el) => {
  el.addEventListener('click', callbackModalClose);
});


//окно faq
if (faqModal) {
  setBgModalHeight(faqModal);
  window.addEventListener(`resize`, () => {
    setBgModalHeight(faqModal);
  }, false);

  // добовляем фунцию отктрытия окна faq
  faqFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showFaqModal();
  })
}

// добовляем фунцию закрытия окна faq
Array.from(closeFaqBtns).forEach((el) => {
  el.addEventListener('click', () => { closeFaqModal() });
});


// Устанавливает высоту bgModal
function setBgModalHeight(idbgModal) {
  idbgModal.style.height = window.innerHeight + 'px';
}


//Функция открытия модульного faq
function showFaqModal() {
  const questInput = faqForm.querySelector('#questInput');
  const faqFormError = faqForm.querySelector('#faqFormError');
  const value = questInput.value.trim();
  faqFormError.classList.remove('error--is-show');
  if (!value) {
    faqFormError.classList.add('error--is-show');
    questInput.value = '';
    return;
  }
  faqModal.classList.add('modal--is-show')
}
//Функция закрытия модульного faq
function closeFaqModal() {
  faqModal.classList.remove('modal--is-show')
}

//callback-close Закрываем модульное окно callBack Обратная связь
// Открываем callbackModal
function callbackModalOpen() {
  callbackFormModal.classList.add('callback-form__wrap--is-show');
}
// Закрываем callbackModal
function callbackModalClose() {
  callbackFormModal.classList.remove('callback-form__wrap--is-show');
}
//Функция открытия модульного окна
function showModal(idModal) {
  bgModal.classList.add('shading--is-show');
  idModal.classList.add('modal--is-show');
  body.classList.add('is-no-scroll');
}

// Функция закрытия модульных окон
function closeModal(el) {
  const modal = el.closest('.modal');
  modal.classList.remove('modal--is-show');
  bgModal.classList.remove('shading--is-show');
  body.classList.remove('is-no-scroll');
}

function openMobileMenu() {
  mobileMenu.classList.add('mobile-menu--is-open')
}
function closeMobileMenu() {
  mobileMenu.classList.remove('mobile-menu--is-open')
}


//Добовляем функцию открывае/закрывае выподающих эл
document.onclick = function (e) {
  const el = e.target;
  if (el.closest('.press-to-show')) {
    slow(el);
  }
}


// Открываем/закрываем выподоющие эл
function slow(el) {
  const dropdownWrap = el.closest('.dropdown-wrap')
  const dropdownHeader = dropdownWrap.querySelector('.press-to-show');
  const dropdown = dropdownWrap.querySelector('.dropdown');
  const hiddenEl = dropdownWrap.querySelector('.hidden-el');
  const arrow = dropdownWrap.querySelector('.arrow-show');
  const heightHiddenEl = hiddenEl.clientHeight;
  if (dropdown.classList.contains('dropdown--is-show')) {
    dropdown.style.height = '0px';
    dropdown.classList.remove('dropdown--is-show');
    arrow.classList.remove('arrow-up');
    dropdownWrap.classList.remove('is-active');
    dropdownHeader.classList.remove('is-active')
    return;
  }
  dropdown.style.height = heightHiddenEl + 'px';
  dropdown.classList.add('dropdown--is-show');
  arrow.classList.add('arrow-up');
  dropdownWrap.classList.add('is-active');
  dropdownHeader.classList.add('is-active')
}

//Адаптирует высоту dropdown 
function adaptDropdownsHeight() {

  Array.from(dropdownWraps).forEach((el) => {
    const dropdown = el.querySelector('.dropdown');
    const hiddenEl = dropdown.querySelector('.hidden-el');

    if (dropdown.classList.contains('dropdown--is-show')) {
      const dropdownHeight = hiddenEl.clientHeight;
      dropdown.style.height = dropdownHeight + 'px';
    }
  })
}

// Валидация форм
//Устанавливает заданное число при
// условии если введеное число меньше или NaN
function setValueCountInput(value) {
  const orderPrice = orderForm.querySelector('#orderPrice')
  const price = +orderPrice.getAttribute('data-price')
  const inputValue = +orderQuantityInput.value;
  if (inputValue < 0 || isNaN(inputValue)) {
    orderQuantityInput.value = value;
    orderPrice.innerHTML = totalPrice(price, value).toLocaleString();
    return;
  }
  orderPrice.innerHTML = totalPrice(price, inputValue).toLocaleString();
}


function applicationFormCheck() {
  hideErrorMessages(applicationForm);
  applicationInputsCheck();
}

function applicationInputsCheck() {
  const error = applicationForm.querySelector('.phone')
  const inputs = applicationForm.querySelectorAll('input');
  const applicationTel = applicationForm.querySelector('#applicationTel')
  const value = applicationTel.value
  const success = regexСheck(value, regTel);
  if (isEmptyValue(inputs, applicationForm)) {
    return;
  }
  if (success) {
    applicationFormSend()
  } else {
    error.classList.add('error--is-show');
  }
}

function applicationFormSend() {
  const formData = new FormData(applicationForm);
  const xhr = new XMLHttpRequest();
  formData.append("_token", _token);
  xhr.open(POST, applicationForm.action);
  xhr.send(formData);

  xhr.onload = function () {
    if (xhr.status != 200) {
      noSend(applicationForm);
      console.log('Ошибка: ' + xhr.status);
      return;
    } else {
      let response = JSON.parse(xhr.response);
      if (response == 1) {
        applicationThanks.classList.add('modal--is-show');
        applicationModal.classList.remove('modal--is-show');
        clearInputs(inputs);
        console.log("Форма отправилась");
      } else {
        noSend(applicationForm);
        console.log("Неудачная отправка");
      }
    }
  };

  xhr.onerror = function () {
    console.log('Неудачная отправка');
  };

}

function callbackFormCheck() {
  hideErrorMessages(callbackForm);
  callbackInputsCheck();
}

function callbackInputsCheck() {
  const inputs = callbackForm.querySelectorAll('input');
  const phoneEroor = callbackForm.querySelector('.phone');
  const mailEroor = callbackForm.querySelector('.mail');
  const callbackTel = callbackForm.querySelector('#callbackTel');
  const callbackMail = callbackForm.querySelector('#callbackMail');
  let validEmail = true;
  let validTel = true;

  if (isEmptyValue(inputs, callbackForm)) {
    return;
  }

  if (!regexСheck(callbackTel.value, regTel)) {
    phoneEroor.classList.add('error--is-show');
    validTel = false;
  }

  if (!regexСheck(callbackMail.value, regMail)) {
    mailEroor.classList.add('error--is-show');
    validEmail = false;
  }

  if (validEmail && validTel) {
    callbackFormSend()
  }
}

function callbackFormSend() {
  const formData = new FormData(callbackForm);
  const xhr = new XMLHttpRequest();
  formData.append("_token", _token);
  xhr.open(POST, callbackForm.action);
  xhr.send(formData);
  xhr.onload = function () {
    if (xhr.status != 200) {
      noSend(callbackForm);
      console.log('Ошибка: ' + xhr.status);
      return;
    } else {
      let response = JSON.parse(xhr.response);
      if (response == 1) {
        console.log("Форма отправилась");

      } else {
        console.log("Неудачная отправка");
      }
    }
  };

  xhr.onerror = function () {
    console.log('Неудачная отправка');
  };
}

function faqFormCheck() {
  hideErrorMessages(faqForm);
  faqInputsCheck();
}
function faqInputsCheck() {
  const error = faqForm.querySelector('.mail')
  const inputs = faqForm.querySelectorAll('input');
  const faqMailInput = faqForm.querySelector('#faqMail');
  const value = faqMailInput.value;
  const success = regexСheck(value, regMail);
  if (isEmptyValue(inputs, faqForm)) {
    return;
  }
  if (success) {
    faqFormSend();
  } else {
    error.classList.add('error--is-show');
  }
}

function faqFormSend() {
  const formData = new FormData(faqForm);
  formData.append("_token", _token);
  const xhr = new XMLHttpRequest();
  xhr.open(POST, faqForm.action);
  xhr.send(formData);
  xhr.onload = function () {
    if (xhr.status != 200) {
      noSend(faqForm);
      console.log('Ошибка: ' + xhr.status);
      return;
    } else {
      let response = JSON.parse(xhr.response);
      if (response == 1) {
        const faqThanks = bgModal.querySelector('#faqThanks');
        bgModal.classList.add('shading--is-show');
        faqThanks.classList.add('modal--is-show');
        faqModal.classList.remove('modal--is-show');
        clearInputs(inputs);
        console.log("Форма отправилась");
      } else {
        noSend(faqForm);
        console.log("Неудачная отправка");
      }
    }
  };

  xhr.onerror = function () {
    console.log('Неудачная отправка');
  };
}
function orderFormCheck() {
  hideErrorMessages(orderForm);
  orderInputsCheck();
}

function orderInputsCheck() {
  const mailOrTel = orderForm.querySelector('#mailOrTel');
  const orderFormInputs = orderForm.querySelectorAll('.input');
  const errorMail = orderForm.querySelector('#errorMail');
  const errorTel = orderForm.querySelector('#errorTel');
  const inputMail = orderForm.querySelector('#inputMail');
  const inputTel = orderForm.querySelector('#inputTel');
  const mailValue = inputMail.value.trim();
  const telValue = inputTel.value.trim();
  const resCheckMail = regexСheck(mailValue, regMail);
  const resCheckTel = regexСheck(telValue, regTel);
  let resCheck = true;
  if (!resCheckMail) {
    if (mailValue) {
      errorMail.classList.add('error--is-show');
      resCheck = false
    }
  }

  if (!resCheckTel) {
    if (telValue) {
      errorTel.classList.add('error--is-show');
      resCheck = false
    }
  }

  if (!(mailValue || telValue)) {
    mailOrTel.classList.add('error--is-show');
    resCheck = false
  }

  if (resCheck) {
    sendOrderForm();
  }


  function sendOrderForm() {
    const card = orderForm.querySelector('[data-order-card]');
    const orderItem = orderForm.querySelector('[data-order-item]');
    const orderCounter = orderForm.querySelector('[order-counter]');
    const id = card.getAttribute('id');
    const formData = new FormData(orderForm);
    formData.append('_token', _token);
    formData.append('id', id);

    const xhr = new XMLHttpRequest();
    xhr.open(POST, orderForm.action);
    xhr.send(formData);
    xhr.onload = function () {
      if (xhr.status != 200) {
        noSend(orderForm);
        console.log('Ошибка: ' + xhr.status);
        return;
      } else {
        let response = JSON.parse(xhr.response);
        if (response == 1) {
          order.classList.remove('modal--is-show');
          applicationThanks.classList.add('modal--is-show');
          console.log("Форма отправилась");
          clearInputs(orderFormInputs);
          orderCounter.value = 1;
          orderItem.innerHTML = '';
        } else {
          noSend(orderForm);
          console.log("Неудачная отправка");
        }
      }
    };

    xhr.onerror = function () {
      console.log('Неудачная отправка');
    };

  }
}

function noSend(form) {
  const errorMessage = form.querySelector('.no-send');
  errorMessage.classList.add('error--is-show');
}

// Провекрка на пустое значение инпута
function isEmptyValue(inputs, form) {
  const emptyError = form.querySelector('.empty');
  let isEmpty = false;
  Array.from(inputs).forEach((el) => {
    if (!el.value.trim()) {
      emptyError.classList.add('error--is-show');
      isEmpty = true;
    }
  })
  return isEmpty;
}


// Проверка на регулярным выражением
function regexСheck(value, reg) {
  return reg.test(value)
}

// Прячем сообщения с ошибками
function hideErrorMessages(form) {
  const errorMessage = form.querySelectorAll('.error');
  Array.from(errorMessage).forEach((el) => {
    el.classList.remove('error--is-show');
  })
}

//Очищаем инпуты
function clearInputs(inputs) {
  Array.from(inputs).forEach((el) => {
    if (el.type === 'submit') {
      return;
    }
    el.value = '';
  })
}

// яндеск карта
const yandexmap = document.querySelector('#yandexmap'); // блок отображающий карту
if (yandexmap) {
  let map;
  let marker;
  const dataCoord = yandexmap.getAttribute('data-coord')
  const coordinates = dataCoord.split(',');

  function initMap() {
    map = new ymaps.Map("yandexmap", {
      center: coordinates,
      zoom: 16
    });
    marker = new ymaps.Placemark(coordinates, {
      hintContent: 'Расположение',
      balloonContent: 'Это наша организация'
    });
    map.geoObjects.add(marker);
  }
  ymaps.ready(initMap);
}

//возвращает ширину елемента
function getWidthEl(el) {
  return el.clientWidth;
}

//Открывает, закрывает строку тпоиска для мобильной версии
function showSearch() {
  mobileSearchWrap.classList.toggle('search-mobile--is-hide'
  );
}

// функия смены свойство position  mainBg
function changePosition() {
  const mainBgCoord = mainBg.getBoundingClientRect();
  const footerCoord = footer.getBoundingClientRect();
  // Взависимости от условия 
  if (footerCoord.y <= mainBgCoord.height) {
    // позиция absolute для прижития bg  к футеру
    mainBg.classList.add('main-bg--absolute');
  } else {
    // позиция fixed для прижития bg к top экрана
    mainBg.classList.remove('main-bg--absolute');
  }
}

// Показывает скрывает кнопку эл
// Взависимости от прокрутки страницы
function showUp() {
  const coord = body.getBoundingClientRect()
  if (coord.top < -1000) {
    up.classList.add('up--is-show')
  } else {
    up.classList.remove('up--is-show')
  }
}

// увеличевает количество товаров и вываит итоговую цену
function increase() {
  const price = +orderPrice.getAttribute('data-price');
  const quantity = +orderQuantityInput.value + 1;
  orderQuantityInput.value = quantity;
  orderPrice.innerHTML = totalPrice(price, quantity).toLocaleString();
}
// уменьшает количество товаров и вываит итоговую цену
function decrease() {
  const price = +orderPrice.getAttribute('data-price');
  const quantity = +orderQuantityInput.value - 1;
  orderQuantityInput.value = quantity;
  if (orderQuantityInput.value < 1) {
    setValueCountInput(1);
    return;
  }

  orderPrice.innerHTML = totalPrice(price, quantity).toLocaleString();
}

function setHeightreviewSlide() {
  const reviewsSlidesWrap = reviews.querySelector('.review__slider')
  const reviewsSlide = reviews.querySelector('.review__slide')
  const heightSlide = reviewsSlide.offsetHeight;
  reviewsSlidesWrap.style.height = heightSlide + 'px';
}

function setHeadingSlider() {
  let activeSlide = mainCarousel.querySelector('.main-slider__item--is-active');
  let heightActiveSlide = activeSlide.clientHeight;
  mainCarousel.style.height = heightActiveSlide + 'px'
}

//умножает в возвращает результат
function totalPrice(numA, numB) {
  return numA * numB;
}


// Обрезает строку если больше указаной length
function strLength(classEl, length) {
  const els = document.querySelectorAll('.' + classEl);
  Array.from(els).forEach((el) => {
    const str = el.innerHTML.trim();

    if (str.length >= length) {
      const newStr = str.substr(0, length) + '...';
      el.innerHTML = newStr;
    }
  });

}

function getToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta.getAttribute('content')
}

function getData(method, data, api) {

  return new Promise(function (resolve, reject) {

    const xhr = new XMLHttpRequest();
    let response = null
    xhr.open(method, api, true);
    xhr.send(data);
    xhr.onload = function () {
      if (xhr.status != 200) {
        console.log('Ошибка: ' + xhr.status);
        return false;
      } else {
        response = JSON.parse(xhr.response);
        resolve(response);
        if (response) {
          console.log("Запрос отправлен");
        } else {
          console.log("Неудачная отправка");
        }
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network Error"))
    };
  })
}

async function addBasket(e) {

  const btn = e.target.closest('[data-add-basket]');
  if (!btn) {
    return;
  }
  const id = btn.dataset.id;
  const api = btn.dataset.link;
  let response;
  const data = {
    '_token': _token,
    'id': id
  }
  response = await getData(POST, data, api);
  console.log(response.toggle)
  setInBasketBtn(btn, response.toggle, response.desc)


}

function setInBasketBtn(el, toggle, desc) {
  const parent = el.closest('[data-product-card]');
  const iconBtn = parent.querySelector('[data-img-basket]');
  const btn = parent.querySelector('[data-btn-basket]');
  console.log(btn)
  if (btn) {
    toggleInBasketBtn(btn, toggle, desc)
  }
  if (iconBtn) {
    toggleInBasketIconBtn(iconBtn, toggle)
  }


}

function toggleInBasketIconBtn(btn, toggle = false) {
  const pathToImage = './img/icon/basket-icon.svg';
  const pathToImageActive = './img/icon/check-mark.svg';
  if (toggle) {
    btn.src = pathToImageActive;
    return;
  }
  btn.src = pathToImage;

}

function toggleInBasketBtn(btn, toggle = false, desc) {
  if (toggle) {
    btn.innerHTML = desc;
    return;
  }
  btn.innerHTML = desc;
}

async function addFavorite(e) {

  const btn = e.target.closest('[data-add-favorite]');
  if (!btn) {
    return;
  }
  const id = btn.dataset.id;
  const api = btn.dataset.link;
  let response;
  const data = {
    '_token': _token,
    'id': id
  }
  response = await getData(POST, data, api);
  console.log(response);
  setFavoriteIcon(btn, response.toggle);


}

function setFavoriteIcon(el, boolean) {
  const imgEl = el.querySelector('[data-img-favorite]');
  console.log(boolean)
  const pathToImage = './img/icon/favorite-icon.svg';
  const pathToImageActive = './img/icon/favorite-icon-active.svg';
  if (!boolean) {
    imgEl.src = pathToImage;
    return;
  }
  imgEl.src = pathToImageActive;
}

function removeOrderCard(e) {
  const orderItem = order.querySelector('[data-order-item]');
  const orderCounter = order.querySelector('[order-counter]');
  const btn = e.target.closest('[data-close-btn]');
  if (btn) {
    orderItem.innerHTML = '';
    orderCounter.value = 1;
  }
}

async function renderOrderCart(e) {
  const btn = e.target.closest('[data-fast-order]');

  if (!btn) {
    return;
  }
  const orderForm = document.querySelector("#orderForm");
  const orderItem = orderForm.querySelector("[data-order-item]");
  const price = orderForm.querySelector("[data-price]");
  const priceTotal = orderForm.querySelector("[data-price-total]");
  const api = btn.dataset.link;
  const id = btn.dataset.id;
  let response = null;
  let elStr = null;
  const data = {
    "_token": _token,
    "id": id
  }

  response = await getData(POST, data, api);
  elStr = getMarkEl(response.content[0]);
  orderItem.insertAdjacentHTML('afterbegin', elStr);
  console.log(response.content[0].sale_price);
  price.dataset.price = response.content[0].sale_price
  priceTotal.innerHTML = response.content[0].sale_price.toLocaleString();

  function getMarkEl(obj) {
    console.log(obj)
    return /*html*/`
  <div id="${obj.id}" class="order-modal__item" data-order-card>
    <img src="${obj.pic_fallback[0]}" alt="" class="order-modal__img">
    <div class="order-modal__desc">
    ${obj.title}
    </div>
  </div>
  `
  }

  console.log(elStr);
}