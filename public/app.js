var App = App || {};

$(document).ready(function() {
  for (var module in App) {
    if ('init' in App[module]) {
      App[module].init();
    }
  }
});

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

var App = App || {};

App.Home = function($) {
  var lastScrollY = 0;
  var ticking = false;
  var speedDivider = 250;

  // RequestAnimationFrame polyfill for older browsers
  var rafPolyfill = function() {
    var lastTime;
    var vendors;
    var x;
    lastTime = 0;
    vendors = ['webkit', 'moz'];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        var currTime;
        var id;
        var timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  };

  // This will limit the calculation of the background position to
  // 60fps as well as blocking it from running multiple times at once
  var requestTick = function() {
    if (!ticking) {
      window.requestAnimationFrame(updatePosition);
      ticking = true;
    }
  };

  var updatePosition = function() {
    var cutoff = $(window).scrollTop();
    var homeIsVisible = App.Util.isElementInView($('.home'), false);

    $('section').each(function() {
      var isVisible = App.Util.isElementInView($(this), false);

      if (isVisible) {
        $(this).addClass('visible');
      } else {
        $(this).removeClass('visible');
      }

      if ($(this).offset().top + $(this).height() > cutoff) {
        $('section').removeClass('active');

        if (!homeIsVisible) {
          $(this).addClass('active');
        }

        return false; // stops the iteration after the first one on screen
      }
    });

    if ($('.visible').length > 0) {
      $('.visible').each(function() {
        var variation = -App.Util.percentageSeen(this);
        $(this).find('.hero-container').css('transform', 'translate3d(0%, ' + variation + 'px, 0px)');
      });
    }

    if ($('.active').length > 0) {
      var active = document.querySelector('.active');
      var scrollContainer = active.querySelector('.scroll-container');
      var heroContent = scrollContainer.querySelector('.hero-content');
      var scrollContainerY = scrollContainer.getBoundingClientRect().top;
      var heroContentY = heroContent.getBoundingClientRect().top;

      var opacityValue;
      var opacityCoverValue;
      var translateValue = scrollContainerY / speedDivider;

      if ((scrollContainerY <= 0 || heroContentY === 0)) {
        heroContent.classList.add('stickying');
        heroContent.classList.remove('stuck');
        heroContent.style.top = '0px';
      }

      var opacityCover = scrollContainer.querySelector('.opacity-cover');
      opacityValue = -(translateValue / 5);
      opacityValue = opacityValue > 0.5 ? 0.5 : opacityValue;
      opacityValue = opacityValue < 0 ? 0 : opacityValue;
      opacityCover.style.opacity = opacityValue;

      var copyContainer = scrollContainer.querySelector('.copy-container');
      opacityCoverValue = -(translateValue / 1.5);
      opacityCoverValue = opacityCoverValue > 1 ? 1 : opacityCoverValue;
      opacityCoverValue = opacityCoverValue < 0 ? 0 : opacityCoverValue;
      copyContainer.style.opacity = opacityCoverValue;

      var copyContainerY = copyContainer.getBoundingClientRect().top;

      if (copyContainerY < 0) {
        var top = copyContainer.getBoundingClientRect().height - active.getBoundingClientRect().height;

        heroContent.classList.remove('stickying');
        heroContent.classList.add('stuck');
        heroContent.style.top = -top + 'px';
      } else {
        heroContent.style.top = 0;
      }
    }

    // Stop ticking
    ticking = false;
  };

  // Update scroll value and request tick
  var doScroll = function() {
    lastScrollY = window.scrollY || window.pageYOffset;
    requestTick();
  };

  var init = function() {
    rafPolyfill();
    window.addEventListener('scroll', doScroll);
  };

  return {
    init: init
  };
}(jQuery);
