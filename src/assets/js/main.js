/**
 * Template Name: Kelly
 * Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  // Listeners handled at the end

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  window.mobileNavToogle = mobileNavToogle;

  /**
   * Hide mobile nav on same-page/hash links
   */
  window.handleNavLinkClick = () => {
    if (document.querySelector(".mobile-nav-active")) {
      mobileNavToogle();
    }
  };

  /**
   * Toggle mobile nav dropdowns
   */
  window.toggleDropdown = function (element) {
    element.parentNode.classList.toggle("active");
    element.parentNode.nextElementSibling.classList.toggle("dropdown-active");
  };

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  // Preloader logic handled in window.onload

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }

  window.scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Listeners handled at the end

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  // Listeners handled at the end

  // No swiper/glightbox/isotope initialisation required for the trimmed site.

  // Combined Load Handler
  function onPageLoad() {
    toggleScrolled();
    if (preloader) {
      preloader.remove();
    }
    toggleScrollTop();
    aosInit();
  }

  // Combined Scroll Handler
  function onPageScroll() {
    toggleScrolled();
    toggleScrollTop();
  }

  // Assign Load Handler safely
  var oldOnLoadMain = window.onload;
  window.onload = function () {
    if (oldOnLoadMain) oldOnLoadMain();
    onPageLoad();
  };

  // Assign Scroll Handler safely
  var oldOnScrollMain = window.onscroll;
  window.onscroll = function () {
    if (oldOnScrollMain) oldOnScrollMain();
    onPageScroll();
  };
})();
