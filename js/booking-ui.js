// ---------- Booking mini-form → WhatsApp ----------

const bookingForm = document.getElementById("bookingForm");
const guestsValueEl = document.getElementById("guestsValue");
const guestsInput = document.getElementById("guestsInput");

let guests = 2;
function setGuests(next) {
  guests = Math.min(20, Math.max(1, next));
  guestsValueEl.textContent = guests;
  guestsInput.value = guests;
}

document.getElementById("guestsInc").addEventListener("click", () => setGuests(guests + 1));
document.getElementById("guestsDec").addEventListener("click", () => setGuests(guests - 1));

function formatBookingDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(bookingForm);
  const date = formatBookingDate(formData.get("date"));
  const time = formData.get("time");

  window.open(
    whatsAppBookingUrl({ date, time, guests: formData.get("guests") }),
    "_blank"
  );
});
