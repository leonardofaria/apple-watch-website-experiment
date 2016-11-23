var App = App || {};

App.Util = (function ($) {
  var isElementInView = function(element, fullyInView) {
    var pageTop = $(window).scrollTop();
    var pageBottom = pageTop + $(window).height();
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).height();

    if (fullyInView === true) {
      return ((pageTop < elementTop) && (pageBottom > elementBottom));
    }

    return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
  };

  var percentageSeen = function(element) {
    var viewportHeight = $(window).height();
    var scrollTop = $(window).scrollTop();
    var elementOffsetTop = $(element).offset().top;
    var elementHeight = $(element).height();

    if (elementOffsetTop > (scrollTop + viewportHeight)) {
      return 0;
    } else if ((elementOffsetTop + elementHeight) < scrollTop) {
      return 100;
    }

    var distance = (scrollTop + viewportHeight) - elementOffsetTop;
    var percentage = distance / ((viewportHeight + elementHeight) / 100);
    percentage = Math.round(percentage);
    return percentage;
  };

  return {
    isElementInView: isElementInView,
    percentageSeen: percentageSeen
  };

}(jQuery));
