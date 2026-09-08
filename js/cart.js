// ---------- Cart state (data + localStorage persistence only, no DOM) ----------

const CART_STORAGE_KEY = "pirosmani_cart_v1";

const Cart = {
  items: {}, // { [dishId]: quantity }

  load() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.items = {};
    }
    return this.items;
  },

  save() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      /* storage unavailable — cart still works for this page view */
    }
  },

  add(dishId) {
    this.items[dishId] = (this.items[dishId] || 0) + 1;
    this.save();
  },

  setQuantity(dishId, qty) {
    if (qty <= 0) {
      delete this.items[dishId];
    } else {
      this.items[dishId] = qty;
    }
    this.save();
  },

  changeQuantity(dishId, delta) {
    this.setQuantity(dishId, (this.items[dishId] || 0) + delta);
  },

  remove(dishId) {
    delete this.items[dishId];
    this.save();
  },

  clear() {
    this.items = {};
    this.save();
  },

  count() {
    return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
  },

  total(dishById = DISH_BY_ID) {
    return Object.entries(this.items).reduce(
      (sum, [id, qty]) => sum + (dishById[id]?.price || 0) * qty,
      0
    );
  },

  entries(dishById = DISH_BY_ID) {
    return Object.entries(this.items)
      .map(([id, qty]) => ({ dish: dishById[id], qty }))
      .filter((line) => line.dish);
  },
};
