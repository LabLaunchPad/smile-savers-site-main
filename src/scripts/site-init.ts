// Vanilla port of the template's client-side initialisation glue.
// Runs once per page load (Astro MPA = full navigation, no SPA re-runs needed).
// Requires jQuery + template plugins loaded before this script (see Layout.astro).

function initCustomBackgrounds(): void {
  document.querySelectorAll<HTMLElement>('[data-bgcolor]').forEach((el) => {
    const bgColor = el.dataset.bgcolor;
    if (!bgColor) return;
    el.classList.add('bgcustom');
    el.style.backgroundColor = bgColor;
  });

  document.querySelectorAll<HTMLElement>('[data-bgimage]').forEach((el) => {
    const bgImage = el.dataset.bgimage;
    if (!bgImage) return;
    el.classList.add('bgcustom');
    el.style.background = bgImage;
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';
  });
}

function initMagnificPopup(): void {
  const $ = window.jQuery;
  if (!$ || !$.fn || !$.fn.magnificPopup) return;

  $(
    '.popup-youtube, .popup-vimeo, .popup-gmaps, .image-popup, .image-popup-vertical-fit, .image-popup-fit-width, .image-popup-no-margins, .image-popup-gallery'
  ).off('click.magnificPopup');
  $('.zoom-gallery, .images-group, .images-popup').off('click.magnificPopup');

  $('.zoom-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: 'mfp-with-zoom mfp-img-mobile',
    image: {
      verticalFit: true,
      titleSrc: (item: { el: { attr(name: string): string } }) => item.el.attr('title'),
    },
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      duration: 300,
      opener: (element: { find(sel: string): unknown }) => element.find('img'),
    },
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  $('.image-popup').magnificPopup({
    type: 'image',
    mainClass: 'mfp-with-zoom',
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: (openerElement: { is(sel: string): boolean; find(sel: string): unknown }) =>
        openerElement.is('img') ? openerElement : openerElement.find('img'),
    },
  });

  $('.image-popup-vertical-fit').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true,
    },
  });

  $('.image-popup-fit-width').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    image: {
      verticalFit: false,
    },
  });

  $('.image-popup-no-margins').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom',
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300,
    },
  });

  $('.image-popup-gallery').magnificPopup({
    type: 'image',
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: 'mfp-with-zoom mfp-img-mobile',
    image: {
      verticalFit: true,
      titleSrc: (item: { el: { attr(name: string): string } }) => item.el.attr('title'),
    },
    gallery: {
      enabled: true,
    },
  });

  $('.images-group').each((_index: number, el: HTMLElement) => {
    $(el).magnificPopup({
      delegate: 'a',
      type: 'image',
      gallery: {
        enabled: true,
      },
    });
  });

  $('.images-popup').magnificPopup({
    delegate: 'a',
    type: 'image',
  });
}

function initOwlCarousel(): boolean {
  const $ = window.jQuery;
  if (!$ || !$.fn || !$.fn.owlCarousel) return false;

  // ponytail: honor reduced-motion — a nonstop ticker must stay off for those users
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reset = (selector: string): void => {
    $(selector).each((_index: number, el: HTMLElement) => {
      const $el = $(el);
      if ($el.hasClass('owl-loaded')) {
        $el.trigger('destroy.owl.carousel');
        $el.removeClass('owl-loaded owl-hidden');
        $el.find('.owl-stage-outer').children().unwrap();
      }
    });
  };

  reset('.owl-single-dots');
  reset('.four-cols-center-dots');

  $('.owl-single-dots').owlCarousel({
    loop: true,
    items: 1,
    nav: false,
    dots: true,
    autoplay: !calm,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  });

  $('.four-cols-center-dots').owlCarousel({
    center: true,
    loop: true,
    margin: 25,
    autoplay: !calm,
    // ponytail: equal timeout/speed + linear = continuous glide, no stop-start
    slideTransition: 'linear',
    autoplayTimeout: 3000,
    autoplaySpeed: 3000,
    smartSpeed: 3000,
    autoplayHoverPause: true,
    responsive: {
      1200: { items: 4 },
      1000: { items: 3 },
      600: { items: 2 },
      0: { items: 1 },
    },
  });

  return true;
}

