/* ==========================================================================
   Nimbus Reach — site scripts
   No frameworks, no build step, no database.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SITE CONFIG  —  edit these three lines and the whole site updates
   -------------------------------------------------------------------------- */
window.NR_CONFIG = {
  email:      "satyamt37@gmail.com",
  phone:      "+91 89594 59494",
  phoneRaw:   "918959459494",          // used for tel: and wa.me links
  address:    "",                       // leave "" to hide the address row

  /* Email delivery for the contact form.
     Get a free access key in 30 seconds at https://web3forms.com
     (enter satyamt37@gmail.com, they email you the key — paste it below).
     Until it is set, the form falls back to opening the visitor's mail app. */
  accessKey:  ""
};

(function () {
  "use strict";

  var cfg = window.NR_CONFIG;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------------
     2. Contact details injected everywhere from the config above
     ------------------------------------------------------------------------ */
  function applyConfig() {
    $$("[data-nr-email]").forEach(function (el) {
      el.textContent = cfg.email;
      if (el.tagName === "A") el.href = "mailto:" + cfg.email;
    });
    $$("[data-nr-phone]").forEach(function (el) {
      el.textContent = cfg.phone;
      if (el.tagName === "A") el.href = "tel:+" + cfg.phoneRaw;
    });
    $$("[data-nr-wa]").forEach(function (el) {
      el.href = "https://wa.me/" + cfg.phoneRaw +
        "?text=" + encodeURIComponent("Hi Nimbus Reach, I'd like to know more about your packages for my business.");
    });
    $$("[data-nr-address]").forEach(function (el) {
      if (cfg.address) { el.textContent = cfg.address; return; }
      // no address configured and no fallback text — drop the empty row
      if (!el.textContent.trim() && el.closest("li")) el.closest("li").remove();
    });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------------
     3. Header: sticky shadow + mobile nav + active link
     ------------------------------------------------------------------------ */
  function header() {
    var head = $(".header");
    var nav = $(".nav");
    var burger = $(".burger");

    if (head) {
      var onScroll = function () {
        head.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (burger && nav) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          nav.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        }
      });
    }

    // mark the current page in the nav
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here || (here === "index.html" && href === "index.html")) {
        a.classList.add("is-active");
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Scroll reveal + animated counters
     ------------------------------------------------------------------------ */
  function reveals() {
    var items = $$(".rv");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  function counters() {
    var nums = $$("[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) {
      nums.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
        var start = performance.now();
        var dur = 1150;

        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals);
        })(start);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     5. FAQ accordion
     ------------------------------------------------------------------------ */
  function faq() {
    $$(".faq__q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var panel = item.querySelector(".faq__a");
        var open = item.classList.contains("is-open");

        // close siblings for a tidy single-open accordion
        var group = item.parentElement;
        $$(".faq__item.is-open", group).forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq__a").style.maxHeight = null;
        });

        if (!open) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Marquee — duplicate the track so the loop is seamless
     ------------------------------------------------------------------------ */
  function marquee() {
    $$(".marquee__track").forEach(function (track) {
      track.innerHTML += track.innerHTML;
    });
  }

  /* ------------------------------------------------------------------------
     7. Contact form
        - validates in the browser
        - posts to Web3Forms (free, no server, no database) when a key is set
        - otherwise opens the visitor's mail app pre-filled
     ------------------------------------------------------------------------ */
  function contactForm() {
    var form = $("#contactForm");
    if (!form) return;

    var msg = $("#formMsg");
    var submit = form.querySelector("[type=submit]");
    var labelText = submit ? submit.querySelector("span") : null;

    var setBad = function (field, why) {
      var wrap = field.closest(".field");
      wrap.classList.add("is-bad");
      var err = wrap.querySelector(".err");
      if (err && why) err.textContent = why;
    };
    var clearBad = function (field) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.remove("is-bad");
    };

    form.addEventListener("input", function (e) {
      if (e.target.closest(".field")) clearBad(e.target);
    });

    function validate() {
      var ok = true;
      var name = form.name_field, email = form.email, phone = form.phone, message = form.message;

      if (!name.value.trim() || name.value.trim().length < 2) { setBad(name, "Please tell us your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setBad(email, "That email doesn't look right."); ok = false; }
      if (!/^[0-9+\-\s()]{8,16}$/.test(phone.value.trim())) { setBad(phone, "Enter a valid phone number."); ok = false; }
      if (message.value.trim().length < 10) { setBad(message, "A line or two about your business helps us prepare."); ok = false; }

      if (!ok) {
        var first = form.querySelector(".field.is-bad input, .field.is-bad textarea");
        if (first) first.focus();
      }
      return ok;
    }

    function show(kind, text) {
      if (!msg) return;
      msg.className = "formmsg " + kind;
      msg.textContent = text;
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function busy(state) {
      if (!submit) return;
      submit.classList.toggle("is-busy", state);
      if (labelText) labelText.textContent = state ? "Sending…" : "Send my free audit request";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot — bots fill hidden fields, humans don't
      if (form.company_website && form.company_website.value) return;

      if (!validate()) return;

      var data = {
        name:     form.name_field.value.trim(),
        email:    form.email.value.trim(),
        phone:    form.phone.value.trim(),
        business: form.business.value.trim(),
        service:  form.service.value,
        budget:   form.budget.value,
        message:  form.message.value.trim()
      };

      // ---- no key configured: fall back to the visitor's mail app ----
      if (!cfg.accessKey) {
        var body =
          "Name: " + data.name + "\n" +
          "Email: " + data.email + "\n" +
          "Phone: " + data.phone + "\n" +
          "Business: " + (data.business || "-") + "\n" +
          "Interested in: " + data.service + "\n" +
          "Monthly budget: " + data.budget + "\n\n" +
          data.message;

        window.location.href = "mailto:" + cfg.email +
          "?subject=" + encodeURIComponent("New enquiry from " + data.name + " — nimbusreach.in") +
          "&body=" + encodeURIComponent(body);

        show("ok", "Opening your email app with the details filled in — just press send. Prefer WhatsApp? Tap the green button.");
        return;
      }

      // ---- Web3Forms delivery ----
      busy(true);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: cfg.accessKey,
          subject: "New enquiry: " + data.name + (data.business ? " (" + data.business + ")" : ""),
          from_name: "Nimbus Reach website",
          replyto: data.email,
          Name: data.name,
          Email: data.email,
          Phone: data.phone,
          Business: data.business || "Not given",
          Interested_in: data.service,
          Monthly_budget: data.budget,
          Message: data.message,
          Page: location.href
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          busy(false);
          if (res.success) {
            form.reset();
            show("ok", "Thank you — your enquiry has landed. We reply within one working day, usually much sooner.");
          } else {
            show("bad", "Something went wrong at our end. Please WhatsApp us on " + cfg.phone + " or email " + cfg.email + ".");
          }
        })
        .catch(function () {
          busy(false);
          show("bad", "Network issue — please WhatsApp us on " + cfg.phone + " or email " + cfg.email + ".");
        });
    });
  }

  /* ------------------------------------------------------------------------
     8. Pre-fill the enquiry form from ?plan= / ?service= links
     ------------------------------------------------------------------------ */
  function prefill() {
    var form = $("#contactForm");
    if (!form) return;
    var q = new URLSearchParams(location.search);

    var plan = q.get("plan");
    var service = q.get("service");

    if (service && form.service) {
      $$("option", form.service).forEach(function (o) {
        if (o.value.toLowerCase() === service.toLowerCase()) form.service.value = o.value;
      });
    }
    if (plan && form.message && !form.message.value) {
      form.message.value = "I'm interested in the " + plan + " plan for my business. Please share the details.";
    }
  }

  /* ------------------------------------------------------------------------
     boot
     ------------------------------------------------------------------------ */
  function init() {
    applyConfig();
    header();
    marquee();
    reveals();
    counters();
    faq();
    contactForm();
    prefill();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
