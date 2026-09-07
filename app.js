// ---------- Menu data ----------
// Add new categories/dishes here — id must stay unique across the whole menu.

const MENU = [
  {
    id: "fish",
    title: "Горячие блюда из рыбы",
    icon: "🐟",
    items: [
      { id: "f1", name: "Чашушули из судака", desc: "Судак жареный под горячим острым соусом чашушули", weight: "300 г", price: 1345 },
      { id: "f2", name: "Калмахи в гранатовом соусе", desc: "Жареная радужная форель со специями с соусом наршараб", weight: "300 г", price: 1245 },
      { id: "f3", name: "Судак жареный", desc: "Жаренное филе судака. Подается с соусом хардали", weight: "200 г", price: 1245 },
    ],
  },
  {
    id: "sauces",
    title: "Соусы",
    icon: "🥣",
    items: [
      { id: "s1", name: "Ткемали", desc: "", weight: "50 г", price: 95 },
      { id: "s2", name: "Сацибели", desc: "", weight: "50 г", price: 65 },
      { id: "s3", name: "Баже из грецких орехов", desc: "", weight: "100 г", price: 125 },
      { id: "s4", name: "Аджика красная", desc: "", weight: "50 г", price: 95 },
      { id: "s5", name: "Наршараб", desc: "", weight: "50 г", price: 165 },
      { id: "s6", name: "Мацони с чесноком и мятой", desc: "", weight: "100 г", price: 95 },
      { id: "s7", name: "Хардали с хреном", desc: "", weight: "50 г", price: 65 },
    ],
  },
  {
    id: "garnishes",
    title: "Гарниры",
    icon: "🥔",
    items: [
      { id: "g1", name: "Картофель по-деревенски", desc: "", weight: "200 г", price: 155 },
      { id: "g2", name: "Рис с овощами", desc: "", weight: "200 г", price: 285 },
      { id: "g3", name: "Картофель фри", desc: "", weight: "150 г", price: 215 },
      { id: "g4", name: "Рис отварной", desc: "", weight: "200 г", price: 195 },
      { id: "g5", name: "Картофель отварной с укропом", desc: "", weight: "250 г", price: 195 },
      { id: "g6", name: "Микс дикого и белого риса", desc: "", weight: "200 г", price: 495 },
    ],
  },
  {
    id: "lamb",
    title: "Горячие блюда из баранины",
    icon: "🐑",
    items: [
      { id: "l1", name: "Некнеби в аджике", desc: "Бараньи рёбрышки, обжаренные на сковороде с луком и аджикой", weight: "500 г", price: 1845 },
      { id: "l2", name: "Чашушули из баранины с грибами", desc: "Баранина тушёная с грибами и луком в кеци", weight: "300 г", price: 1245 },
      { id: "l3", name: "Чанахи из баранины", desc: "Баранина тушёная в горшочке с овощами", weight: "400 г", price: 1125 },
      { id: "l4", name: "Баранина оджахури", desc: "Жаркое из баранины с картофелем, заправленное традиционными грузинскими специями и зёрнами граната", weight: "300 г", price: 1075 },
    ],
  },
  {
    id: "khinkali",
    title: "Хинкали",
    icon: "🥟",
    items: [
      { id: "k1", name: "Хинкали по-горски с рубленой телятиной", desc: "", weight: "85 г", price: 135 },
      { id: "k2", name: "Хинкали с картофелем", desc: "Хинкали с начинкой из картофельного пюре", weight: "85 г", price: 65 },
      { id: "k3", name: "Хинкали с сыром", desc: "Хинкали с начинкой из сыра", weight: "85 г", price: 115 },
      { id: "k4", name: "Хинкали с телятиной", desc: "Хинкали с начинкой из телячьего фарша с луком и зеленью", weight: "85 г", price: 125 },
      { id: "k5", name: "Хинкали с грибами", desc: "Хинкали с начинкой из жареных грибов, лука и специй", weight: "85 г", price: 85 },
    ],
  },
];

const WHATSAPP_NUMBER = "79634113232"; // +7 963 411-32-32
const CART_STORAGE_KEY = "pirosmani_cart_v1";

// Flat lookup of every dish by id
const DISH_BY_ID = {};
MENU.forEach((cat) => cat.items.forEach((item) => (DISH_BY_ID[item.id] = item)));

// ---------- Cart state ----------

let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* ignore storage errors */
  }
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  renderMenu();
  showToast(`«${DISH_BY_ID[id].name}» добавлено в корзину`);
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }
  saveCart();
  renderCart();
  renderMenu();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  renderCart();
  renderMenu();
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + DISH_BY_ID[id].price * qty, 0);
}

function formatPrice(n) {
  return n.toLocaleString("ru-RU") + " ₽";
}

// ---------- Rendering: menu ----------

const menuRoot = document.getElementById("menuRoot");
const categoryNav = document.getElementById("categoryNav");

function renderNav() {
  categoryNav.innerHTML = MENU.map(
    (cat) => `<a href="#cat-${cat.id}" data-cat="${cat.id}">${cat.icon} ${cat.title}</a>`
  ).join("");
}

