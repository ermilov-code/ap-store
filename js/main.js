// ======================================================

// указываем в самом верху константу API - путь к репозиторию (файлу) - репозиторий должен быть Public - в файле json нажимаем кнопку Raw - и копируем ссылку (общую)
const API = "https://raw.githubusercontent.com/ermilov-code/ap-store/main/json"


class ProductsList {
	constructor(container = '.products') {
		this.container = container;
		// массив с товарами 
		this.goods = [];
		// массив с версткой товаров:
		this.allProducts = [];
		// указать, какой нужно вызывать метод при запуске нашего конструктора:
		// в первую очередь мы хотим заполнить наш массив товаров товарами 
		this._fetchProduct()
			.then(data => {
				this.goods = [...data];
				this.render()
			});
	}

	_fetchProduct() {
		return fetch(`${API}/catalogData.json`)
			.then(result => result.json())
			.catch(error => {
				console.log(error);
			})
	}

	// Добавьте для ProductsList метод, определяющий суммарную стоимость всех товаров.

	// ================ ВАРИАНТ ПРАВИЛЬНЫЙ:
	// многие использовали циклы, многие использовали for each

	getSum() {

		let price = this.goods.map((item) => item.price);
		console.log(price);

		// убираем пробелы в строках
		let priceNumber = price.map((item) => item.split(' ').join(''));
		console.log(priceNumber);

		// преобразуем строку в число
		let priceTypeNumber = priceNumber.map((item) => Number(item));
		console.log(priceTypeNumber);

		// reduce используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата. (в каждом массиве есть встроенное свойство)
		let res = priceTypeNumber.reduce((sum, item) => sum += item, 0);
		alert(`Суммарная стоимость всех товаров магазина = ${res} рублей`);
	}


	// список товаров отобразить  
	render() {
		// в каком элементе мы хотим помещать наши товары 
		const block = document.querySelector(this.container);
		// теперь нужно в цикле обойти наш массив товаров goods и каждый товар обернуть в верстку 
		// хотим в цикле поработать с каждым элементом массива goods (let product - каждый объект массива goods)
		// каждый товар будем передавать в конструктор класса ProductItem
		for (let product of this.goods) {
			// productObj - каждый товар (когда пишем new - вызывается конструктор)
			const productObj = new ProductItem(product);
			// наполняем наш массив товарами с версткой 
			this.allProducts.push(productObj);
			// .insertAdjacentHTML - метод вставляет в нужное место наш элемент 
			block.insertAdjacentHTML('beforeend', productObj.render());
			// block.innerHTML += productObj.render(); - эта инструкция считается плохой, т.к. она заставляет перерисовывать (каждый раз при довавлении нового элемента перерисовывается старый элемент)
		}
	}
}

// чтобы было максимально гибко и эффективно, сделаем еще один класс (для оформления товара)
class ProductItem {
	// constructor - есть у каждого класса 
	// на вход будем принимать наш объект 
	// общие свойства у всех товаров:
	constructor(product) {
		this.title = product.title;
		this.id = product.id;
		this.img = product.img;
		this.price = product.price;
		this.oldPrice = product.oldPrice;
	}

	render() {
		return `<div class="products__item">
		 	<h3 class="products__name">${this.title}</h3>
		 	<img class="products__img" src="${this.img}" alt="${this.title}">
			<div class="products__description">
				<p class="products__price">${this.price} ₽</p>
				<p class="products__price products__price_old">${this.oldPrice}</p>
				<button class="buy-btn">Купить</button>
			</div>
			<!-- /.products__description -->
		</div>`
	}
}



// 1. Добавьте пустые классы для корзины товаров и элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.
// 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.

// класс для корзины товаров
class BasketGoods {
	constructor(container = '.items-cart') {
		this.container = container;
		// массив элементов корзины:
		this.arrayCartItems = [];
		// массив с версткой элементов корзины:
		this.layoutCartItems = [];
		// хотим заполнить наш массив товарами отложенными в корзину 
		this._fetchProductCart()
			.then(data => {
				this.arrayCartItems = [...data];
				this.render()
			});
	}

	_fetchProductCart() {
		return fetch(`${API}/getBasket.json`)
			.then(result => result.json())
			.catch(error => {
				console.log(error);
			})
	}

	// добавить товары в корзину
	addGoods() {

	}

	// удалить товар из корзины 
	removeGoods() {

	}

	// изменить 
	changeGoods() {

	}

	// метод для очистки корзины
	// сумма товаров в корзине 
}










// класс для элемента корзины товаров
class basketItem {

	constructor() {

	}

	// удалить товар из корзины
	// количество товара в корзине
	// изменить количество товара в корзине 

}


let list = new ProductsList();
let listCart = new BasketGoods();


getSum33.onclick = () => list.getSum();







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