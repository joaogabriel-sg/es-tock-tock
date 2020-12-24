export default class Validator {
  constructor() {
    this.validations = ["data-required", "data-min-quantity", "data-image-url"];
    this.datas = {
      isValid: true,
      inputs: null,
      inputValues: null,
    };
  }

  printErrorMessage(input, message) {
    this.datas.isValid = false;

    const errorsQuantity = input.parentNode.querySelector(".error-message");

    if (errorsQuantity === null) {
      const errorContainer = document.createElement("span");
      errorContainer.classList.add("error-message");
      errorContainer.textContent = message;

      input.parentNode.appendChild(errorContainer);
    }
  }

  imageurl(input) {
    const inputValue = input.value;

    if (inputValue !== "") {
      const errorMessage =
        "Insira uma URL válida e que comece com https:// ou http://";
      const regex = /(https|http):\/\//g;

      if (!regex.test(inputValue)) this.printErrorMessage(input, errorMessage);
    }
  }

  minquantity(input) {
    const inputValue = Number(input.value);
    const errorMessage = "Você precisa adicionar pelo menos um item!";

    if (inputValue <= 0) this.printErrorMessage(input, errorMessage);
  }

  required(input) {
    const inputValue = input.value;
    const errorMessage = "Este campo é obrigatório!";

    if (inputValue === "") this.printErrorMessage(input, errorMessage);
  }

  clearValidations(validations) {
    validations.forEach((validation) => validation.remove());
  }

  validate(form) {
    this.datas.isValid = true;

    const currentValidations = form.querySelectorAll(".error-message");
    if (currentValidations.length > 0) {
      this.clearValidations(currentValidations);
    }

    this.datas.inputs = [...form.querySelectorAll("input")];
    this.datas.inputValues = this.datas.inputs.map(({ value }) => value);

    this.datas.inputs.forEach((input) => {
      for (let validationName of this.validations) {
        const value = input.getAttribute(validationName);

        if (value !== null) {
          const method = validationName.replace(/data-|-/g, "");
          this[method](input, value);
        }
      }
    });

    return this.datas;
  }
}
