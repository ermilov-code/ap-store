// ======================================================

// указываем в самом верху константу API - путь к репозиторию (файлу) - репозиторий должен быть Public - в файле json нажимаем кнопку Raw - и копируем ссылку (общую)
const API = "https://raw.githubusercontent.com/ermilov-code/ap-store/main/json"

class List {
	constructor(url, container, list = list2) {
		this.container = container;
		this.list = list;
		this.url = url;
		this.goods = [];
		// массив allProducts - расширеный и дополненый версткой 
		this.allProducts = [];
		// метод _init() - в этом базовом классе он в виде заглушки - он нужен для подклассов (потомков) - каждый потомок этого класса должен переопределять метод _init() (это полиморфизм)
		this._init();
	}

	getJson(url) {
		// : - тернарный оператор - за счет этой конструкции мы делаем конект либо к внешнему файлу - либо к локальному файлу 
		return fetch(url ? url : `${API + this.url}`)
			// json файл преобразуем в объект result => result.json())
			.then(result => result.json())
			// а если не получилось сообщаем об ошибке 
			.catch(error => {
				console.log(error);
			})
		// после вызова getJson - мы получим объект нашей строки json (файла json)
	}

	// принимает массив товаров 
	handleData(data) {
		// массив распаковываем и помещаем в goods 
		this.goods = [...data];
		this.render();
	}

	// находим сумму всех товаров 
	calcSum() {
		return this.allProducts.reduce((accum, item) => accum += item.price, 0);
	}

	// любой из товаров нужно отобразить - метод для вывода данных - только в render мы делаем вывод в верстку наших данных 
	render() {
		const block = document.querySelector(this.container);
		for (let product of this.goods) {
			// это наш блок в верстке  
			// хотим сделать объект класса корзина или каталог 
			// к свойствам обращаемся через квадратные скобки 
			const productObj = new this.list[this.constructor.name](product);
			// мы сделали объект товара либо CartItem, либо ProductItem
			console.log(productObj);
			this.allProducts.push(productObj);
			// хотим поместить в нашу верстку то, что возвращает метод render()
			block.insertAdjacentHTML('beforeend', productObj.render());
		}
	}
	_init() {
		return false
	}
}

// класс Item - это общий (базовый) для товара (либо в корзине - либо в каталоге) - 
// общие свойства у любого товара: картинка - цена - id 
// а вот частное свойство - будет количество для корзины
class Item {
	constructor(el) {
		this.title = el.title;
		this.price = el.price;
		this.id = el.id;
		this.img = el.img;
		this.oldPrice = el.oldPrice;
	}
	// вернем верстку для нашего товара 
	// если у элемента есть дата атрибут (напр - data-id) - то мы можем к ним обращаться через dataset 
	// объект event - target 
	render() {
		return `
		<div class="products__item" data-id="${this.id}>
		 	<h3 class="products__name">${this.title}</h3>
		 	<img class="products__img" src="${this.img}" alt="${this.title}">
			<div class="products__description">
				<p class="products__price">${this.price} ₽</p>
				<p class="products__price products__price_old">${this.oldPrice}</p>
				<button class="buy-btn"
				data-id="${this.id}"
				data-title="${this.title}"
				data-price="${this.price}
				data-oldPrice="${this.oldPrice}">Купить</button>
			</div>
			<!-- /.products__description -->
		</div>
			`
	}
}

// список товаров - потомок класса List (принимает все свойства нашего базового класса)
class ProductsList extends List {
	// на вход принимаем объект класса cart - это необходимо для того, чтобы не создавать в конструкторе объект класса cart - мы можем его принимать и работать со свойствами (методами и полями) класса cart 
	constructor(cart, container = '.products', url = "/catalogData.json") {
		// вызывая super мы запускаем конструктор базового класса 
		super(url, container);
		// хотим, чтобы у списка товаров было доступно поле cart
		this.cart = cart;
		// getJson() - вызываем из нашего базового класса метод - и передаем ему наши текстовые данные из файла json 
		this.getJson()
			.then(data => this.handleData(data)); // handleData запускает отрисовку либо каталога товаров, либо списка товаров корзины
	}
	_init() {
		// как только мы нажимаем кнопку купить - вызывается метод addProduct
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target.classList.contains('buy-btn')) {
				console.log(e.target);
				// все свойства источника событий передаем
				this.cart.addProduct(e.target);
			}
		});
	}
}

class ProductItem extends Item { }

