import Stock from "./modules/stock.js";

const stock = new Stock();
const productsList = document.querySelector(".products-list");

stock.updateStock();
stock.showProducts(productsList);
