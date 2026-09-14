// ---------- Menu rendering (reads MENU + Cart, writes DOM) ----------

const menuRoot = document.getElementById("menuRoot");
const categoryNav = document.getElementById("categoryNav");

let activeCategoryId = MENU[0].id;

function renderCategoryNav() {
  categoryNav.innerHTML = MENU.map(
    (cat) =>
      `<a href="#cat-${cat.id}" data-cat="${cat.id}" class="${cat.id === activeCategoryId ? "active" : ""}">${cat.title}</a>`
  ).join("");
}

function showCategory(catId) {
  activeCategoryId = catId;
  [...categoryNav.querySelectorAll("a")].forEach((link) => {
    link.classList.toggle("active", link.dataset.cat === catId);
  });
  [...menuRoot.querySelectorAll(".category-section")].forEach((section) => {
    section.hidden = section.id !== `cat-${catId}`;
  });
}

categoryNav.addEventListener("click", (e) => {
  const link = e.target.closest("[data-cat]");
  if (!link) return;
  e.preventDefault();
  showCategory(link.dataset.cat);
});

function dishControlHtml(item) {
  const qty = Cart.items[item.id] || 0;
  if (qty === 0) {
    return `<button class="add-btn" data-add="${item.id}">Добавить</button>`;
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
    <section class="category-section" id="cat-${cat.id}" ${cat.id === activeCategoryId ? "" : "hidden"}>
      <div class="category-header">
        <h2>${cat.title}</h2>
        <span class="ornament-divider"></span>
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

function onCartChanged() {
  renderMenu();
  renderCartUI();
  updateCartBadges();
}

menuRoot.addEventListener("click", (e) => {
  const addId = e.target.closest("[data-add]")?.dataset.add;
  const incId = e.target.closest("[data-inc]")?.dataset.inc;
  const decId = e.target.closest("[data-dec]")?.dataset.dec;

  if (addId) {
    Cart.add(addId);
    showToast(`«${DISH_BY_ID[addId].name}» добавлено в корзину`);
    onCartChanged();
  }
  if (incId) {
    Cart.changeQuantity(incId, 1);
    onCartChanged();
  }
  if (decId) {
    Cart.changeQuantity(decId, -1);
    onCartChanged();
  }
});
