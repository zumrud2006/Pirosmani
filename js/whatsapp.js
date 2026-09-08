// ---------- WhatsApp message generators (pure text builders, no DOM) ----------

function generateWhatsAppOrder(cart = Cart) {
  const lines = cart.entries().map(({ dish, qty }) => {
    const unit = `${qty} × ${formatPrice(dish.price)}`;
    const lineTotal = formatPrice(dish.price * qty);
    return `${dish.name} — ${unit} = ${lineTotal}`;
  });

  return [
    "Здравствуйте! Хочу оформить заказ:",
    "",
    ...lines,
    "",
    `Итого: ${formatPrice(cart.total())}`,
    "",
    "Дальнейшие детали заказа уточню с рестораном здесь, в WhatsApp.",
  ].join("\n");
}

function generateWhatsAppBooking({ date, time, guests }) {
  return [
    "Здравствуйте! Хочу забронировать стол.",
    `Дата: ${date}`,
    `Время: ${time}`,
    `Гостей: ${guests}`,
    "",
    "Дальнейшее подтверждение — здесь, в WhatsApp.",
  ].join("\n");
}

function whatsAppOrderUrl(cart = Cart) {
  return waLink(RESTAURANT.whatsapp, generateWhatsAppOrder(cart));
}

function whatsAppBookingUrl(data) {
  return waLink(RESTAURANT.whatsapp, generateWhatsAppBooking(data));
}
