// Initialize Materialize Components
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);
  var tooltips = document.querySelectorAll("[data-tooltip]");
  M.Tooltip.init(tooltips);
  var collapsibles = document.querySelectorAll(".collapsible");
  M.Collapsible.init(collapsibles);
});

// jQuery Document Ready
$(document).ready(function () {
  // Form Handling (Sustainability Form)
  $("#sustainability-form").on("submit", function (e) {
    e.preventDefault();
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const message = $("#message").val().trim();

    if (!name.match(/[A-Za-z\s]{2,}/)) {
      $("#form-message").text("Enter a valid name.").css("color", "red");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      $("#form-message").text("Enter a valid email.").css("color", "red");
      return;
    }
    if (message.length < 10) {
      $("#form-message")
        .text("Message must be at least 10 characters.")
        .css("color", "red");
      return;
    }

    $("#form-message")
      .text("Thank you for your message!")
      .css("color", "#003366");
    const modal = M.Modal.getInstance(document.getElementById("video-modal"));
    modal.open();
    $("#sustainability-form")[0].reset();
    M.updateTextFields();
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

  // Video Placeholder Click
  $(".video-placeholder").click(function () {
    const modal = M.Modal.getInstance(document.getElementById("video-modal"));
    modal.open();
  });

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
  $(".video-placeholder, .card, .btn, .back-to-top").on(
    "keypress",
    function (e) {
      if (e.which === 13) {
        // Enter key
        $(this).click();
      }
    }
  );
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
