// ---------- Init ----------

Cart.load();
renderCategoryNav();
renderMenu();
renderCartUI();
updateCartBadges();
updateOpenStatus();
initRevealAnimations();
initContactsLink();

setInterval(updateOpenStatus, 60000);
