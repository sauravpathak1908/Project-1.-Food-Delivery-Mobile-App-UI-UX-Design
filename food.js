
const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    rating: 4.8,
    description: "Classic cheese pizza with fresh herbs.",
    image: "photo-1579751626657-72bc17010498"
  },
  {
    id: 2,
    name: "Cheese Burger",
    category: "Burger",
    price: 179,
    rating: 4.6,
    description: "Juicy burger with cheese and fresh veggies.",
    image: "photo-1568901346375-23c9450c58cd"
  },
  {
    id: 3,
    name: "Indian Thali",
    category: "Indian",
    price: 199,
    rating: 4.7,
    description: "A delicious meal with traditional flavours.",
    image: "photo-1546833999-b9f581a1996d"
  },
  {
    id: 4,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 329,
    rating: 4.9,
    description: "Cheesy pizza topped with tasty pepperoni.",
    image: "photo-1628840042765-356cda07504e"
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 129,
    rating: 4.8,
    description: "Rich chocolate cake for your sweet cravings.",
    image: "photo-1578985545062-69928b1d9587"
  },
  {
    id: 6,
    name: "Cold Coffee",
    category: "Drinks",
    price: 99,
    rating: 4.5,
    description: "Chilled creamy coffee to refresh your day.",
    image: "photo-1461023058943-07fcbe16d735",
    available: false
  },
  {
    id: 7,
    name: "Veg Burger",
    category: "Burger",
    price: 149,
    rating: 4.4,
    description: "Crispy veggie patty with special sauce.",
    image: "photo-1520072959219-c595dc870360"
  },
  {
    id: 8,
    name: "Paneer Curry",
    category: "Indian",
    price: 229,
    rating: 4.7,
    description: "Soft paneer in a rich Indian curry.",
    image: "photo-1631452180519-c014fe946bc7"
  },
  {
    id: 9,
    name: "Chocolate Brownie",
    category: "Dessert",
    price: 119,
    rating: 4.6,
    description: "Soft, fudgy chocolate brownie.",
    image: "photo-1606313564200-e75d5e30476c"
  }
];

let selectedCategory = "All";
let cart = {};
let deliveryLocation = "";
let selectedPayment = "UPI";
let paymentAttempted = false;
let currentOrderId = "";

const restaurants = [
  { name: "Oven & Stone", category: "Pizza", detail: "Wood-fired pizza and Italian favourites", rating: 4.8, eta: "20–30 min", image: "photo-1579751626657-72bc17010498" },
  { name: "Burger Yard", category: "Burger", detail: "Smash burgers, fries and shakes", rating: 4.6, eta: "20–35 min", image: "photo-1568901346375-23c9450c58cd" },
  { name: "Saffron Kitchen", category: "Indian", detail: "Comforting Indian meals and curries", rating: 4.7, eta: "25–35 min", image: "photo-1546833999-b9f581a1996d" },
  { name: "Sugar House", category: "Dessert", detail: "Cakes, brownies and sweet treats", rating: 4.8, eta: "15–25 min", image: "photo-1578985545062-69928b1d9587" },
  { name: "Daily Brew", category: "Drinks", detail: "Coffee, coolers and refreshing drinks", rating: 4.5, eta: "15–25 min", image: "photo-1461023058943-07fcbe16d735" }
];

