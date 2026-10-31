// =====================================
// 1. DADOS DOS PRATOS
// =====================================

const dishes = [
  {
    id: 1,
    name: "Matapa de autor",
    category: "principais",
    description: "Folhas de mandioca, leite de coco e camarão.",
    price: 850,

    ingredients: [
      "Folhas de mandioca",
      "Camarão",
      "Leite de coco",
      "Alho",
      "Cebola",
    ],

    preparation:
      "As folhas de mandioca são cozidas lentamente e combinadas com leite de coco, alho e camarão.",
  },

  {
    id: 2,
    name: "Camarão à zambeziana",
    category: "peixes",
    description: "Camarão grelhado com molho de coco e piripiri.",
    price: 1450,
  },
  {
    id: 3,
    name: "Picanha maturada",
    category: "carnes",
    description: "Picanha grelhada com ervas aromáticas.",
    price: 1350,
  },
  {
    id: 4,
    name: "Carpaccio de atum",
    category: "entradas",
    description: "Atum fresco, lima e sementes de sésamo.",
    price: 690,
  },
  {
    id: 5,
    name: "Frango à cafreal",
    category: "carnes",
    description: "Frango grelhado, marinado com alho e piripiri.",
    price: 950,
  },
  {
    id: 6,
    name: "Pudim de coco",
    category: "sobremesas",
    description: "Pudim cremoso de coco com caramelo.",
    price: 320,
  },
  {
    id: 7,
    name: "Garoupa grelhada",
    category: "peixes",
    description: "Garoupa com legumes da época e molho de lima.",
    price: 1250,
  },
  {
    id: 8,
    name: "Chamuças de caranguejo",
    category: "entradas",
    description: "Massa estaladiça com recheio de caranguejo.",
    price: 450,
  },
];

// =====================================
// 2. ELEMENTOS HTML
// =====================================

const dishesGrid = document.getElementById("dishes-grid");

const searchInput = document.getElementById("search-input");

const categoryButtons = document.querySelectorAll(".category");

const dishModal = document.getElementById("dish-modal");

const modalClose = document.getElementById("modal-close");

const modalName = document.getElementById("modal-name");

const modalDescription = document.getElementById("modal-description");

const modalIngredients = document.getElementById("modal-ingredients");

const modalPreparation = document.getElementById("modal-preparation");

const portionSelect = document.getElementById("portion");

const quantityInput = document.getElementById("quantity");

const notesInput = document.getElementById("notes");

const modalPrice = document.getElementById("modal-price");

const addToCartButton = document.getElementById("add-to-cart");

const cartModal = document.getElementById("cart-modal");
const cartClose = document.getElementById("cart-close");

const cartButton = document.getElementById("cart-button");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

// =====================================
// 3. ESTADO DA APLICAÇÃO
// =====================================

let selectedCategory = "todos";

let searchTerm = "";

let cart = JSON.parse(localStorage.getItem("maison-cart")) || [];

let selectedDish = null;

// =====================================
// 4. FORMATAR PREÇOS
// =====================================

function formatPrice(price) {
  return price.toLocaleString("pt-PT") + " MT";
}

function openDishModal(dish) {
  selectedDish = dish;

  modalName.textContent = dish.name;
  modalDescription.textContent = dish.description;

  modalIngredients.textContent =
    dish.ingredients?.join(", ") || "Informação não disponível.";

  modalPreparation.textContent =
    dish.preparation || "Preparação não especificada.";

  quantityInput.value = 1;
  portionSelect.value = "1";
  notesInput.value = "";

  updateModalPrice();

  dishModal.classList.add("active");
}

function updateModalPrice() {
  if (!selectedDish) return;

  const portionMultiplier = Number(portionSelect.value);

  const quantity = Math.max(1, Number(quantityInput.value) || 1);

  const total = selectedDish.price * portionMultiplier * quantity;

  modalPrice.textContent = formatPrice(total);
}

// =====================================
// 5. MOSTRAR PRATOS
// =====================================

function renderDishes() {
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === "todos" || dish.category === selectedCategory;

    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  dishesGrid.innerHTML = "";

  if (filteredDishes.length === 0) {
    dishesGrid.innerHTML = `
            <p class="empty-message">
                Não encontramos pratos correspondentes.
            </p>
        `;

    return;
  }

  filteredDishes.forEach((dish) => {
    const card = document.createElement("article");

    card.className = "dish-card";

    card.innerHTML = `
            <div class="dish-image">
                <span>${dish.name}</span>
            </div>

            <div class="dish-info">

                <h3>${dish.name}</h3>

                <p>${dish.description}</p>

                <span class="dish-price">
                    ${formatPrice(dish.price)}
                </span>

            </div>
        `;

    card.addEventListener("click", () => {
      console.log("Clique Reconhecido:", dish);
      openDishModal(dish);
    });

    dishesGrid.appendChild(card);
  });
}

