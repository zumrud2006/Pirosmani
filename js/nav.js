// ---------- Header status, scroll-spy, reveal-on-scroll, misc wiring ----------

function updateOpenStatus() {
  const el = document.getElementById("headerStatus");
  const textEl = document.getElementById("headerStatusText");
  if (!el || !textEl) return;
  const open = isOpenNow();
  el.classList.toggle("closed", !open);
  textEl.textContent = open
    ? `Открыто до ${RESTAURANT.hours.close}`
    : `Откроется в ${RESTAURANT.hours.open}`;
}

// ---------- Active category highlight while scrolling the menu ----------

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

// ---------- Reveal-on-scroll ----------

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function initRevealAnimations() {
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// ---------- Contacts WhatsApp link ----------

function initContactsLink() {
  const link = document.getElementById("contactsWhatsapp");
  if (link) link.href = waLink(RESTAURANT.whatsapp, "Здравствуйте!");
}
