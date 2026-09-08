// ---------- Cart drawer rendering + open/close + checkout ----------

const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartSummaryEl = document.getElementById("cartSummary");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const mobileNavCartBadge = document.getElementById("mobileNavCartBadge");

function updateCartBadges() {
  const count = Cart.count();
  [cartCountEl, mobileNavCartBadge].forEach((el) => {
    if (!el) return;
    el.hidden = count === 0;
    el.textContent = count;
  });
}

function renderCartUI() {
  const lines = Cart.entries();

  if (lines.length === 0) {
    cartItemsEl.innerHTML = "";
    cartItemsEl.appendChild(cartEmptyEl);
    cartSummaryEl.hidden = true;
    return;
  }

  cartSummaryEl.hidden = false;
  cartItemsEl.innerHTML = lines
    .map(
      ({ dish, qty }) => `
      <div class="cart-line">
        <div class="cart-line-info">
          <p class="cart-line-name">${dish.name}</p>
          <span class="cart-line-price">${formatPrice(dish.price)} · ${dish.weight}</span><br>
          <button class="cart-line-remove" data-remove="${dish.id}">убрать</button>
        </div>
        <div class="cart-line-controls">
          <button data-dec="${dish.id}" aria-label="Уменьшить количество">&minus;</button>
          <span>${qty}</span>
          <button data-inc="${dish.id}" aria-label="Увеличить количество">&plus;</button>
        </div>
        <div class="cart-line-subtotal">${formatPrice(dish.price * qty)}</div>
      </div>
    `
    )
    .join("");

  cartTotalEl.textContent = formatPrice(Cart.total());
}

cartItemsEl.addEventListener("click", (e) => {
  const incId = e.target.closest("[data-inc]")?.dataset.inc;
  const decId = e.target.closest("[data-dec]")?.dataset.dec;
  const removeId = e.target.closest("[data-remove]")?.dataset.remove;

  if (incId) Cart.changeQuantity(incId, 1);
  if (decId) Cart.changeQuantity(decId, -1);
  if (removeId) Cart.remove(removeId);

  if (incId || decId || removeId) {
    renderMenu();
    renderCartUI();
    updateCartBadges();
  }
});

// ---------- Open / close ----------

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const mobileNavCart = document.getElementById("mobileNavCart");

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
mobileNavCart.addEventListener("click", (e) => {
  e.preventDefault();
  openCart();
});

// ---------- Checkout ----------

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (Cart.count() === 0) return;
  window.open(whatsAppOrderUrl(), "_blank");
});

// ---------- Toast ----------

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