function initAccordion(): void {
  const $ = window.jQuery;
  if (!$ || !$.fn) return;

  // Template scripts also bind these nodes directly; clear those first so only one handler toggles.
  $('.accordion-section-title').off('click');
  $(document).off('click.accordionSmile', '.accordion-section-title');
  $(document).on(
    'click.accordionSmile',
    '.accordion-section-title',
    function (this: HTMLElement, e) {
      const currentAttrvalue = $(this).data('tab') as string;
      if ($(e.target).is('.active')) {
        $(this).removeClass('active');
        $('.accordion-section-content:visible').slideUp(300);
        return;
      }

      $('.accordion-section-title').removeClass('active');
      $(this).addClass('active');
      $('.accordion-section-content').slideUp(300);
      $(currentAttrvalue).slideDown(300);
    }
  );
}

function resetMobileHeaderState(): void {
  const header = document.querySelector('header');
  const isMenuOpen = header?.classList.contains('menu-open');

  if (header) {
    const baseClasses = (header.getAttribute('data-base-class') || '')
      .split(' ')
      .map((className) => className.trim())
      .filter(Boolean);
    const keepMobileClass = window.innerWidth <= 992 ? ['header-mobile'] : [];
    const keepOpenClass = isMenuOpen ? ['menu-open'] : [];

    let finalClasses = [...baseClasses, ...keepMobileClass, ...keepOpenClass];
    // If menu is open, remove autoshow to prevent interference
    if (isMenuOpen) {
      finalClasses = finalClasses.filter((c) => c !== 'autoshow');
    }

    header.className = finalClasses.join(' ');

    if (isMenuOpen) {
      (header as HTMLElement).style.height = `${window.innerHeight}px`;
    } else {
      (header as HTMLElement).style.height = 'auto';
      (header as HTMLElement).style.top = '0px';
      (header as HTMLElement).style.marginTop = '0px';
    }
  }

  const menuButton = document.getElementById('menu-btn');
  if (menuButton && !isMenuOpen) {
    menuButton.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  if (!isMenuOpen) {
    document.body.classList.remove('no-scroll');
  }

  const $ = window.jQuery;
  if (!$ || !$.fn) return;

  if (!isMenuOpen) {
    $('#mainmenu li ul').removeAttr('style');
    $('#mainmenu li span').removeClass('active');
    $('#mainmenu li').removeAttr('style');
    $('#mainmenu').removeAttr('style');
  }
}

function stabilizeMobileMenu(): void {
  const $ = window.jQuery;
  if (!$ || !$.fn) return;

  // OWNERSHIP: submenu arrows — stabilizeMobileMenu OWNS injection + mobile toggle.
  // LabLaunchPad.menu_arrow also injects spans; both must stay consistent, never add a third.
  // NEVER change: selector '#mainmenu li > span', classes 'has-child/menu-item-has-children/active'.
  $('#mainmenu li > span').remove();
  $('#mainmenu li').removeClass('has-child menu-item-has-children');
  $('#mainmenu li').has('ul').addClass('has-child menu-item-has-children');
  $('#mainmenu li')
    .has('ul')
    .each((_index: number, el: HTMLElement) => {
      const $li = $(el);
      const $anchor = $li.children('a').first();
      if ($anchor.length) {
        $('<span aria-hidden="true"></span>').insertAfter($anchor);
      }
    });

  $(document).off('click.mobileSmileMenu', '#mainmenu a');
  $(document).off('click.mobileSmileMenuArrow', '#mainmenu li > span');

  const closeMenu = (): void => {
    if (window.innerWidth > 992) return;
    $('header').removeClass('menu-open');
    resetMobileHeaderState();
  };

  const bindMenuButton = (): void => {
    // Remove existing handlers to prevent conflicts (fix "3 actions")
    $('#menu-btn').off('click');
    $(document).off('click', '#menu-btn');
    $(document).off('click.mobileSmileMenuBtn', '#menu-btn');

    // Attach new handler via delegation (robust to re-renders)
    $(document).on('click.mobileSmileMenuBtn', '#menu-btn', function (this: HTMLElement, e) {
      if (window.innerWidth > 992) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const isOpen = $('header').hasClass('menu-open');
      if (isOpen) {
        closeMenu();
        $('#menu-btn').attr('aria-expanded', 'false');
      } else {
        // Open menu
        $('header').addClass('menu-open');
        $('body').addClass('no-scroll');
        $('#menu-btn').addClass('menu-open').attr('aria-expanded', 'true');
        resetMobileHeaderState();
      }
    });
  };

  bindMenuButton();

  $(document).on('click.mobileSmileMenu', '#mainmenu a', () => {
    closeMenu();
  });

  $(document).on(
    'click.mobileSmileMenuArrow',
    '#mainmenu li > span',
    function (this: HTMLElement, e) {
      if (window.innerWidth > 992) return;
      e.preventDefault();
      e.stopPropagation();
      const $span = $(this);
      const $submenu = $span.parent().children('ul').first();
      if (!$submenu.length) return;

      if ($span.hasClass('active')) {
        // Close menu
        $span.removeClass('active');
        $submenu.stop(true, true).animate({ height: '0' }, 300);
      } else {
        // Open menu
        $span.addClass('active');
        // Manual height animation (because CSS sets height: 0, not display: none)
        $submenu.css('height', 'auto');
        const targetHeight = $submenu.height();
        $submenu.css('height', '0');
        $submenu.stop(true, true).animate({ height: targetHeight }, 300);
      }
    }
  );
}

let initialized = false;

function releaseTemplateBoundIslandControls($: JQueryStatic): void {
  // OWNERSHIP: #filters clicks — GalleryGrid (React) OWNS filtering; this OWNS releasing template binds.
  // LabLaunchPad.filter_gallery/masonry must never own #filters on React pages; runs at init + window load.
  // NEVER change: '#filters a' selector, '.selected' class, or remove the .off('click') calls.
  $('#filters a').off('click');
}

function initScripts(): void {
  if (initialized) return;
  const $ = window.jQuery;
  if (!$ || !$.fn) return;

  if (window.de_init) {
    window.de_init();
  }

  releaseTemplateBoundIslandControls($);

  stabilizeMobileMenu();

  initCustomBackgrounds();
  initMagnificPopup();
  const owlReady = initOwlCarousel();
  initAccordion();

  if (window.WOW) {
    new window.WOW().init();
  }

  if (window.Swiper) {
    document.querySelectorAll('.swiper').forEach((el) => {
      const swiperElement = el as Element & { swiper?: { destroy(a: boolean, b: boolean): void } };
      if (swiperElement.swiper) {
        swiperElement.swiper.destroy(true, true);
      }
      if (swiperElement.querySelectorAll('.swiper-slide').length > 0) {
        new window.Swiper!(swiperElement, {
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          spaceBetween: 30,
          effect: 'fade',
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: false,
            clickable: false,
          },
        });
      }
    });
  }

  initialized = owlReady || !!window.Swiper;
}

