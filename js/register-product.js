import Validator from "./modules/validator.js";
import Stock from "./modules/stock.js";

const validator = new Validator();
const stock = new Stock();

stock.updateStock();

function handleFormSubmit(e) {
  e.preventDefault();

  const { isValid, inputs, inputValues } = validator.validate(productsForm);

  if (isValid) {
    let [name, code, quantity, image] = inputValues;
    code = code.toUpperCase();

    stock.addProduct({ name, code, quantity, image });
    stock.clearProductFields(inputs);
  }
}

const productsForm = document.querySelector("form");
productsForm.addEventListener("submit", handleFormSubmit);