// Cart - потомок класса List 
class Cart extends List {
	constructor(container = ".items-cart", url = "/getBasket.json") {
		// super - вызываем конструктор нашего базового класса 
		super(url, container);
		this.getJson()
			.then(data => {
				this.handleData(data.contents);
			});
	}
	// element - объект кнопки 
	addProduct(element) {
		// делаем конект к нашему файлу (есть ли конект) - это можно убрать - но пример официальный - так что оставляем 
		this.getJson(`${API}/addToBasket.json`)
			.then(data => {
				if (data.result === 1) {
					// обращаемся к нашим data атрибутам нашей кнопки купить 
					// получаем id товара 
					let productId = +element.dataset['id'];
					// нужно понять есть ли такой товар уже в корзинке - если есть, то нужно увеличивать его кол-во - если нет - то нужно полностью создавать объект с этим товаром
					// в нашем массиве allProducts - вызываем метод find - на вход принимает наш объект - мы ищим соответствие между id_product - и productId (айдишник той кнопки, которую нажали)
					let find = this.allProducts.find(product => product.id === productId);
					if (find) {
						find.quantity++;
						// find - передаем на вход наш объект с нашим товаром
						this._updateCart(find);
					} else {
						// если не нашли такого товара find - выполняем блок else
						let product = {
							id: productId,
							price: +element.dataset['price'],
							oldPrice: +element.dataset['oldPrice'],
							title: element.dataset['title'],
							quantity: 1
						};
						this.goods = [product];
						this.render();
					}
				} else {
					alert('Error');
				}
			})
	}
	// при нажатии на кнопку удалить 
	// на вход передаем опять наш источник события element
	removeProduct(element) {
		this.getJson(`${API}/deleteFromBasket.json`)
			.then(data => {
				if (data.result === 1) {
					let productId = +element.dataset['id'];
					let find = this.allProducts.find(product => product.id === productId);

					if (find.quantity > 1) {
						// если таких элементов много - уменьшаем количество на 1
						find.quantity--;
						// обновляем свойства нашей корзины 
						this._updateCart(find);
					} else {
						// splice метод массива - из нашего массива объектов удалили объект 
						this.allProducts.splice(this.allProducts.indexOf(find), 1);
						// затем удаляем его визуально из верстки 
						document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
					}
				} else {
					alert('Error');
				}
			})
	}
	_updateCart(product) {
		// вывод данных в нашем всплывающем окне - перерисовываем нашу корзинку 
		let block = document.querySelector(`.cart-item[data-id="${product.id}"]`);
		block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
		block.querySelector('.product-price').textContent = `$${product.quantity * product.price}`;
	}
	_init() {
		// document.querySelector('.btn-cart').addEventListener('click', () => {
		// 	document.querySelector(this.container).classList.toggle('invisible');
		// });
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target.classList.contains('del-btn')) {
				this.removeProduct(e.target);
			}
		})
	}
}

// класс отвечающий за наш элемент корзины 
class CartItem extends Item {
	constructor(el) {
		super(el);
		this.quantity = el.quantity;
	}
	render() {
		return `
	<div class="products__item cart-item" data-id="${this.id}>
		<h3 class="products__name">${this.title}</h3>
		<img class="products__img" src="${this.img}"
			alt="${this.title}">
		<div class="products__description">
			<div class="products__description_control">
				
			</div>
			<!-- /.products__description_control -->
			<div class="products__description_prices">
			    <p class="product-title">${this.title}</p>
                <p class="product-quantity">Quantity: ${this.quantity}</p>
                <p class="product-single-price">$${this.price} each</p>
				<p class="products__price products__price_old">${this.oldPrice}</p>
				<p class="products__price">${this.price} ₽</p>
				<p class="product-price">$${this.quantity * this.price}</p>
				<button class="del-btn" data-id="${this.id}">&times;</button>
			</div>
			<!-- /.products__description_prices -->
		</div>
		<!-- /.products__description -->
	</div>
		`
	}
}


// объект list2 - в нем два свойства 
const list2 = {
	// в этом списке каталога товаров ProductsList - каждый элемент является объектом класса ProductItem
	ProductsList: ProductItem,
	// Cart - название класса для работы со списком товаров в корзинке - CartItem - название класса для каждого товара корзины 
	Cart: CartItem
};

// объект cart (делаем объект класса Cart) - у нас вызывается констркутор класса Cart 
let cart = new Cart();
// удобнее всего передавать объект в качестве параметра чтобы можно было в классе ProductsList использлвать свойства класса Cart
let products = new ProductsList(cart);//Если мы хотим использовать в классе
//методы другого класса, то удобнее всего в конструктор передать объект класса,
//методы которого нам нужны в данном классе
//products.getJson(`getProducts.json`).then(data => products.handleData(data));




