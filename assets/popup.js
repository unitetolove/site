(function () {
  "use strict";

  var COOKIE_NAME = "utl_wb";
  var COOKIE_DAYS = 180;
  var LS_NAME_KEY = "utl_wb_name";
  var MAILTO = "unknownsoldier@unitetolove.ca";
  var API_ENDPOINT = "/api/join";

  var modal = document.getElementById("signup-modal");
  var banner = document.getElementById("welcome-back-banner");
  if (!modal && !banner) { return; }

  var dialog = modal ? modal.querySelector(".signup-modal__dialog") : null;
  var form = document.getElementById("popup-form");
  var closeBtn = document.getElementById("signup-modal-close");
  var skipBtn = document.getElementById("signup-modal-skip");
  var phoneToggle = document.getElementById("p-phone-toggle");
  var phoneWrap = document.getElementById("p-phone-wrap");
  var postalAdd = document.getElementById("p-postal-add");
  var postalList = document.getElementById("p-postal-list");
  var postalCount = 1;
  var status = document.getElementById("popup-status");
  var successBox = document.getElementById("popup-success");
  var signAnotherBtn = document.getElementById("popup-sign-another");
  var essayEnd = document.getElementById("essay-end");
  var essayCtaLink = document.getElementById("essay-cta-link");

  var modalOpenedOnce = false;
  var modalDismissed = false;

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) +
      ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  var cookieId = getCookie(COOKIE_NAME);

  function focusableEls() {
    if (!dialog) { return []; }
    return dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function onKeydown(e) {
    if (!modal || modal.hidden) { return; }
    if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "Tab" || e.keyCode === 9) {
      var els = focusableEls();
      if (!els.length) { return; }
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function resetFormFields() {
    if (!form) { return; }
    form.reset();
    if (status) { status.hidden = true; }
    form.hidden = false;
    if (successBox) { successBox.hidden = true; }
    if (phoneWrap) { phoneWrap.hidden = true; }
    if (phoneToggle) { phoneToggle.hidden = false; }
    // Drop any extra postal fields added beyond the first.
    if (postalList) {
      var extraLabels = postalList.querySelectorAll("label.field-label");
      for (var i = 1; i < extraLabels.length; i++) {
        extraLabels[i].parentNode.removeChild(extraLabels[i]);
      }
    }
    postalCount = 1;
    if (window.turnstile) {
      try { window.turnstile.reset(); } catch (err) { /* widget not ready yet */ }
    }
  }

  // D-173: opening the popup NEVER happens on page load. It only ever runs in response to a
  // real trigger -- the essay's scroll-end, the bottom CTA link, or an explicit "sign another
  // person" / "someone else, sign here" action. `fresh` re-arms the form for a second signer on
  // the same device without touching any cookie that's already set.
  function openModal(fresh) {
    if (!modal) { return; }
    if (fresh) { resetFormFields(); }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalOpenedOnce = true;
    var nameInput = document.getElementById("p-name");
    if (nameInput && form && !form.hidden) {
      nameInput.focus();
    } else {
      var els = focusableEls();
      if (els.length) { els[0].focus(); }
    }
    document.addEventListener("keydown", onKeydown, true);
  }

  // Dismissal (backdrop close / Escape / Skip) closes the popup and stays on the door -- it
  // never navigates. The old on-load-modal's skip-to-/now.html semantics die with D-173.
  function closeModal() {
    if (!modal) { return; }
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown, true);
    modalDismissed = true;
  }

  function showStatus(message, ok) {
    if (!status) { return; }
    status.textContent = message;
    status.hidden = false;
    status.className = ok ? "ok" : "";
  }

  if (modal) {
    if (form) { form.removeAttribute("novalidate"); }
    if (closeBtn) { closeBtn.addEventListener("click", closeModal); }
    if (skipBtn) { skipBtn.addEventListener("click", closeModal); }

    if (phoneToggle && phoneWrap) {
      phoneToggle.addEventListener("click", function () {
        phoneWrap.hidden = false;
        phoneToggle.hidden = true;
        var input = document.getElementById("p-phone");
        if (input) { input.focus(); }
      });
    }

    if (postalAdd && postalList) {
      postalAdd.addEventListener("click", function () {
        var label = document.createElement("label");
        label.className = "field-label";
        label.setAttribute("for", "p-postal-" + postalCount);
        label.appendChild(document.createTextNode("Postal code "));
        var hint = document.createElement("span");
        hint.className = "hint";
        hint.textContent = "(optional)";
        label.appendChild(hint);
        label.appendChild(document.createElement("br"));
        var input = document.createElement("input");
        input.type = "text";
        input.id = "p-postal-" + postalCount;
        input.name = "postal";
        input.className = "postal-input";
        input.autocomplete = "postal-code";
        input.placeholder = "M5V 2T6";
        label.appendChild(input);
        postalList.appendChild(label);
        postalCount++;
        input.focus();
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (status) { status.hidden = true; }

        function val(id) {
          var el = document.getElementById(id);
          return el && el.value ? el.value.trim() : "";
        }

        var name = val("p-name");
        var email = val("p-email");
        var phone = val("p-phone");
        var consentBox = document.getElementById("p-cookie-consent");
        var cookieConsented = !!(consentBox && consentBox.checked);
        var newsBox = document.getElementById("p-news");
        var newsletterConsented = !!(newsBox && newsBox.checked);

        if (!name || !email) {
          showStatus("Please fill in your name and email.", false);
          return;
        }

        var turnstileField = form.querySelector('[name="cf-turnstile-response"]');
        var turnstileToken = turnstileField ? turnstileField.value : "";
        if (!turnstileToken) {
          showStatus("Please complete the verification widget above, then try again.", false);
          return;
        }

        var postalInputs = form.querySelectorAll(".postal-input");
        var postals = [];
        for (var i = 0; i < postalInputs.length; i++) {
          var v = postalInputs[i].value.trim();
          if (v) { postals.push(v); }
        }

        var nowIso = new Date().toISOString();
        var payload = {
          name: name,
          email: email,
          phone: phone || undefined,
          postal_fsa_or_ward: postals.join(", ") || undefined,
          consent_flags: { front_door_popup: true },
          consent_timestamp: nowIso,
          consent_source_page: window.location.href,
          newsletter_consent: newsletterConsented,
          turnstile_token: turnstileToken,
        };

        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
              return { ok: res.ok, status: res.status, data: data };
            });
          })
          .then(function (result) {
            submitBtn.disabled = false;
            if (result.ok || result.status === 409) {
              // A 409 (already registered) is still a welcome, not a failure -- don't make a
              // returning-but-uncookied signer feel rejected.
              if (cookieConsented) {
                var id = randomId();
                setCookie(COOKIE_NAME, id, COOKIE_DAYS);
                try { window.localStorage.setItem(LS_NAME_KEY, name); } catch (err) { /* storage unavailable */ }
              }
              form.hidden = true;
              if (successBox) {
                successBox.hidden = false;
                var msg = document.getElementById("popup-success-message");
                if (msg) {
                  msg.textContent = result.status === 409
                    ? "Looks like you're already signed up — thank you!"
                    : "Thank you — you're in. Your details are never sold or shared.";
                }
                var firstFocusable = successBox.querySelector("a, button");
                if (firstFocusable) { firstFocusable.focus(); }
              }
            } else if (result.status === 403) {
              showStatus("Verification failed — please try again.", false);
              if (window.turnstile) { window.turnstile.reset(); }
            } else if (result.status === 400) {
              showStatus((result.data && result.data.error) || "Please check the form and try again.", false);
            } else {
              showStatus("Something went wrong on our end — please try again, or write to " + MAILTO + " and we'll add you by hand.", false);
            }
          })
          .catch(function () {
            submitBtn.disabled = false;
            showStatus("Couldn't reach the signup server — please write to " + MAILTO + " and we'll add you by hand.", false);
          });
      });
    }

    if (signAnotherBtn) {
      signAnotherBtn.addEventListener("click", function () { openModal(true); });
    }

    // D-173: no popup on load, ever. First-time visitors (no recognition cookie) get it only
    // when they scroll to the essay's end, or click the bottom CTA link -- the essay itself
    // stays fully visible and unobstructed until then. Returning, cookie-recognized visitors
    // never get the auto-popup; they see the welcome-back banner instead (below).
    if (!cookieId) {
      if (essayEnd && window.IntersectionObserver) {
        var observer = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting && !modalOpenedOnce && !modalDismissed) {
              openModal(false);
            }
          }
        }, { threshold: 0.1 });
        observer.observe(essayEnd);
      }

      if (essayCtaLink) {
        essayCtaLink.addEventListener("click", function (e) {
          e.preventDefault();
          openModal(false);
        });
      }
    }
  }

  if (cookieId && banner) {
    setCookie(COOKIE_NAME, cookieId, COOKIE_DAYS);
    var storedName = "";
    try { storedName = window.localStorage.getItem(LS_NAME_KEY) || ""; } catch (err) { storedName = ""; }
    var heading = document.getElementById("wb-heading");
    if (heading) {
      var firstName = storedName ? storedName.trim().split(/\s+/)[0] : "";
      heading.textContent = "Welcome back, " + (firstName ? firstName : "friend") + ".";
    }
    banner.hidden = false;
    var dismiss = document.getElementById("wb-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", function () { banner.hidden = true; });
    }
    // Multi-signer (D-173 companion): the cookie recognizes only the most recent consenting
    // signer -- this never overwrites it until a fresh submission consents again.
    var signAnotherFromBanner = document.getElementById("wb-sign-another");
    if (signAnotherFromBanner && modal) {
      signAnotherFromBanner.addEventListener("click", function () { openModal(true); });
    }
  }
})();
