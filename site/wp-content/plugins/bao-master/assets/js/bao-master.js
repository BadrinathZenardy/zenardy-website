(function ($) {
"use strict";

    $(window).on('load', function () {
        preloader();
    });

    function preloader() {
        $('#preloader').delay(0).fadeOut();
    };

    // offcanvas menu
    $(".menu-tigger").on("click", function () {
        $(".offcanvas-menu,.offcanvas-overly").addClass("active");
        return false;
    });
    $(".menu-close,.offcanvas-overly").on("click", function () {
        $(".offcanvas-menu,.offcanvas-overly").removeClass("active");
    });

    // Tab slider
    $('.portfolio-active').imagesLoaded( function() {
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
    });


    // Dustrial with jQuery Wrapper
    jQuery(document).ready(function(){  
        //fade in/out based on scrollTop value
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 0) {
                jQuery('#scroller').fadeIn();
            } else {
                jQuery('#scroller').fadeOut();
            }
        });
     
        // scroll body to 0px on click
        jQuery('#scroller').click(function () {
            jQuery('body,html').animate({
                scrollTop: 0
            }, 400);
            return false;
        });
    });

})(jQuery);