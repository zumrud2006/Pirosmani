// ---------- Restaurant data: contacts, hours, social ----------
// Only confirmed facts live here. Anything not confirmed by the restaurant is left as
// an explicit TODO rather than guessed — see RESTAURANT.todo below.

const RESTAURANT = {
  name: "Пиросмани",
  tagline: "Ресторан грузинской кухни",
  city: "Махачкала",
  address: "ул. Пушкина, 3, Махачкала, Респ. Дагестан",

  hours: { open: "12:00", close: "23:00" },

  // Confirmed by the restaurant: both booking and delivery/order messages go to this
  // number (they run one WhatsApp for both channels).
  whatsapp: "79634113232", // +7 963 411-32-32

  phoneDisplay: "+7 (963) 411-32-32",
  phoneHref: "+79634113232",

  // Shown in Instagram bio as a separate delivery line, but the restaurant confirmed
  // orders should go through the number above, not this one — kept here for reference
  // only (e.g. if a plain "call for delivery" link is ever needed).
  deliveryPhoneDisplay: "+7 (963) 416-67-67",

  instagram: "https://www.instagram.com/restaurant_pirosmani/",
  instagramHandle: "@restaurant_pirosmani",

  // TODO: not confirmed by the restaurant yet — fill in when available, do not guess.
  todo: {
    vkUrl: null,
    telegramUrl: null,
    mapEmbedUrl: null, // exact coordinates/Yandex or Google Maps embed for the address above
    seatingCapacity: null,
    banquetHallInfo: null,
  },
};

function isOpenNow(date = new Date()) {
  const [openH, openM] = RESTAURANT.hours.open.split(":").map(Number);
  const [closeH, closeM] = RESTAURANT.hours.close.split(":").map(Number);
  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return minutesNow >= openMinutes && minutesNow < closeMinutes;
}