const foodGrid = document.getElementById("foodGrid");
const restaurantGrid = document.getElementById("restaurantGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const appMain = document.getElementById("appMain");
const checkoutContent = document.getElementById("checkoutContent");
const checkoutProgress = document.getElementById("checkoutProgress");
const trackingContent = document.getElementById("trackingContent");

let toastTimer;

function renderFoods() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const restaurantNames = Object.fromEntries(
    restaurants.map(restaurant => [restaurant.category, restaurant.name])
  );

  const filteredFoods = foods.filter(food => {
    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm) ||
      food.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  foodGrid.innerHTML = filteredFoods.map(food => `
    <article class="food-card">
      <img
        class="food-image"
        src="https://images.unsplash.com/${food.image}?auto=format&fit=crop&w=600&q=80"
        alt="${food.name}"
        loading="lazy"
      >

      <div class="food-details">
        <p class="restaurant-name">${restaurantNames[food.category]}</p>
        <h3>${food.name}</h3>
        <p class="food-description">${food.description}</p>

        <div class="food-meta">
          <span class="price">₹${food.price}</span>
          <span class="rating">★ ${food.rating}</span>
        </div>

        ${food.available === false ? `
          <p class="availability-message" role="status">Currently unavailable. Choose another dish.</p>
          <button class="add-button browse-food-button" data-browse-food>
            Browse other dishes
          </button>
        ` : `
          <button class="add-button" data-add="${food.id}">
            + Add to Cart
          </button>
        `}
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredFoods.length !== 0;
}

function renderRestaurants() {
  restaurantGrid.innerHTML = restaurants.map(restaurant => `
    <article class="restaurant-card">
      <img src="https://images.unsplash.com/${restaurant.image}?auto=format&fit=crop&w=800&q=85" alt="Food from ${restaurant.name}" loading="lazy">
      <div class="restaurant-card-content">
        <div class="restaurant-card-title"><h2>${restaurant.name}</h2><span>★ ${restaurant.rating}</span></div>
        <p>${restaurant.detail}</p>
        <div class="restaurant-card-meta"><span>${restaurant.eta}</span><span>Free delivery</span></div>
        <button class="primary-button" data-restaurant-category="${restaurant.category}">View menu</button>
      </div>
    </article>
  `).join("");
}

function navigateTo(screen) {
  document.querySelectorAll(".app-screen").forEach(view => {
    const isActive = view.dataset.screen === screen;
    view.hidden = !isActive;
    view.classList.toggle("active", isActive);
  });

  document.querySelectorAll(".screen-link").forEach(link => {
    link.classList.toggle("active", link.dataset.screenTarget === screen);
  });

  if (screen === "restaurants") {
    document.getElementById("restaurantLocation").textContent = deliveryLocation
      ? `📍 ${deliveryLocation}`
      : "📍 Set delivery location";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  showToast("Item added to your cart!");
}

function changeQuantity(id, change) {
  if (!cart[id]) return;

  cart[id] += change;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  updateCart();
}

function updateCart() {
  const items = Object.entries(cart);
  const totalQuantity = items.reduce(
    (sum, [, quantity]) => sum + quantity, 0
  );

  const totalPrice = items.reduce((sum, [id, quantity]) => {
    const food = foods.find(item => item.id === Number(id));
    return sum + food.price * quantity;
  }, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = `₹${totalPrice}`;

  if (items.length === 0) {
    cartItems.innerHTML =
      '<div class="cart-empty"><span aria-hidden="true">🛒</span><h2>Your cart is empty</h2><p>Pick a dish from the menu to get started.</p><button class="primary-button" data-screen-target="menu">Browse food menu</button></div>';
    document.getElementById("checkoutBtn").disabled = true;
    return;
  }

  document.getElementById("checkoutBtn").disabled = false;

  cartItems.innerHTML = items.map(([id, quantity]) => {
    const food = foods.find(item => item.id === Number(id));

    return `
      <div class="cart-item">
        <div>
          <h3>${food.name}</h3>
          <p>₹${food.price} × ${quantity} = ₹${food.price * quantity}</p>
        </div>

        <div class="quantity-controls">
          <button data-change="-1" data-id="${id}"
                  aria-label="Decrease ${food.name} quantity">−</button>
          <span>${quantity}</span>
          <button data-change="1" data-id="${id}"
                  aria-label="Increase ${food.name} quantity">+</button>
        </div>
      </div>
    `;
  }).join("");
}

function openCheckout() {
  if (Object.keys(cart).length === 0) {
    showToast("Your cart is empty. Add a dish before checkout.");
    return;
  }

  const unavailableItems = Object.keys(cart)
    .map(id => foods.find(food => food.id === Number(id)))
    .filter(food => food && food.available === false);

  navigateTo("checkout");
  paymentAttempted = false;

  if (unavailableItems.length) {
    renderCheckout("unavailable", unavailableItems);
  } else {
    renderCheckout("location");
  }
}

function renderCheckout(step, unavailableItems = []) {
  const steps = ["Location", "Payment", "Delivery"];
  const activeStep = step === "location" ? 0 : step === "payment" || step === "payment-failed" ? 1 : 2;

  checkoutProgress.innerHTML = steps.map((label, index) => `
    <div class="progress-step ${index <= activeStep ? "active" : ""}">
      <span>${index + 1}</span>${label}
    </div>
  `).join("");

  if (step === "unavailable") {
    checkoutContent.innerHTML = `
      <div class="checkout-message error-message" role="alert">
        <h3>One or more items are unavailable</h3>
        <p>${unavailableItems.map(food => food.name).join(", ")} can no longer be ordered. Remove ${unavailableItems.length === 1 ? "it" : "them"} to continue.</p>
      </div>
      <div class="checkout-actions">
        <button class="primary-button" data-action="remove-unavailable">Remove unavailable items</button>
        <button class="text-button" data-action="browse-food">Back to menu</button>
      </div>
    `;
    return;
  }

  if (step === "location") {
    checkoutContent.innerHTML = `
      <form id="locationForm" class="checkout-form">
        <label for="addressInput">Delivery address</label>
        <input id="addressInput" name="address" type="text" required
               autocomplete="street-address" placeholder="Street, area, city">
        <p class="field-hint">Add the address where you would like this order delivered.</p>
        ${renderOrderSummary()}
        <button class="primary-button checkout-button" type="submit">Continue to payment</button>
      </form>
    `;
    document.getElementById("addressInput").value = deliveryLocation;
    return;
  }

  if (step === "payment" || step === "payment-failed") {
    checkoutContent.innerHTML = `
      <div class="checkout-context"><span>Delivering to</span><strong>${escapeHtml(deliveryLocation)}</strong></div>
      ${step === "payment-failed" ? `
        <div class="checkout-message error-message" role="alert">
          <h3>Payment couldn't be completed</h3>
          <p>No money was charged in this demo. Try again or choose another payment method.</p>
        </div>
      ` : ""}
      <label class="payment-label" for="paymentMethod">Payment method</label>
      <select id="paymentMethod" class="payment-select">
        <option value="UPI">UPI</option>
        <option value="Card">Credit or debit card</option>
        <option value="Cash on delivery">Cash on delivery</option>
      </select>
      ${renderOrderSummary()}
      <div class="checkout-actions">
        ${step === "payment-failed" ? `
          <button class="primary-button" data-action="retry-payment">Try again</button>
          <button class="text-button" data-action="change-payment">Change payment method</button>
        ` : `
          <button class="primary-button" data-action="confirm-order">Confirm order</button>
          <button class="text-button" data-action="edit-location">Edit address</button>
        `}
      </div>
      <p class="demo-note">Demo only. No real payment is processed.</p>
    `;
    document.getElementById("paymentMethod").value = selectedPayment;
    return;
  }

  const delivered = step === "delivered";
  checkoutContent.innerHTML = `
    <div class="confirmation-mark" aria-hidden="true">${delivered ? "✓" : "✓"}</div>
    <h3 class="confirmation-title">${delivered ? "Order delivered" : "Order confirmed"}</h3>
    <p class="confirmation-copy">${delivered ? "Enjoy your meal. Thanks for ordering with Foodie!" : `Your order is on its way to ${escapeHtml(deliveryLocation)}.`}</p>
    <ol class="tracking-list">
      <li class="complete"><span></span><div><strong>Order confirmed</strong><small>Your restaurant is preparing your food</small></div></li>
      <li class="${delivered ? "complete" : "current"}"><span></span><div><strong>${delivered ? "Delivered" : "On the way"}</strong><small>${delivered ? "Order delivered successfully" : "Your delivery is heading to you"}</small></div></li>
    </ol>
    ${delivered ? `
      <button class="primary-button checkout-button" data-action="finish-order">Back to food</button>
    ` : `
      <button class="primary-button checkout-button" data-action="complete-delivery">Complete demo delivery</button>
      <p class="demo-note">Order #FD${String(Date.now()).slice(-5)} · Estimated arrival 25–35 min</p>
    `}
  `;
}

function renderOrderSummary() {
  const summaryItems = Object.entries(cart).map(([id, quantity]) => {
    const food = foods.find(item => item.id === Number(id));
    return `<div class="summary-item"><span>${food.name} × ${quantity}</span><strong>₹${food.price * quantity}</strong></div>`;
  }).join("");

  const total = Object.entries(cart).reduce((sum, [id, quantity]) => {
    const food = foods.find(item => item.id === Number(id));
    return sum + food.price * quantity;
  }, 0);

  return `<div class="order-summary"><h3>Order summary</h3>${summaryItems}<div class="summary-total"><span>Total amount</span><strong>₹${total}</strong></div></div>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function confirmOrder() {
  if (selectedPayment !== "Cash on delivery" && !paymentAttempted) {
    paymentAttempted = true;
    renderCheckout("payment-failed");
    return;
  }

  currentOrderId = `FD${String(Date.now()).slice(-5)}`;
  renderTracking("tracking");
  navigateTo("tracking");
}

function renderTracking(status) {
  const delivered = status === "delivered";
  trackingContent.innerHTML = `
    <div class="tracking-order-header">
      <div><span>Order number</span><strong>#${currentOrderId}</strong></div>
      <span class="order-status ${delivered ? "delivered" : "on-the-way"}">${delivered ? "Delivered" : "On the way"}</span>
    </div>
    <div class="tracking-destination"><span>Delivering to</span><strong>${escapeHtml(deliveryLocation)}</strong></div>
    <ol class="tracking-list">
      <li class="complete"><span></span><div><strong>Order confirmed</strong><small>Your restaurant is preparing your food</small></div></li>
      <li class="${delivered ? "complete" : "current"}"><span></span><div><strong>${delivered ? "Delivered" : "On the way"}</strong><small>${delivered ? "Order delivered successfully" : "Your delivery is heading to you"}</small></div></li>
    </ol>
    ${delivered
      ? '<button class="primary-button" data-action="finish-order">Back to food</button>'
      : '<p class="arrival-note">Estimated arrival <strong>25–35 min</strong></p><button class="primary-button" data-action="complete-delivery">Complete demo delivery</button><p class="demo-note">Demo tracking. Delivery status is simulated.</p>'}
  `;
}

searchInput.addEventListener("input", renderFoods);

document.querySelectorAll("#categories, #menuCategories").forEach(container => {
  container.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    selectedCategory = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach(category => {
      category.classList.toggle("active", category.dataset.category === selectedCategory);
    });
    renderFoods();

    if (container.id === "categories") navigateTo("menu");
  });
});

document.addEventListener("click", event => {
  const screenButton = event.target.closest("[data-screen-target]");
  if (screenButton) navigateTo(screenButton.dataset.screenTarget);
});

restaurantGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-restaurant-category]");
  if (!button) return;

  selectedCategory = button.dataset.restaurantCategory;
  searchInput.value = "";
  document.querySelectorAll("[data-category]").forEach(category => {
    category.classList.toggle("active", category.dataset.category === selectedCategory);
  });
  renderFoods();
  navigateTo("menu");
});

foodGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(Number(button.dataset.add));
    return;
  }

  if (event.target.closest("[data-browse-food]")) {
    selectedCategory = "All";
    searchInput.value = "";
    document.querySelectorAll("[data-category]").forEach(category => {
      category.classList.toggle("active", category.dataset.category === "All");
    });
    renderFoods();
  }
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;

  changeQuantity(Number(button.dataset.id), Number(button.dataset.change));
});

document.getElementById("cartBtn").addEventListener("click", () => navigateTo("cart"));
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

document.getElementById("locationBtn").addEventListener("click", () => {
  const location = window.prompt("Where should we deliver your order?", deliveryLocation);
  if (!location || !location.trim()) return;
  deliveryLocation = location.trim();
  document.getElementById("deliveryLocation").textContent = `📍 ${deliveryLocation}`;
  document.getElementById("restaurantLocation").textContent = `📍 ${deliveryLocation}`;
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.querySelector('.app-screen[data-screen="checkout"].active')) {
    navigateTo("cart");
  }
});

checkoutContent.addEventListener("submit", event => {
  if (event.target.id !== "locationForm") return;
  event.preventDefault();
  deliveryLocation = document.getElementById("addressInput").value.trim();
  document.getElementById("deliveryLocation").textContent = `📍 ${deliveryLocation}`;
  document.getElementById("restaurantLocation").textContent = `📍 ${deliveryLocation}`;
  renderCheckout("payment");
});

