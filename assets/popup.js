(function () {
  "use strict";

  var COOKIE_NAME = "utl_wb";
  var COOKIE_DAYS = 180;
  var LS_NAME_KEY = "utl_wb_name";
  var MAILTO = "unknownsoldier@unitetolove.ca";
  var LANDING = "now.html";

  var modal = document.getElementById("signup-modal");
  var banner = document.getElementById("welcome-back-banner");
  if (!modal && !banner) { return; }

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

  function go(dest) {
    window.location.href = dest;
  }

  var cookieId = getCookie(COOKIE_NAME);

  if (modal) {
    var dialog = modal.querySelector(".signup-modal__dialog");
    var form = document.getElementById("popup-form");
    var closeBtn = document.getElementById("signup-modal-close");
    var skipBtn = document.getElementById("signup-modal-skip");
    var phoneToggle = document.getElementById("p-phone-toggle");
    var phoneWrap = document.getElementById("p-phone-wrap");
    var postalAdd = document.getElementById("p-postal-add");
    var postalList = document.getElementById("p-postal-list");
    var postalCount = 1;

    if (form) { form.removeAttribute("novalidate"); }

    function focusableEls() {
      return dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    }

    function onKeydown(e) {
      if (modal.hidden) { return; }
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        skipModal();
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

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var nameInput = document.getElementById("p-name");
      if (nameInput) {
        nameInput.focus();
      } else {
        var els = focusableEls();
        if (els.length) { els[0].focus(); }
      }
      document.addEventListener("keydown", onKeydown, true);
    }

    function skipModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown, true);
      go(LANDING);
    }

    if (closeBtn) { closeBtn.addEventListener("click", skipModal); }
    if (skipBtn) { skipBtn.addEventListener("click", skipModal); }

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

        function val(id) {
          var el = document.getElementById(id);
          return el && el.value ? el.value.trim() : "";
        }

        var name = val("p-name");
        var email = val("p-email");
        var phone = val("p-phone");
        var consentBox = document.getElementById("p-cookie-consent");
        var consented = !!(consentBox && consentBox.checked);

        if (!name || !email) { return; }

        var postalInputs = form.querySelectorAll(".postal-input");
        var postals = [];
        for (var i = 0; i < postalInputs.length; i++) {
          var v = postalInputs[i].value.trim();
          if (v) { postals.push(v); }
        }

        var lines = [];
        function add(label, value) { if (value) { lines.push(label + ": " + value); } }
        add("Name", name);
        add("Email", email);
        add("Phone", phone);
        add("Postal code(s)", postals.join(", "));
        lines.push("");
        lines.push("Consent - remember me on this device (cookie): " + (consented ? "yes" : "no"));

        var subject = "Joining the conversation" + (name ? " - " + name : "");
        var href = "mailto:" + MAILTO + "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\n"));

        if (consented) {
          var id = randomId();
          setCookie(COOKIE_NAME, id, COOKIE_DAYS);
          try { window.localStorage.setItem(LS_NAME_KEY, name); } catch (err) { /* storage unavailable */ }
        }

        document.removeEventListener("keydown", onKeydown, true);
        console.log("DEBUG mailto href:", href);
        window.location.href = href;
        window.setTimeout(function () { go(LANDING); }, 300);
      });
    }

    if (!cookieId) {
      openModal();
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
  }
})();
