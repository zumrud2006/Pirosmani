// ---------- Init ----------

Cart.load();
renderCategoryNav();
renderMenu();
renderCartUI();
updateCartBadges();
setActiveNavLink();
updateOpenStatus();
initRevealAnimations();
initContactsLink();

setInterval(updateOpenStatus, 60000);