function boot(): void {
  setTimeout(initScripts, 100);
  setTimeout(initScripts, 1000);
  setTimeout(resetMobileHeaderState, 250);

  const releaseIslandControls = (): void => {
    const jq = window.jQuery;
    if (!jq || !jq.fn) return;
    releaseTemplateBoundIslandControls(jq);
  };

  if (document.readyState === 'complete') {
    releaseIslandControls();
  } else {
    window.addEventListener('load', releaseIslandControls);
  }

  resetMobileHeaderState();
  window.addEventListener('resize', resetMobileHeaderState);

  const btnExtra = document.getElementById('btn-extra');
  const btnClose = document.getElementById('btn-close');

  const handleMenuClick = (): void => {
    document.body.classList.add('no-scroll');
  };
  const handleCloseClick = (): void => {
    document.body.classList.remove('no-scroll');
  };

  if (btnExtra) btnExtra.addEventListener('click', handleMenuClick);
  if (btnClose) btnClose.addEventListener('click', handleCloseClick);

  // ponytail: keyboard + Esc for the side panel — additive only, open path untouched
  // Iteration 2: Esc also closes the mobile menu; closing returns focus to the
  // control that opened it (panel -> #btn-extra, menu -> #menu-btn).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('extra-wrap');
      const wasPanel = panel?.classList.contains('open') ?? false;
      const wasMenu = document.querySelector('header.menu-open') !== null;
      panel?.classList.remove('open');
      if (wasMenu && window.innerWidth <= 992) {
        document.querySelector('header')?.classList.remove('menu-open');
        resetMobileHeaderState();
      }
      document.body.classList.remove('no-scroll');
      if (wasPanel) (document.getElementById('btn-extra') as HTMLElement | null)?.focus?.();
      else if (wasMenu) (document.getElementById('menu-btn') as HTMLElement | null)?.focus?.();
      return;
    }
    const target = e.target as HTMLElement | null;
    if ((e.key === 'Enter' || e.key === ' ') && target?.matches?.('#btn-extra, #btn-close')) {
      e.preventDefault();
      target.click();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