checkoutContent.addEventListener("change", event => {
  if (event.target.id === "paymentMethod") selectedPayment = event.target.value;
});

appMain.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "confirm-order":
    case "retry-payment":
      confirmOrder();
      break;
    case "change-payment":
      renderCheckout("payment");
      break;
    case "edit-location":
      renderCheckout("location");
      break;
    case "remove-unavailable":
      Object.keys(cart).forEach(id => {
        const food = foods.find(item => item.id === Number(id));
        if (food && food.available === false) delete cart[id];
      });
      updateCart();
      renderCheckout("location");
      break;
    case "browse-food":
      renderFoods();
      navigateTo("menu");
      break;
    case "complete-delivery":
      renderTracking("delivered");
      cart = {};
      updateCart();
      break;
    case "finish-order":
      paymentAttempted = false;
      selectedPayment = "UPI";
      navigateTo("home");
      break;
  }
});

document.getElementById("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const address = document.getElementById("profileAddress").value.trim();
  if (address) {
    deliveryLocation = address;
    document.getElementById("deliveryLocation").textContent = `📍 ${deliveryLocation}`;
    document.getElementById("restaurantLocation").textContent = `📍 ${deliveryLocation}`;
  }
  showToast("Profile details saved.");
});

renderFoods();
renderRestaurants();
updateCart();