// еще раз все объясняю - наш проект мы разбили на классы 
// так как у нас есть два списка (список товаров каталога и список товаров корзины) - поэтому есть общий класс List - свойства которого актуальны и для каталога и для корзинки 
// у него есть два потомка - ProductList - каталог 
// и потомок Cart - блок корзинки 
// в каждом потомке мы вызываем constructor базового класса - это делать обязательно потому что потомки должны вызывать наш базовый конструктор класса 
// а дальше мы вызываем handleData - для каждого потомка
// handleData - вызываем также render - а render отрисовывает 
// когда мы вызываем render (базового класса) - вызывается render каждого товара productObj.render() - вызываем render уже для объекта этого списка 
// таким образом - вывод - если у вас есть компоненты - каждый компонент это отдельный класс - нужно подумать что общего у этих компонентов - если это общее есть то важно вынести это общее в отдельный класс 
// есть товары - они есть и в корзинке и в каталоге - значит удобно сделать общий класс всех товаров 
// в каждом списке есть товар - 
// логично сделать класс для товара каталога и класс для товара корзинки - вот у нас получается 4 класса (два списка - два товара) - и один общий класс List - те 5 классов получается 

// в дальнейшем мы этот пример упростим - а когда будем применять vue - то код станет короче в два раза 
// сейчас перерив - после перерыва регулярные выражения (1:16)










// class ProductsList {
// 	constructor(container = '.products') {
// 		this.container = container;
// 		// массив с товарами 
// 		this.goods = [];
// 		// массив с версткой товаров:
// 		this.allProducts = [];
// 		// указать, какой нужно вызывать метод при запуске нашего конструктора:
// 		// в первую очередь мы хотим заполнить наш массив товаров товарами 
// 		this._fetchProduct()
// 			.then(data => {
// 				this.goods = [...data];
// 				this.render()
// 			});
// 	}

// 	_fetchProduct() {
// 		return fetch(`${API}/catalogData.json`)
// 			.then(result => result.json())
// 			.catch(error => {
// 				console.log(error);
// 			})
// 	}

// 	// Добавьте для ProductsList метод, определяющий суммарную стоимость всех товаров.

// 	// ================ ВАРИАНТ ПРАВИЛЬНЫЙ:
// 	// многие использовали циклы, многие использовали for each

// 	getSum() {

// 		let price = this.goods.map((item) => item.price);
// 		console.log(price);

// 		// убираем пробелы в строках
// 		let priceNumber = price.map((item) => item.split(' ').join(''));
// 		console.log(priceNumber);

// 		// преобразуем строку в число
// 		let priceTypeNumber = priceNumber.map((item) => Number(item));
// 		console.log(priceTypeNumber);

// 		// reduce используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата. (в каждом массиве есть встроенное свойство)
// 		let res = priceTypeNumber.reduce((sum, item) => sum += item, 0);
// 		alert(`Суммарная стоимость всех товаров магазина = ${res} рублей`);
// 	}


// 	// список товаров отобразить  
// 	render() {
// 		// в каком элементе мы хотим помещать наши товары 
// 		const block = document.querySelector(this.container);
// 		// теперь нужно в цикле обойти наш массив товаров goods и каждый товар обернуть в верстку 
// 		// хотим в цикле поработать с каждым элементом массива goods (let product - каждый объект массива goods)
// 		// каждый товар будем передавать в конструктор класса ProductItem
// 		for (let product of this.goods) {
// 			// productObj - каждый товар (когда пишем new - вызывается конструктор)
// 			const productObj = new ProductItem(product);
// 			// наполняем наш массив товарами с версткой 
// 			this.allProducts.push(productObj);
// 			// .insertAdjacentHTML - метод вставляет в нужное место наш элемент 
// 			block.insertAdjacentHTML('beforeend', productObj.render());
// 			// block.innerHTML += productObj.render(); - эта инструкция считается плохой, т.к. она заставляет перерисовывать (каждый раз при довавлении нового элемента перерисовывается старый элемент)
// 		}
// 	}
// }





// // 1. Добавьте пустые классы для корзины товаров и элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.
// // 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.

// // класс для корзины товаров
// class BasketGoods {
// 	constructor(container = '.items-cart') {
// 		this.container = container;
// 		// массив элементов корзины:
// 		this.arrayCartItems = [];
// 		// массив с версткой элементов корзины:
// 		this.layoutCartItems = [];
// 		// хотим заполнить наш массив товарами отложенными в корзину 
// 		this._fetchProductCart()
// 			.then(data => {
// 				// здесь мы получаем 
// 				this.arrayCartItems = data.contents;
// 				this.render()
// 			});
// 	}

// 	_fetchProductCart() {
// 		return fetch(`${API}/getBasket.json`)
// 			.then(result => result.json())
// 			.catch(error => {
// 				console.log(error);
// 			})
// 	}

