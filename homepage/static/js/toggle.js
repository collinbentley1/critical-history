// Support mobile navigation menu
$(document).ready(function() {
  // Check for click events on the burger
  $(".navbar-burger").click(function() {
    // Toggle burger and menu "is-active"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});
