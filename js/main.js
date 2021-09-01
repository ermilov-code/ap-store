// ======================================================

const products = [

    {id: 1, title: 'Apple iPhone XR, 128 ГБ, белый', price: "44 990",  oldPrice: "52 990 ₽", img: "img/1-AppleiPhoneXR,128ГБ,белый,52990₽.png"},

	{id: 4, title: 'Apple iPhone XR, 128 ГБ, (PRODUCT)RED', price: "44 990", oldPrice: "52 990 ₽", img: "img/4-AppleiPhoneXR,128ГБ,(PRODUCT)RED,52990₽.png"},

	{id: 2, title: 'Apple iPhone 11, 256 ГБ, фиолетовый', price: "67 990", oldPrice: "", img: "img/2-AppleiPhone11,256ГБ,фиолетовый,67990₽.png"},

	{id: 6, title: 'Apple iPad 10,2 Wi-Fi 32 ГБ, золотой', price: "29 990", oldPrice: "", img: "img/6-AppleiPad10,2Wi-Fi32ГБ,золотой,29990₽.png"},

	{id: 3, title: 'Apple iPad Pro (2021) Wi-Fi+Cellular 2 ТБ', price: "219 990", oldPrice: "", img: "img/3-AppleiPadPro(2021)12,9Wi-Fi+Cellular2ТБ,219990₽.png"},

	{id: 5, title: 'Apple Watch Series 6, 44 мм', price: "39 490", oldPrice: "", img: "img/5-AppleWatchSeries6,44мм,39490₽.png"},

	{id: 7, title: 'Apple MacBook Pro 13 (M1, 2020) 8ГБ, 512 ГБ SSD', price: "137 990", oldPrice: "140 990 ₽", img: "img/7-AppleMacBookPro13(M1,2020)8ГБ,512ГБSSD,137990₽.png"},

	{id: 8, title: 'Apple iMac 24 Retina 4,5, M1, 8 ГБ, 256 ГБ SSD', price: "129 990", oldPrice: "", img: "img/8-AppleiMac24Retina4,5K,M1(8CCPU,7CGPU),8ГБ,256ГБSSD,129990₽.png"},
];



const renderProduct = (product) => {
    return `<div class="products__item">
				<h3 class="products__name">${product.title}</h3>
                <img class="products__img" src="${product.img}" alt="${product.title}">
                <div class="products__description">
                    <p class="products__price">${product.price} ₽</p>
					<p class="products__price products__price_old">${product.oldPrice}</p>
                    <button class="buy-btn">Купить</button>
                </div>
                <!-- /.products__description -->
            </div>`
};  

// ЧТО МЫ С ВАМИ СДЕЛАЛИ?
// Сократили код - сделали вывод на экран сразу в теле функции - вызываю функцию renderPage на вход передаю массив объектов - в теле мы обращаемся к нашему элементу верстки .products - и каждый элемент нашего массива item мы передаем в функцию renderProduct - получаем верстку этого элемента - map нам всегда вернет массив (но массив измененный - с версткой) - массив преобразуем в строку - и мы хоти, чтобы после каждого элемента массива не было никаких символов join('') (если указать например дефис - будет дефис)

const renderPage = list => document.querySelector('.products').innerHTML = list.map(item => renderProduct(item)).join('');


// на вход даем ей наш массив объектов 
renderPage(products);

// ======================================================




// Меню бургер на JavaScript

"use strict"

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

} else {
	document.body.classList.add('_pc');
}

// Меню бургер 
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}


// Прокрутка при клике
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}



// Меню бургер на JavaScript