// 	render() {
// 		const block = document.querySelector(this.container);
// 		for (let product of this.arrayCartItems) {
// 			const productObj = new BasketItem(product);
// 			this.layoutCartItems.push(productObj);
// 			block.insertAdjacentHTML('beforeend', productObj.render());
// 		}
// 	}

// 	// добавить товары в корзину
// 	addGoods() {

// 	}

// 	// удалить товар из корзины 
// 	removeGoods() {

// 	}

// 	// изменить 
// 	changeGoods() {

// 	}

// 	// метод для очистки корзины
// 	// сумма товаров в корзине 
// }


// // класс для элемента корзины товаров
// class BasketItem {

// 	constructor(product) {
// 		this.title = product.title;
// 		this.id = product.id;
// 		this.img = product.img;
// 		this.price = product.price;
// 		this.oldPrice = product.oldPrice;
// 	}

// 	render() {
// 		return `
// 		<div class="products__item cart-item">
// 		<h3 class="products__name">${this.title}</h3>
// 		<img class="products__img" src="${this.img}"
// 			alt="${this.title}">
// 		<div class="products__description">
// 			<div class="products__description_control">
// 				<button class="buy-btn">Удалить</button>
// 			</div>
// 			<!-- /.products__description_control -->
// 			<div class="products__description_prices">
// 			    <p class="product-title">${this.title}</p>
//                 <p class="product-quantity">Quantity: ${this.quantity}</p>
//                 <p class="product-single-price">$${this.price} each</p>
// 				<p class="products__price products__price_old">${this.oldPrice}</p>
// 				<p class="products__price">${this.price} ₽</p>
// 				<p class="product-price">$${this.quantity * this.price}</p>
// 				<button class="del-btn" data-id="${this.id}">&times;</button>
// 			</div>
// 			<!-- /.products__description_prices -->
// 		</div>
// 		<!-- /.products__description -->
// 	</div>
// 		`
// 	}

// 	// удалить товар из корзины
// 	// количество товара в корзине
// 	// изменить количество товара в корзине 
// }


// let list = new ProductsList();
// let listCart = new BasketGoods();


// getSum33.onclick = () => list.getSum();







// // ======================================================




// // Меню бургер на JavaScript

// "use strict"

// const isMobile = {
// 	Android: function () {
// 		return navigator.userAgent.match(/Android/i);
// 	},
// 	BlackBerry: function () {
// 		return navigator.userAgent.match(/BlackBerry/i);
// 	},
// 	iOS: function () {
// 		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
// 	},
// 	Opera: function () {
// 		return navigator.userAgent.match(/Opera Mini/i);
// 	},
// 	Windows: function () {
// 		return navigator.userAgent.match(/IEMobile/i);
// 	},
// 	any: function () {
// 		return (
// 			isMobile.Android() ||
// 			isMobile.BlackBerry() ||
// 			isMobile.iOS() ||
// 			isMobile.Opera() ||
// 			isMobile.Windows());
// 	}
// };

// if (isMobile.any()) {
// 	document.body.classList.add('_touch');

// 	let menuArrows = document.querySelectorAll('.menu__arrow');
// 	if (menuArrows.length > 0) {
// 		for (let index = 0; index < menuArrows.length; index++) {
// 			const menuArrow = menuArrows[index];
// 			menuArrow.addEventListener("click", function (e) {
// 				menuArrow.parentElement.classList.toggle('_active');
// 			});
// 		}
// 	}

// } else {
// 	document.body.classList.add('_pc');
// }

// // Меню бургер 
// const iconMenu = document.querySelector('.menu__icon');
// const menuBody = document.querySelector('.menu__body');
// if (iconMenu) {
// 	iconMenu.addEventListener("click", function (e) {
// 		document.body.classList.toggle('_lock');
// 		iconMenu.classList.toggle('_active');
// 		menuBody.classList.toggle('_active');
// 	});
// }


// // Прокрутка при клике
// const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
// if (menuLinks.length > 0) {
// 	menuLinks.forEach(menuLink => {
// 		menuLink.addEventListener("click", onMenuLinkClick);
// 	});

// 	function onMenuLinkClick(e) {
// 		const menuLink = e.target;
// 		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
// 			const gotoBlock = document.querySelector(menuLink.dataset.goto);
// 			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

// 			if (iconMenu.classList.contains('_active')) {
// 				document.body.classList.remove('_lock');
// 				iconMenu.classList.remove('_active');
// 				menuBody.classList.remove('_active');
// 			}

// 			window.scrollTo({
// 				top: gotoBlockValue,
// 				behavior: "smooth"
// 			});
// 			e.preventDefault();
// 		}
// 	}
// }


// // Меню бургер на JavaScript