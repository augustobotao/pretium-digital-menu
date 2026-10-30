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

// =====================================
// 3. ESTADO DA APLICAÇÃO
// =====================================

let selectedCategory = "todos";

let searchTerm = "";

let cart = [];

// =====================================
// 4. FORMATAR PREÇOS
// =====================================

function formatPrice(price) {
  return price.toLocaleString("pt-PT") + " MT";
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
      addToCart(dish.id);
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

function addToCart(dishId) {
  const selectedDish = dishes.find((dish) => dish.id === dishId);

  if (!selectedDish) return;

  const existingItem = cart.find((item) => item.id === dishId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...selectedDish,
      quantity: 1,
    });
  }

  updateCart();
}

// =====================================
// 9. ATUALIZAR CONTADOR
// =====================================

function updateCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  document.getElementById("cart-count").textContent = totalItems;
}

// =====================================
// 10. INICIAR A APLICAÇÃO
// =====================================

renderDishes();