function dishControlHtml(item) {
  const qty = cart[item.id] || 0;
  if (qty === 0) {
    return `<button class="add-btn" data-add="${item.id}">Добавить в корзину</button>`;
  }
  return `
    <div class="qty-stepper">
      <button data-dec="${item.id}" aria-label="Уменьшить количество">&minus;</button>
      <span class="qty-value">${qty}</span>
      <button data-inc="${item.id}" aria-label="Увеличить количество">&plus;</button>
    </div>
  `;
}

function renderMenu() {
  menuRoot.innerHTML = MENU.map(
    (cat) => `
    <section class="category-section" id="cat-${cat.id}">
      <div class="category-header">
        <span class="category-icon">${cat.icon}</span>
        <h2>${cat.title}</h2>
        <span class="ornament"></span>
      </div>
      <div class="dish-grid">
        ${cat.items
          .map(
            (item) => `
          <article class="dish-card">
            <h3 class="dish-name">${item.name}</h3>
            ${item.desc ? `<p class="dish-desc">${item.desc}</p>` : ""}
            <div class="dish-meta">
              <span class="dish-weight">${item.weight}</span>
              <span class="dish-price">${formatPrice(item.price)}</span>
            </div>
            <div class="dish-action">${dishControlHtml(item)}</div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `
  ).join("");
}

menuRoot.addEventListener("click", (e) => {
  const addId = e.target.closest("[data-add]")?.dataset.add;
  const incId = e.target.closest("[data-inc]")?.dataset.inc;
  const decId = e.target.closest("[data-dec]")?.dataset.dec;
  if (addId) addToCart(addId);
  if (incId) changeQty(incId, 1);
  if (decId) changeQty(decId, -1);
});

// ---------- Rendering: cart drawer ----------

const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartSummaryEl = document.getElementById("cartSummary");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");

function renderCart() {
  const ids = Object.keys(cart);
  cartCountEl.hidden = cartCount() === 0;
  cartCountEl.textContent = cartCount();

  if (ids.length === 0) {
    cartItemsEl.innerHTML = "";
    cartItemsEl.appendChild(cartEmptyEl);
    cartSummaryEl.hidden = true;
    return;
  }

  cartSummaryEl.hidden = false;
  cartItemsEl.innerHTML = ids
    .map((id) => {
      const item = DISH_BY_ID[id];
      const qty = cart[id];
      return `
      <div class="cart-line">
        <div class="cart-line-info">
          <p class="cart-line-name">${item.name}</p>
          <span class="cart-line-price">${formatPrice(item.price)} · ${item.weight}</span><br>
          <button class="cart-line-remove" data-remove="${id}">убрать</button>
        </div>
        <div class="cart-line-controls">
          <button data-dec="${id}" aria-label="Уменьшить количество">&minus;</button>
          <span>${qty}</span>
          <button data-inc="${id}" aria-label="Увеличить количество">&plus;</button>
        </div>
        <div class="cart-line-subtotal">${formatPrice(item.price * qty)}</div>
      </div>
    `;
    })
    .join("");

  cartTotalEl.textContent = formatPrice(cartTotal());
}

cartItemsEl.addEventListener("click", (e) => {
  const incId = e.target.closest("[data-inc]")?.dataset.inc;
  const decId = e.target.closest("[data-dec]")?.dataset.dec;
  const removeId = e.target.closest("[data-remove]")?.dataset.remove;
  if (incId) changeQty(incId, 1);
  if (decId) changeQty(decId, -1);
  if (removeId) removeFromCart(removeId);
});

// ---------- Cart drawer open/close ----------

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");

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

// ---------- Toast ----------

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Checkout via WhatsApp ----------

const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) return;

  const formData = new FormData(checkoutForm);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const address = formData.get("address").trim();
  const comment = formData.get("comment").trim();

  const lines = Object.entries(cart).map(([id, qty], index) => {
    const item = DISH_BY_ID[id];
    return `${index + 1}. ${item.name} x${qty} — ${formatPrice(item.price * qty)}`;
  });

  const messageParts = [
    "Новый заказ — Pirosmani",
    "",
    ...lines,
    "",
    `Итого: ${formatPrice(cartTotal())}`,
    "",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Адрес доставки: ${address}`,
  ];
  if (comment) messageParts.push(`Комментарий: ${comment}`);

  const message = messageParts.join("\n");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// ---------- Active category highlight on scroll ----------

function setActiveNavLink() {
  const links = [...categoryNav.querySelectorAll("a")];
  const sections = MENU.map((cat) => document.getElementById(`cat-${cat.id}`));
  let currentId = sections[0]?.id;
  for (const section of sections) {
    if (section && section.getBoundingClientRect().top <= 140) {
      currentId = section.id;
    }
  }
  links.forEach((link) => {
    link.classList.toggle("active", `cat-${link.dataset.cat}` === currentId);
  });
}

window.addEventListener("scroll", () => window.requestAnimationFrame(setActiveNavLink));

// ---------- Init ----------

renderNav();
renderMenu();
renderCart();
setActiveNavLink();
