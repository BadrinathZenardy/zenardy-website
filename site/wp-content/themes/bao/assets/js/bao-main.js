(function ($) {
"use strict";

/*=============================================
=                 Preloader                  =
=============================================*/
function preloader() {
	$('#preloader').delay(0).fadeOut();
};

$(window).on('load', function () {
	preloader(),
	wowAnimation();
	counter();
});

/*=============================================
=               Mobile Menu                  =
=============================================*/
$('#mobile-menu').meanmenu({
	meanMenuContainer: '.mobile-menu',
	meanScreenWidth: "991",
	meanMenuOpen:"<span></span><span></span><span></span>",
});

/*=============================================
=               Sticky Menu                  =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#header-sticky").removeClass("sticky-header");
		$(".sticky-height-fix").removeClass("sticky-jump-fix");
	} else {
		$("#header-sticky").addClass("sticky-header");
		$(".sticky-height-fix").addClass("sticky-jump-fix");
	}
});

/*=============================================
=              offCanvas  Menu                =
=============================================*/
$(".menu-tigger").on("click", function () {
	$(".extra-info, .offcanvas-overly").addClass("active");
	return false;
});
$(".menu-close,.offcanvas-overly").on("click", function () {
	$(".extra-info,.offcanvas-overly").removeClass("active");
});

/*=============================================
=           Data - Background                 =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})

/*=============================================
=           Features - Active                 =
=============================================*/
$('.features-box').hover(function () {
	$(this).find('.features-overlay p').slideToggle(400);
	return false;
});

/*=============================================
=           Magnific - Popup                 =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
	  enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});

/*=============================================
=               Isotope Active               =
=============================================*/
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

/*=============================================
=                 CounterUp                 =
=============================================*/
function counter() {
	$('.count').counterUp({
		delay: 10,
		time: 2000
	});
}

/*=============================================
=               Wow - Active                 =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}

})(jQuery);