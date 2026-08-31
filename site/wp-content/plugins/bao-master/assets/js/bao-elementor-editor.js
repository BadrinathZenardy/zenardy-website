( function( $ ) {  
   
  var databg = function( $scope, $ ) {
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    })
  }

  /* = Isotope Active
  =============================================*/
  var portfolioisotop = function( $scope, $ ) {
    $('.portfolio-grid').imagesLoaded( function() {
      // init Isotope
      var $grid = $('.portfolio-grid').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
        columnWidth: '.grid-item',
        }
      });
      // filter items on button click
      $('.portfolio-menu').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
    });

    //for menu active class
    $('.portfolio-menu button').on('click', function(event) {
      $(this).siblings('.active').removeClass('active');
      $(this).addClass('active');
      event.preventDefault();
    });
  }
  /* = Portfolio Active
  =============================================*/
  var bao_tab_slider = function( $scope, $ ) {
    $('.portfolio-active').owlCarousel({
        loop: true,
        margin: 30,
        items: 3,
        autoplay: false,
        autoplayTimeout: 5000,
        autoplaySpeed: 1000,
        nav: true,
        navText: ['<i class="fal fa-arrow-left"></i>', '<i class="fal fa-arrow-right"></i>'],
        dots: false,
        responsive: {
            0: {
                items: 1,
                center: false,
                margin: 30,
                nav: false,
            },
            575: {
                items: 1,
                center: false,
                margin: 30,
                nav: false,
            },
            768: {
                items: 2,
                center: false,
                margin: 30,
                nav: false,
            },
            992: {
                items: 3,
                center: false,
                margin: 30
            },
            1500: {
                items: 3
            },
        }
    })
  }

  /* = Piechart
  =============================================*/
  var piechart = function( $scope, $ ) {
    // Avoid `console` errors in browsers that lack a console.
    (function() {
        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());


    /**
     * CircleCount
     */
    ! function (t) {
        "use strict";

        function e() {
            var t = document.createElement("style");
            t.appendChild(document.createTextNode("@-ms-viewport { width: device-width; }")), navigator.userAgent.match(/IEMobile\/10\.0/) && t.appendChild(document.createTextNode("@-ms-viewport { width: auto !important; }")), document.getElementsByTagName("head")[0].appendChild(t)
        }

        function a() {
            t(".pie-chart").each(function () {
                var e = t(this),
                    a = e.parent().width(),
                    i = e.attr("data-barSize");
                i > a && (i = a), e.css("height", i), e.css("width", i), e.css("line-height", i + "px"), e.find("i").css({
                    "line-height": i + "px",
                    "font-size": i / 3
                })
            })
        }

        function i() {
            "undefined" != typeof t.fn.easyPieChart && t(".pie-chart:in-viewport").each(function () {
                var e = t(this),
                    a = e.parent().width(),
                    i = e.attr("data-barSize"),
                    n = "square";
                void 0 !== e.attr("data-lineCap") && (n = e.attr("data-lineCap")), i > a && (i = a), e.easyPieChart({
                    animate: 1300,
                    lineCap: n,
                    lineWidth: e.attr("data-lineWidth"),
                    size: i,
                    barColor: e.attr("data-barColor"),
                    trackColor: e.attr("data-trackColor"),
                    scaleColor: "transparent",
                    onStep: function (e, a, i) {
                        t(this.el).find(".pie-chart-percent span").text(Math.round(i))
                    }
                })
            })
        }
        t(document).ready(function () {
            e(), a(), i()
        }), t(window).scroll(function () {
            i()
        })
    }(window.jQuery);


    /* easyPieChart - v2.1.3 - Lightweight plugin to render simple, animated and retina optimized pie charts
     * http://rendro.github.io/easy-pie-chart/
     * Copyright (c) 2013 Robert Fleischmann. Dual licensed under the MIT and GPL licenses.
     */
    !function (a, b) { "object" == typeof exports ? module.exports = b(require("jquery")) : "function" == typeof define && define.amd ? define("EasyPieChart", ["jquery"], b) : b(a.jQuery) }(this, function (a) { var b = function (a, b) { var c, d = document.createElement("canvas"); "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(d); var e = d.getContext("2d"); d.width = d.height = b.size, a.appendChild(d); var f = 1; window.devicePixelRatio > 1 && (f = window.devicePixelRatio, d.style.width = d.style.height = [b.size, "px"].join(""), d.width = d.height = b.size * f, e.scale(f, f)), e.translate(b.size / 2, b.size / 2), e.rotate((-0.5 + b.rotate / 180) * Math.PI); var g = (b.size - b.lineWidth) / 2; b.scaleColor && b.scaleLength && (g -= b.scaleLength + 2), Date.now = Date.now || function () { return +new Date }; var h = function (a, b, c) { c = Math.min(Math.max(-1, c || 0), 1); var d = 0 >= c ? !0 : !1; e.beginPath(), e.arc(0, 0, g, 0, 2 * Math.PI * c, d), e.strokeStyle = a, e.lineWidth = b, e.stroke() }, i = function () { var a, c, d = 24; e.lineWidth = 1, e.fillStyle = b.scaleColor, e.save(); for (var d = 24; d > 0; --d)d % 6 === 0 ? (c = b.scaleLength, a = 0) : (c = .6 * b.scaleLength, a = b.scaleLength - c), e.fillRect(-b.size / 2 + a, 0, c, 1), e.rotate(Math.PI / 12); e.restore() }, j = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) { window.setTimeout(a, 1e3 / 60) } }(), k = function () { b.scaleColor && i(), b.trackColor && h(b.trackColor, b.lineWidth, 1) }; this.clear = function () { e.clearRect(b.size / -2, b.size / -2, b.size, b.size) }, this.draw = function (a) { b.scaleColor || b.trackColor ? e.getImageData && e.putImageData ? c ? e.putImageData(c, 0, 0) : (k(), c = e.getImageData(0, 0, b.size * f, b.size * f)) : (this.clear(), k()) : this.clear(), e.lineCap = b.lineCap; var d; d = "function" == typeof b.barColor ? b.barColor(a) : b.barColor, h(d, b.lineWidth, a / 100) }.bind(this), this.animate = function (a, c) { var d = Date.now(); b.onStart(a, c); var e = function () { var f = Math.min(Date.now() - d, b.animate.duration), g = b.easing(this, f, a, c - a, b.animate.duration); this.draw(g), b.onStep(a, c, g), f >= b.animate.duration ? b.onStop(a, c) : j(e) }.bind(this); j(e) }.bind(this) }, c = function (a, c) { var d = { barColor: "#ef1e25", trackColor: "#f9f9f9", scaleColor: "#dfe0e0", scaleLength: 5, lineCap: "round", lineWidth: 3, size: 110, rotate: 0, animate: { duration: 1e3, enabled: !0 }, easing: function (a, b, c, d, e) { return b /= e / 2, 1 > b ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c }, onStart: function () { }, onStep: function () { }, onStop: function () { } }; if ("undefined" != typeof b) d.renderer = b; else { if ("undefined" == typeof SVGRenderer) throw new Error("Please load either the SVG- or the CanvasRenderer"); d.renderer = SVGRenderer } var e = {}, f = 0, g = function () { this.el = a, this.options = e; for (var b in d) d.hasOwnProperty(b) && (e[b] = c && "undefined" != typeof c[b] ? c[b] : d[b], "function" == typeof e[b] && (e[b] = e[b].bind(this))); e.easing = "string" == typeof e.easing && "undefined" != typeof jQuery && jQuery.isFunction(jQuery.easing[e.easing]) ? jQuery.easing[e.easing] : d.easing, "number" == typeof e.animate && (e.animate = { duration: e.animate, enabled: !0 }), "boolean" != typeof e.animate || e.animate || (e.animate = { duration: 1e3, enabled: e.animate }), this.renderer = new e.renderer(a, e), this.renderer.draw(f), a.dataset && a.dataset.percent ? this.update(parseFloat(a.dataset.percent)) : a.getAttribute && a.getAttribute("data-percent") && this.update(parseFloat(a.getAttribute("data-percent"))) }.bind(this); this.update = function (a) { return a = parseFloat(a), e.animate.enabled ? this.renderer.animate(f, a) : this.renderer.draw(a), f = a, this }.bind(this), this.disableAnimation = function () { return e.animate.enabled = !1, this }, this.enableAnimation = function () { return e.animate.enabled = !0, this }, g() }; a.fn.easyPieChart = function (b) { return this.each(function () { var d; a.data(this, "easyPieChart") || (d = a.extend({}, b, a(this).data()), a.data(this, "easyPieChart", new c(this, d))) }) } });


    /* Viewport - jQuery selectors for finding elements in viewport
     * http://www.appelsiini.net/projects/viewport
     * Copyright (c) 2008-2009 Mika Tuupola. Released under the MIT license.
     */
    (function ($) { $.belowthefold = function (element, settings) { var fold = $(window).height() + $(window).scrollTop(); return fold <= $(element).offset().top - settings.threshold; }; $.abovethetop = function (element, settings) { var top = $(window).scrollTop(); return top >= $(element).offset().top + $(element).height() - settings.threshold; }; $.rightofscreen = function (element, settings) { var fold = $(window).width() + $(window).scrollLeft(); return fold <= $(element).offset().left - settings.threshold; }; $.leftofscreen = function (element, settings) { var left = $(window).scrollLeft(); return left >= $(element).offset().left + $(element).width() - settings.threshold; }; $.inviewport = function (element, settings) { return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings); }; $.extend($.expr[':'], { "below-the-fold": function (a, i, m) { return $.belowthefold(a, { threshold: 0 }); }, "above-the-top": function (a, i, m) { return $.abovethetop(a, { threshold: 0 }); }, "left-of-screen": function (a, i, m) { return $.leftofscreen(a, { threshold: 0 }); }, "right-of-screen": function (a, i, m) { return $.rightofscreen(a, { threshold: 0 }); }, "in-viewport": function (a, i, m) { return $.inviewport(a, { threshold: 0 }); } }); })(jQuery);

  }
  
  // Make sure you run this code under Elementor.
  $( window ).on( 'elementor/frontend/init', function() {
    elementorFrontend.hooks.addAction( 'frontend/element_ready/section-service.default', databg );
    elementorFrontend.hooks.addAction( 'frontend/element_ready/single-service-item.default', databg );
    elementorFrontend.hooks.addAction( 'frontend/element_ready/bao-tab-slider.default', bao_tab_slider );
    elementorFrontend.hooks.addAction( 'frontend/element_ready/ifinger-piechart.default', piechart );
    elementorFrontend.hooks.addAction( 'frontend/element_ready/section-filter.default', portfolioisotop );
    elementorFrontend.hooks.addAction( 'frontend/element_ready/single-icon-item.default', databg );
  } );
})( jQuery );