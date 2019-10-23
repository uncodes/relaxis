$(document).ready(function() {
  // dropdown menu
  $('.hamburger').click(function() {
    $(this).toggleClass('active');
    $('.header__menu-items').toggleClass('isHamburgerActive');
  });
  $('.dropdown-link').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
    $(this).next().toggleClass('active');
    $('.dropdown-menu').not($(this).siblings()).removeClass('active');
  });
  $(document).click(function(e) {
    if (!$(e.target).closest(".dropdown-link").length) {
      $('.dropdown-link').removeClass('active');
      $('.dropdown-menu').removeClass('active');
    }
    e.stopPropagation();
  });
  $('.dropdown-menu li a').click(function() {
    const el = $(this);
    if(el.attr('href') == "" || el.attr('href') == "#") {
      console.warn('Отстутствует ссылка');
      return false;
    } else {
      el.prevAll().removeClass('active');
    }
  });

  // dropdowm menu end

});