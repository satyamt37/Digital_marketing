/* ==========================================================================
   Nimbus Reach — site scripts
   No frameworks, no build step, no database.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SITE CONFIG  —  edit these three lines and the whole site updates
   -------------------------------------------------------------------------- */
window.NR_CONFIG = {
  email:      "satyamt37@gmail.com",   // where enquiries are delivered
  phone:      "+91 89594 59494",
  phoneRaw:   "918959459494",          // used for tel: and wa.me links
  address:    "",                      // leave "" to hide the address row

  /* =====================================================================
     EMAILJS — how enquiries reach your Gmail inbox
     =====================================================================
     EmailJS connects your own Gmail account and sends the enquiry straight
     to it. Nothing is stored anywhere; there is no database and no server.

     Fill in these three values from your EmailJS dashboard
     (full step-by-step is in README.md — takes about 5 minutes):

       publicKey   Account  ->  General      ->  Public Key
       serviceId   Email Services -> your Gmail service  ->  Service ID
       templateId  Email Templates -> your template      ->  Template ID

     Until all three are filled in, the form stays usable: it falls back to
     opening the visitor's own mail app with the enquiry pre-filled, so no
     enquiry is ever silently lost.
     ===================================================================== */
  emailjs: {
    publicKey:  "",     // e.g. "aB1cD2eF3gH4iJ5kL"
    serviceId:  "",     // e.g. "service_ab12cde"
    templateId: ""      // e.g. "template_xy34zab"
  }
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

    /* The enquiry, as ordered label/value pairs. Both email providers render
       these as a table, so this ordering is exactly what lands in the inbox. */
    function buildEnquiry() {
      var stamp = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short"
      });
      return [
        ["Name",             form.name_field.value.trim()],
        ["Phone / WhatsApp", form.phone.value.trim()],
        ["Email",            form.email.value.trim()],
        ["Business & city",  form.business.value.trim() || "— not given —"],
        ["Interested in",    form.service.value],
        ["Monthly budget",   form.budget.value],
        ["Message",          form.message.value.trim()],
        ["Submitted",        stamp + " IST"],
        ["Sent from page",   location.href]
      ];
    }

    function get(pairs, label) {
      for (var i = 0; i < pairs.length; i++) if (pairs[i][0] === label) return pairs[i][1];
      return "";
    }

    function subjectLine(pairs) {
      var who = get(pairs, "Business & city");
      if (who.indexOf("—") === 0) who = get(pairs, "Name");
      var want = get(pairs, "Interested in");
      return "New enquiry — " + who + " · " + want;
    }

    function plainBody(pairs) {
      return pairs.map(function (p) { return p[0] + ": " + p[1]; }).join("\n");
    }

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    /* A ready-made HTML table, so the email is properly laid out even if the
       EmailJS template is just {{{enquiry_html}}}. */
    function htmlTable(pairs) {
      var rows = pairs.map(function (p) {
        return '<tr>' +
          '<td style="padding:10px 14px;border-bottom:1px solid #e6e1d8;' +
          'font:600 12px/1.4 Arial,sans-serif;color:#6b6459;text-transform:uppercase;' +
          'letter-spacing:.6px;white-space:nowrap;vertical-align:top">' + esc(p[0]) + '</td>' +
          '<td style="padding:10px 14px;border-bottom:1px solid #e6e1d8;' +
          'font:400 15px/1.55 Arial,sans-serif;color:#14181f">' +
          esc(p[1]).replace(/\n/g, "<br>") + '</td></tr>';
      }).join("");

      return '<div style="background:#fbf8f3;padding:24px;font-family:Arial,sans-serif">' +
        '<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e6e1d8;border-radius:12px;overflow:hidden">' +
        '<div style="background:#0e1116;padding:18px 20px">' +
        '<div style="font:700 17px/1.2 Arial,sans-serif;color:#fbf8f3">Nimbus<span style="color:#ff5a36">Reach</span></div>' +
        '<div style="font:400 13px/1.4 Arial,sans-serif;color:#a9a49b;margin-top:4px">New enquiry from the website</div>' +
        '</div><table style="width:100%;border-collapse:collapse">' + rows + '</table>' +
        '<div style="padding:14px 20px;background:#f3ede3;font:400 12px/1.5 Arial,sans-serif;color:#6b6459">' +
        'Reply directly to this email to reach the customer.</div>' +
        '</div></div>';
    }

    /* ---- provider 1: EmailJS (primary) ---- */
    function sendViaEmailJS(pairs) {
      var e = cfg.emailjs;
      return emailjs.send(e.serviceId, e.templateId, {
        // individual fields, usable one by one in the EmailJS template
        from_name:    get(pairs, "Name"),
        reply_to:     get(pairs, "Email"),
        email:        get(pairs, "Email"),
        phone:        get(pairs, "Phone / WhatsApp"),
        business:     get(pairs, "Business & city"),
        service:      get(pairs, "Interested in"),
        budget:       get(pairs, "Monthly budget"),
        message:      get(pairs, "Message"),
        submitted_at: get(pairs, "Submitted"),
        page_url:     get(pairs, "Sent from page"),
        subject:      subjectLine(pairs),
        to_email:     cfg.email,
        // whole enquiry, pre-formatted
        enquiry_text: plainBody(pairs),
        enquiry_html: htmlTable(pairs)
      }, { publicKey: e.publicKey })
        .then(function (res) { return res && res.status === 200; });
    }

    /* ---- fallback: the visitor's own mail app, pre-filled ---- */
    function sendViaMailto(pairs, note) {
      window.location.href = "mailto:" + cfg.email +
        "?subject=" + encodeURIComponent(subjectLine(pairs)) +
        "&body=" + encodeURIComponent(plainBody(pairs));
      show("ok", note || ("Opening your email app with everything filled in — just press send. " +
                          "Prefer WhatsApp? Tap the green button in the corner."));
    }

    function emailjsReady() {
      var e = cfg.emailjs || {};
      return typeof window.emailjs !== "undefined" &&
             !!e.publicKey && !!e.serviceId && !!e.templateId;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot — bots fill hidden fields, humans don't
      if (form.company_website && form.company_website.value) return;
      if (!validate()) return;

      var pairs = buildEnquiry();

      if (!emailjsReady()) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[Nimbus Reach] EmailJS is not configured yet — falling back to the " +
                       "visitor's mail app. Add publicKey, serviceId and templateId in " +
                       "assets/js/site.js (see README.md).");
        }
        sendViaMailto(pairs);
        return;
      }

      busy(true);
      sendViaEmailJS(pairs)
        .then(function (ok) {
          busy(false);
          if (!ok) throw new Error("EmailJS did not return 200");
          form.reset();
          show("ok", "Thank you — your enquiry is with us. We reply within one working day, " +
                     "usually much sooner. If it's urgent, WhatsApp us on " + cfg.phone + ".");
        })
        .catch(function (err) {
          busy(false);
          if (typeof console !== "undefined" && console.error) console.error("[Nimbus Reach] EmailJS send failed:", err);
          show("bad", "We couldn't send that automatically. Please WhatsApp or call " + cfg.phone +
                      ", or email " + cfg.email + " — sorry for the trouble.");
          sentFallbackLink(pairs);
        });
    });

    /* If the network call fails, offer a one-tap mail-app link so the enquiry
       still reaches us instead of being lost. */
    function sentFallbackLink(pairs) {
      if (!msg || msg.querySelector("a")) return;
      var a = document.createElement("a");
      a.href = "mailto:" + cfg.email +
        "?subject=" + encodeURIComponent(subjectLine(pairs)) +
        "&body=" + encodeURIComponent(plainBody(pairs));
      a.textContent = "Send it by email instead";
      a.style.cssText = "display:inline-block;margin-top:.5rem;font-weight:600;text-decoration:underline";
      msg.appendChild(document.createElement("br"));
      msg.appendChild(a);
    }
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
