// ---------- Small shared helpers ----------

function formatPrice(n) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function waLink(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
