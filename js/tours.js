// Initialize Materialize Components
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  var collapsibles = document.querySelectorAll(".collapsible");
  M.Collapsible.init(collapsibles);
  var selects = document.querySelectorAll("select");
  M.FormSelect.init(selects);
  var tooltips = document.querySelectorAll("[data-tooltip]");
  M.Tooltip.init(tooltips);
});

// jQuery Document Ready
$(document).ready(function () {
  // Initialize jQuery UI Datepicker
  $("#datepicker").datepicker({
    dateFormat: "mm/dd/yy",
    minDate: 0, // No past dates
    showAnim: "fadeIn",
    showButtonPanel: true,
    onSelect: function () {
      $(this).valid(); // Trigger Materialize validation
    },
  });

  // Open Datepicker on Calendar Icon Click
  $(".calendar-icon").on("click", function () {
    $("#datepicker").datepicker("show");
  });

  // Booking Form Handling
  $("#booking-form").on("submit", function (e) {
    e.preventDefault();
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const tour = $("#tour-select").val();
    const travelDate = $("#datepicker").val();

    if (!name.match(/[A-Za-z\s]{2,}/)) {
      $("#form-message").text("Enter a valid name.").css("color", "red");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      $("#form-message").text("Enter a valid email.").css("color", "red");
      return;
    }
    if (!tour) {
      $("#form-message").text("Select a tour.").css("color", "red");
      return;
    }
    if (!travelDate) {
      $("#form-message").text("Select a travel date.").css("color", "red");
      return;
    }

    $("#form-message")
      .text("Booking request submitted! We'll contact you soon.")
      .css("color", "#003366");
    M.toast({ html: "Booking submitted!", classes: "green" });
    $("#booking-form")[0].reset();
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll("select"));
  });

  // Newsletter Form Handling
  $("#newsletter-form").on("submit", function (e) {
    e.preventDefault();
    const email = $("#newsletter-email").val().trim();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      M.toast({ html: "Enter a valid email.", classes: "red" });
      return;
    }

    M.toast({ html: "Subscribed successfully!", classes: "green" });
    $("#newsletter-form")[0].reset();
    M.updateTextFields();
  });

  // Tour Filter Handling
  function filterTours() {
    const region = $("#region-filter").val();
    const duration = $("#duration-filter").val();
    const price = $("#price-filter").val();

    $(".tour-card").each(function () {
      const $card = $(this);
      const cardRegion = $card.data("region");
      const cardDuration = $card.data("duration").toString();
      const cardPrice = $card.data("price");

      const regionMatch = region === "all" || region === cardRegion;
      const durationMatch = duration === "all" || duration === cardDuration;
      const priceMatch =
        price === "all" ||
        (price === "0-500" && cardPrice <= 500) ||
        (price === "500-1000" && cardPrice > 500 && cardPrice <= 1000) ||
        (price === "1000+" && cardPrice > 1000);

      if (regionMatch && durationMatch && priceMatch) {
        $card.fadeIn(300);
      } else {
        $card.fadeOut(300);
      }
    });
  }

  $("#region-filter, #duration-filter, #price-filter").on(
    "change",
    filterTours
  );

  // Stats Counter Animation
  $(".counter").each(function () {
    const $this = $(this);
    const target = parseInt($this.attr("data-target"));
    $({ count: 0 }).animate(
      { count: target },
      {
        duration: 2000,
        easing: "swing",
        step: function () {
          $this.text(Math.ceil(this.count));
        },
      }
    );
  });

  // Section Fade-In Animation
  $(".section").each(function () {
    const $section = $(this);
    $section.css("opacity", 0);
    if ($section.isInViewport()) {
      $section.animate({ opacity: 1 }, 1000);
    }
  });

  // Scroll Animations and Progress Bar
  $(window).on("scroll", function () {
    $(".section").each(function () {
      const $section = $(this);
      if ($section.isInViewport() && $section.css("opacity") == 0) {
        $section.animate({ opacity: 1 }, 1000);
      }
    });
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const progress = (scrollTop / docHeight) * 100;
    $("#progress-bar").css("width", progress + "%");

    // Show/Hide Back to Top Button
    if (scrollTop > 300) {
      $(".back-to-top").fadeIn();
    } else {
      $(".back-to-top").fadeOut();
    }
  });

  // Card Hover Animation
  $(".card").hover(
    function () {
      $(this).animate({ marginTop: "-10px" }, 200, "swing");
    },
    function () {
      $(this).animate({ marginTop: "0" }, 200, "swing");
    }
  );

  // Back to Top Button
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

  // Lazy Load Images
  $('img[loading="lazy"]').each(function () {
    if ($(this).isInViewport()) {
      $(this).attr("src", $(this).attr("src"));
    }
  });

  // Keyboard Accessibility
  $(".card, .btn, .back-to-top, .calendar-icon").on("keypress", function (e) {
    if (e.which === 13) {
      // Enter key
      $(this).click();
    }
  });
});

// Custom jQuery Plugin for Viewport Detection
(function ($) {
  $.fn.isInViewport = function () {
    const elementTop = $(this).offset().top;
    const elementBottom = elementTop + $(this).outerHeight();
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
})(jQuery);
