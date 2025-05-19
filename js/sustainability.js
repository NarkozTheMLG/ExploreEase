// Sustainability Page JavaScript
$(document).ready(function() {
    // Initialize Materialize Components
    M.AutoInit();

    // Initialize jQuery Accordion
    $("#sustainability-accordion").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        animate: 300
    });

    // Form Validation and Submission
    $("#sustainability-form").on("submit", function(e) {
        e.preventDefault();
        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const message = $("#message").val().trim();

        // Client-side validation
        if (!name.match(/[A-Za-z\s]{2,}/)) {
            $("#form-message").text("Please enter a valid name.").css("color", "red");
            return;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            $("#form-message").text("Please enter a valid email.").css("color", "red");
            return;
        }
        if (message.length < 10) {
            $("#form-message").text("Message must be at least 10 characters.").css("color", "red");
            return;
        }

        // Success message
        $("#form-message").text("Thank you for joining our sustainability mission! We'll respond soon.").css("color", "#003366");
        $("#sustainability-form")[0].reset();
        M.updateTextFields();
    });

    // Animated Counters
    function animateCounters() {
        $(".counter").each(function() {
            const $this = $(this);
            const target = parseInt($this.attr("data-target"));
            $({ count: 0 }).animate(
                { count: target },
                {
                    duration: 2000,
                    easing: "swing",
                    step: function() {
                        $this.text(Math.ceil(this.count));
                    }
                }
            );
        });
    }

    // Trigger counters when stats section is in view
    const statsSection = $(".stats");
    let countersAnimated = false;
    $(window).on("scroll", function() {
        if (!countersAnimated && statsSection.is(":in-viewport")) {
            animateCounters();
            countersAnimated = true;
        }
    });

    // Fade-In Animation for Sections
    $(".section").each(function() {
        const $section = $(this);
        $section.css("opacity", 0);
        if ($section.is(":in-viewport")) {
            $section.animate({ opacity: 1 }, 1000);
        }
    });
    $(window).on("scroll", function() {
        $(".section").each(function() {
            const $section = $(this);
            if ($section.is(":in-viewport") && $section.css("opacity") == 0) {
                $section.animate({ opacity: 1 }, 1000);
            }
        });
    });

    // Scroll Progress Bar
    $(window).on("scroll", function() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const progress = (scrollTop / docHeight) * 100;
        $("#progress-bar").css("width", progress + "%");
    });

    // Card Hover Animation
    $(".card").hover(
        function() {
            $(this).animate({ marginTop: "-10px", opacity: 0.95 }, 200);
        },
        function() {
            $(this).animate({ marginTop: "0", opacity: 1 }, 200);
        }
    );
});

// jQuery In-Viewport Plugin
(function($) {
    $.fn.isInViewport = function() {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
})(jQuery);