// =====================================
// 6. FILTRAR CATEGORIAS
// =====================================

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    renderDishes();
  });
});

// =====================================
// 7. PESQUISAR PRATOS
// =====================================

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();

  renderDishes();
});

// =====================================
// 8. CARRINHO SIMPLES
// =====================================

function addToCart(dish, quantity, portion, unitPrice, notes) {
  if (!dish) return;

  cart.push({
    ...dish,
    cartId: Date.now(),
    quantity: quantity,
    portion: portion,
    unitPrice: unitPrice,
    notes: notes,
  });

  updateCart();
}

// =====================================
// 9. ATUALIZAR CONTADOR
// =====================================

function updateCart() {
  // 1. Atualizar o contador do cabeçalho
  localStorage.setItem("maison-cart", JSON.stringify(cart));
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  document.getElementById("cart-count").textContent = totalItems;

  // 2. Verificar se o carrinho está vazio
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <p>O teu carrinho está vazio.</p>
        `;

    cartTotalElement.textContent = "0 MT";
    return;
  }

  // 3. Mostrar os produtos adicionados
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div>
            <h3>${item.name}</h3>
            <p>${item.portion}</p>
            <div class="cart-quantity">
              <button class="decrease-quantity" data-id="${item.cartId}">−</button>
              <span>${item.quantity}</span>
              <button class="increase-quantity" data-id="${item.cartId}">+</button>
            </div>
            <p>${item.notes || "Sem observações"}</p>

            <button class="remove-item" data-id="${item.cartId}">
              Remover
            </button>
            </div>

            <strong>
                ${(item.unitPrice * item.quantity).toLocaleString("pt-PT")} MT
            </strong>
        </div>
    `,
    )
    .join("");

  // 4. Calcular o total da encomenda
  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  cartTotalElement.textContent = total.toLocaleString("pt-PT") + " MT";

  // Remover produtos do carrinho
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const cartId = Number(button.dataset.id);

      cart = cart.filter((item) => item.cartId !== cartId);

      updateCart();
    });
  });
  // Aumentar quantidade
  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      const cartId = Number(button.dataset.id);

      const item = cart.find((item) => item.cartId === cartId);

      if (item) {
        item.quantity++;
        updateCart();
      }
    });
  });

  // Diminuir quantidade
  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      const cartId = Number(button.dataset.id);

      const item = cart.find((item) => item.cartId === cartId);

      if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
      }
    });
  });
}

// =====================================
// 10. INICIAR A APLICAÇÃO
// =====================================

portionSelect.addEventListener("change", updateModalPrice);

quantityInput.addEventListener("input", updateModalPrice);

// Fechar janela dos detalhes
modalClose.addEventListener("click", () => {
  dishModal.classList.remove("active");
});

// Fechar detalhes ao clicar fora
dishModal.addEventListener("click", (event) => {
  if (event.target === dishModal) {
    dishModal.classList.remove("active");
  }
});

// Adicionar prato ao carrinho
addToCartButton.addEventListener("click", () => {
  if (!selectedDish) return;

  const quantity = Math.max(1, Number(quantityInput.value) || 1);

  const multiplier = Number(portionSelect.value);

  const portionLabel = portionSelect.options[portionSelect.selectedIndex].text;

  const unitPrice = selectedDish.price * multiplier;

  addToCart(
    selectedDish,
    quantity,
    portionLabel,
    unitPrice,
    notesInput.value.trim(),
  );

  dishModal.classList.remove("active");
});

// Abrir carrinho
cartButton.addEventListener("click", () => {
  cartModal.classList.add("active");
});

// Fechar carrinho
cartClose.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

// Finalizar pedido
checkoutButton.addEventListener("click", checkout);

// Finalizar pedido pelo WhatsApp
function checkout() {
  if (cart.length === 0) {
    alert("O teu carrinho está vazio!");
    return;
  }

  let message = "Olá, MAISON GOURMET! Gostaria de fazer o seguinte pedido:\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Porção: ${item.portion}\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Subtotal: ${formatPrice(item.unitPrice * item.quantity)}\n`;

    if (item.notes) {
      message += `   Observações: ${item.notes}\n`;
    }

    message += "\n";
  });

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  message += `TOTAL DO PEDIDO: ${formatPrice(total)}\n\n`;
  message += "Aguardo a confirmação. Obrigado!";

  const phone = "258860215520";
  const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const whatsappWindow = window.open(whatsappURL, "_blank");

  if (whatsappWindow) {
    cart = [];
    updateCart();
    cartModal.classList.remove("active");
  } else {
    alert(
      "Não foi possível abrir o WhatsApp. Verifica se o navegador bloqueou a janela.",
    );
  }
}

// Iniciar apresentação dos pratos
renderDishes();
updateCart();
