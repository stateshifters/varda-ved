$(function(){
 var shrinkHeader = 400;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
      if ( scroll >= shrinkHeader ) {
           $('#main_nav').addClass('shrink');
        }
        else {
            $('#main_nav').removeClass('shrink');
        }
  });
function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
    }
});