export default class Stock {
  clearProductFields(productFields) {
    productFields.forEach((productField) => (productField.value = ""));
  }

  getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  setProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  updateStock() {
    const products = this.getProducts();

    const path = window.location.pathname;
    const isRegisterPage = path === "/register-products.html";

    if (isRegisterPage) {
      const itemsInStockContainer = document.querySelector(".items-in-stock");
      itemsInStockContainer.innerHTML = products.length;
    }
  }

  generateId(products) {
    const lastProduct = products[products.length - 1];
    let id = lastProduct ? lastProduct.id : 1;
    return lastProduct ? ++id : id;
  }

  addProduct(actualProductDatas) {
    const products = this.getProducts();
    const id = this.generateId(products);

    const indexPosition = products.findIndex(({ productDatas: { code } }) => {
      return code === actualProductDatas.code;
    });

    if (indexPosition !== -1) {
      let { id, productDatas: productDatasToChange } = products[indexPosition];

      productDatasToChange.quantity =
        Number(productDatasToChange.quantity) +
        Number(actualProductDatas.quantity);

      if (actualProductDatas.image)
        productDatasToChange.image = actualProductDatas.image;

      const newProducts = products.filter((product) => {
        if (product.id === id) {
          product.productDatas = productDatasToChange;
        }
        return product;
      });

      this.setProducts(newProducts);
    } else {
      products.push({ id, productDatas: actualProductDatas });
      this.setProducts(products);
    }

    this.updateStock();
  }

  generateProductsTemplate(products) {
    return products.reduce(
      (acc, { id, productDatas: { name, code, quantity, image } }) => {
        return (acc += `
        <div class="product-item">
          <span class="product-item-code">${code}</span>
          <div class="image-wrapper">
            <img src="${
              image ? image : "./images/no-image.svg"
            }" alt="Pulseira de Couro" class="product-item-image">
          </div>
          <div class="product-item-datas">
            <h1>${name}</h1>
            <h2>Quantidade: ${quantity}</h2>
          </div>
          <i class="product-id fas fa-times-circle" data-id="${id}"></i>
        </div>
      `);
      },
      ""
    );
  }

  addDeleteEvent(productItems) {
    this.deleteProduct = this.deleteProduct.bind(this);

    productItems.forEach((item) => {
      item.addEventListener("click", this.deleteProduct);
    });
  }

  showProducts(productsList) {
    const products = this.getProducts();

    if (products.length > 0) {
      const template = this.generateProductsTemplate(products);
      productsList.innerHTML = template;

      const productItems = productsList.querySelectorAll(
        ".product-item .product-id"
      );
      this.addDeleteEvent(productItems);

      return;
    }

    productsList.innerHTML = `
      <img src="./images/no-products-illustration.svg" class="no-products-image">
    `;
  }

  deleteProduct({
    target: {
      dataset: { id: deletedId },
    },
  }) {
    const products = this.getProducts();
    const newProducts = products.filter(({ id }) => +id !== +deletedId);

    this.setProducts(newProducts);
    this.showProducts(document.querySelector(".products-list"));
  }
}
