(function () {
  "use strict";

  var COOKIE_NAME = "utl_wb";
  var COOKIE_DAYS = 180;
  var LS_NAME_KEY = "utl_wb_name";
  var LS_SKIP_KEY = "utl_skip";
  var SS_AUTO_OPEN_KEY = "utl_wb_auto_open_session";
  var SS_PILL_DISMISS_KEY = "utl_wb_pill_dismiss_session";
  var MAILTO = "unknownsoldier@unitetolove.ca";
  var API_ENDPOINT = "/api/join";
  var TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  var SCROLL_TRIGGER_RATIO = 0.6;

  // ---------------------------------------------------------------------
  // Storage helpers -- first-party only (point 2). Every read/write is
  // guarded: private browsing / storage-blocked contexts must degrade to
  // "eligible" rather than throw.
  // ---------------------------------------------------------------------
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

  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (err) { return null; }
  }
  function lsSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (err) { /* storage unavailable */ }
  }
  function ssGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (err) { return null; }
  }
  function ssSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (err) { /* storage unavailable */ }
  }

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  // Signed (utl_wb cookie) beats skipped (utl_skip) beats eligible -- a
  // signer who later also closes the (already-signed) modal still reads as
  // "signed", never demoted back to "skipped". See markSkipped().
  function getState() {
    if (getCookie(COOKIE_NAME)) { return "signed"; }
    if (lsGet(LS_SKIP_KEY)) { return "skipped"; }
    return "eligible";
  }

  // The ONE place utl_skip is written. Every dismissal path (close "x",
  // "Skip for now", Escape) funnels through closeModal(), which calls this
  // unconditionally -- see closeModal() below.
  function markSkipped() {
    lsSet(LS_SKIP_KEY, String(Date.now()));
  }

  // ---------------------------------------------------------------------
  // Self-contained injection (point 1). Chrome pages ship only the
  // <script> tag; if #signup-modal isn't already on the page -- as it is,
  // inline, on the front page (index.html) -- we build the identical DOM
  // (same IDs/classes) and its CSS here, so the join form works everywhere.
  //
  // `hadNativeModal` records which case we're in. Point 4 keeps the front
  // page's OWN welcome-back banner behaviour for the "signed" state;
  // everywhere else (including the front page itself, for the "skipped"
  // state -- the original markup never had a skipped-state banner) falls
  // back to the pill. See applyState().
  // ---------------------------------------------------------------------
  var hadNativeModal = !!document.getElementById("signup-modal");

  // Verbatim reproduction of index.html's page-local <style> block for the
  // modal + banner (front page keeps its own copy of this; injected only
  // when the native markup is absent, so it's never duplicated there).
  var MODAL_CSS = [
    ".signup-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start;",
    "  justify-content: center; padding: 2rem 1rem; overflow-y: auto; }",
    ".signup-modal[hidden] { display: none; }",
    ".signup-modal__backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); }",
    ".signup-modal__dialog { position: relative; background: var(--bg); color: var(--fg);",
    "  border: 1px solid var(--border); border-radius: 8px; max-width: 30rem; width: 100%;",
    "  padding: 1.6rem 1.6rem 1.4rem; box-shadow: 0 8px 30px rgba(0,0,0,0.35);",
    "  box-sizing: border-box; max-height: calc(100vh - 2rem); overflow-y: auto; }",
    ".signup-modal__close { position: absolute; top: 0.6rem; right: 0.6rem; width: 2rem; height: 2rem;",
    "  border: 1px solid var(--border); border-radius: 50%; background: var(--bg); color: var(--fg);",
    "  font-size: 1.1rem; line-height: 1; cursor: pointer; }",
    ".signup-modal__close:hover { border-color: var(--accent); color: var(--accent); }",
    ".signup-modal h2 { margin-top: 0; border-bottom: none; }",
    ".popup-form .field-label { display: block; font-weight: 600; font-size: 0.95em; margin-top: 0.6rem; }",
    ".popup-form .field-label[hidden] { display: none; }",
    ".popup-form .hint { font-weight: 400; color: var(--muted); font-size: 0.85em; }",
    '.popup-form input[type="text"], .popup-form input[type="email"], .popup-form input[type="tel"] {',
    "  width: 100%; box-sizing: border-box; margin-top: 0.3rem; padding: 0.45rem 0.6rem;",
    "  border: 1px solid var(--border); border-radius: 4px; background: var(--bg); color: var(--fg);",
    "  font: inherit; line-height: 1.4; }",
    ".link-toggle { display: inline-block; margin-top: 0.5rem; background: none; border: none;",
    "  padding: 0; color: var(--accent); text-decoration: underline; font: inherit; cursor: pointer; }",
    ".popup-form .check { display: flex; align-items: flex-start; gap: 0.5rem; margin: 0.7rem 0 0;",
    "  font-weight: 400; font-size: 0.88em; color: var(--muted); }",
    ".popup-form .check input { margin-top: 0.25em; flex: none; }",
    ".popup-form .consent-details { margin: 0.4rem 0 0; font-size: 0.88em; color: var(--muted); }",
    ".popup-form .consent-details summary { cursor: pointer; color: var(--accent); text-decoration: underline; }",
    ".popup-form .consent-details p { margin: 0.5rem 0 0; }",
    ".popup-actions { display: flex; align-items: center; gap: 0.9rem; margin-top: 0.9rem; flex-wrap: wrap; }",
    ".signup-modal p { margin: 0.5em 0; }",
    ".popup-submit { font: inherit; font-weight: 700; padding: 0.55rem 1.4rem; border: 1px solid var(--accent);",
    "  border-radius: 6px; background: var(--accent); color: var(--bg); cursor: pointer; text-decoration: none;",
    "  display: inline-block; }",
    ".popup-submit:hover { filter: brightness(1.1); }",
    ".popup-skip { font: inherit; background: none; border: none; padding: 0; color: var(--muted);",
    "  text-decoration: underline; cursor: pointer; }",
    ".popup-skip:hover { color: var(--accent); }",
    '.popup-form button[type="submit"]:disabled { opacity: 0.6; cursor: default; }',
    ".popup-form .cf-turnstile { margin: 0.9rem 0; }",
    "#popup-status { margin-top: 0.9rem; border: 1px solid var(--border); border-radius: 6px;",
    "  padding: 0.6rem 0.9rem; font-weight: 600; }",
    "#popup-status.ok { border-color: var(--accent); }",
    ".welcome-back-banner { border: 1px solid var(--border); border-left: 3px solid var(--accent);",
    "  border-radius: 6px; padding: 0.7rem 1rem; margin: 0 0 1.4rem; display: flex; align-items: baseline;",
    "  justify-content: space-between; gap: 1rem; flex-wrap: wrap; }",
    ".welcome-back-banner[hidden] { display: none; }",
    ".welcome-back-banner p { margin: 0; }",
    ".welcome-back-banner a { font-weight: 600; }",
    ".welcome-back-banner button { font: inherit; background: none; border: none; color: var(--muted);",
    "  cursor: pointer; font-size: 1.1rem; line-height: 1; }",
    ".welcome-back-banner button:hover { color: var(--accent); }",
  ].join("\n");

  // New, small, and needed on EVERY page (including the front page, for
  // its "skipped" state, which never had a persistent UI before -- point
  // 4). No transition/animation properties anywhere: point 4 forbids an
  // aggressive entrance and point 3 asks us to respect
  // prefers-reduced-motion, and the simplest way to satisfy both at once
  // is to never animate it at all.
  var PILL_CSS = [
    ".utl-wb-pill { position: fixed; right: 1rem; bottom: 1rem; z-index: 900; display: inline-flex;",
    "  align-items: center; gap: 0.6rem; max-width: calc(100vw - 2rem); background: var(--bg);",
    "  color: var(--fg); border: 1px solid var(--border); border-radius: 999px;",
    "  padding: 0.45rem 0.5rem 0.45rem 0.9rem; font-size: 0.85em; line-height: 1.3;",
    "  box-shadow: 0 2px 10px rgba(0,0,0,0.18); }",
    ".utl-wb-pill[hidden] { display: none; }",
    ".utl-wb-pill a { color: var(--accent); text-decoration: none; font-weight: 600; white-space: nowrap; }",
    ".utl-wb-pill a:hover, .utl-wb-pill a:focus { text-decoration: underline; }",
    ".utl-wb-pill__dismiss { font: inherit; background: none; border: none; color: var(--muted);",
    "  cursor: pointer; font-size: 1rem; line-height: 1; padding: 0 0.15rem; flex: none; }",
    ".utl-wb-pill__dismiss:hover, .utl-wb-pill__dismiss:focus { color: var(--accent); }",
  ].join("\n");

  // Verbatim reproduction of index.html's modal + banner markup, IDs and
  // classes identical, EXCEPT the two internal links (now.html / join.html)
  // are written absolute (/now.html, /join.html): the front page's own
  // relative hrefs only resolve because it lives at site root -- injected
  // on a nested page (e.g. /wards/foo.html) a relative "now.html" would 404.
  var MODAL_HTML = [
    '<div id="signup-modal" class="signup-modal" hidden>',
    '  <div class="signup-modal__backdrop"></div>',
    '  <div class="signup-modal__dialog" role="dialog" aria-modal="true"',
    '    aria-labelledby="signup-modal-heading" aria-describedby="signup-modal-desc">',
    '    <button type="button" class="signup-modal__close" id="signup-modal-close" aria-label="Skip for now">&times;</button>',
    '    <h2 id="signup-modal-heading">Join the conversation.</h2>',
    '    <p id="signup-modal-desc">Thirty seconds if that&rsquo;s all you have. A name and a way to',
    '    reach you moves a public number &mdash; that&rsquo;s the whole first ask, and it&rsquo;s',
    "    enough.</p>",
    "",
    '    <form id="popup-form" class="popup-form" novalidate>',
    '      <label class="field-label" for="p-name">Name <span class="hint">(required &mdash; any name you choose)</span>',
    '        <input type="text" id="p-name" name="name" autocomplete="name" required>',
    "      </label>",
    '      <label class="field-label" for="p-email">Email <span class="hint">(required &mdash; how we reach you)</span>',
    '        <input type="email" id="p-email" name="email" autocomplete="email" required>',
    "      </label>",
    "",
    '      <button type="button" id="p-phone-toggle" class="link-toggle">+ Add a phone number (optional)</button>',
    '      <label class="field-label" for="p-phone" id="p-phone-wrap" hidden>Phone <span class="hint">(optional)</span>',
    '        <input type="tel" id="p-phone" name="phone" autocomplete="tel">',
    "      </label>",
    "",
    '      <div id="p-postal-list">',
    '        <label class="field-label" for="p-postal-0">Postal code <span class="hint">(optional &mdash; work, home, a parent&rsquo;s, wherever you&rsquo;d vote)</span>',
    '          <input type="text" id="p-postal-0" name="postal" class="postal-input" autocomplete="postal-code" placeholder="M5V 2T6">',
    "        </label>",
    "      </div>",
    '      <button type="button" id="p-postal-add" class="link-toggle">+ Add another postal code</button>',
    "",
    '      <label class="check">',
    '        <input type="checkbox" id="p-cookie-consent">',
    "        <span>Remember me on this device (optional) &mdash; skip this popup next time you visit.</span>",
    "      </label>",
    '      <details class="consent-details">',
    "        <summary>Why we set one cookie</summary>",
    "        <p>We set one cookie recognizing your browser, matched to your signup; the cookie itself",
    "        holds no personal data, just a random ID. Kept 180 days from your last visit and",
    "        refreshed each time you return; never sold, never shared with anyone outside this",
    "        project. Clear it anytime by clearing your browser&rsquo;s cookies, or by unchecking",
    "        this box the next time the popup shows.</p>",
    "      </details>",
    "",
    '      <label class="check">',
    '        <input type="checkbox" id="p-news">',
    "        <span><strong>Yes &mdash; email me updates.</strong> (optional) We keep this list",
    "        ourselves and never share it.</span>",
    "      </label>",
    "",
    '      <p class="hint">Under 18? Welcome &mdash; please have a parent or guardian send this for',
    "      you, from their own email. That&rsquo;s the whole rule, and you can withdraw anytime.</p>",
    "",
    '      <div class="cf-turnstile" data-sitekey="0x4AAAAAAEGWIsWFdt-RRBsx"></div>',
    "",
    '      <div class="popup-actions">',
    '        <button type="submit" class="popup-submit">Send it &mdash; join the conversation</button>',
    '        <button type="button" class="popup-skip" id="signup-modal-skip">Skip for now</button>',
    "      </div>",
    "",
    '      <div id="popup-status" role="status" aria-live="polite" hidden tabindex="-1"></div>',
    "    </form>",
    "",
    '    <div id="popup-success" hidden>',
    '      <p id="popup-success-message">Thank you &mdash; you&rsquo;re in. Your details are never',
    "      sold or shared.</p>",
    '      <div class="popup-actions">',
    '        <a class="popup-submit" href="/now.html">Continue to next actions &rarr;</a>',
    '        <button type="button" class="popup-skip" id="popup-sign-another">Sign another person</button>',
    "      </div>",
    "    </div>",
    "",
    '    <noscript><p class="hint">JavaScript is off in your browser, so this popup can&rsquo;t compose',
    '    the email for you &mdash; no problem: use the full <a href="/join.html">join form</a> instead,',
    "    or write directly to",
    '    <a href="mailto:unknownsoldier@unitetolove.ca?subject=Joining%20the%20conversation">unknownsoldier@unitetolove.ca</a>.</p></noscript>',
    "  </div>",
    "</div>",
  ].join("\n");

  var BANNER_HTML = [
    '<div id="welcome-back-banner" class="welcome-back-banner" role="status" hidden>',
    '  <p><strong id="wb-heading">Welcome back.</strong>',
    '  <span id="wb-message">You&rsquo;re signed up &mdash; thank you.</span>',
    '  <a href="/now.html">Continue to next actions &rarr;</a>',
    '  <button type="button" id="wb-sign-another" class="link-toggle">Someone else? Sign here.</button></p>',
    '  <button type="button" id="wb-dismiss" aria-label="Dismiss">&times;</button>',
    "</div>",
  ].join("\n");

  function injectStyle(id, css) {
    if (document.getElementById(id)) { return; }
    var style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectMarkup(id, html) {
    if (document.getElementById(id)) { return; }
    var container = document.createElement("div");
    container.innerHTML = html;
    while (container.firstChild) {
      document.body.appendChild(container.firstChild);
    }
  }

  // The pill's own CSS is always needed (see PILL_CSS comment above).
  injectStyle("utl-pill-style", PILL_CSS);

  if (!hadNativeModal) {
    injectStyle("utl-modal-style", MODAL_CSS);
    injectMarkup("signup-modal", MODAL_HTML);
    injectMarkup("welcome-back-banner", BANNER_HTML);
  }

  var modal = document.getElementById("signup-modal");
  var banner = document.getElementById("welcome-back-banner");
  if (!modal) { return; }

  var dialog = modal.querySelector(".signup-modal__dialog");
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
  var lastFocusedTrigger = null;

  function focusableEls() {
    if (!dialog) { return []; }
    return dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  // Accessibility (point 5): Tab-trap while open; Escape closes AND now
  // records utl_skip via closeModal().
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

  // Lazy Turnstile (point 1): only fetched when the modal actually opens,
  // and skipped entirely if a copy is already on the page -- as it is,
  // eagerly, in the front page's own <head>.
  function ensureTurnstile() {
    if (window.turnstile) { return; }
    if (document.querySelector('script[src^="' + TURNSTILE_SRC + '"]')) { return; }
    var s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    document.head.appendChild(s);
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

  // D-173: opening the popup NEVER happens on page load. It only ever runs
  // in response to a real trigger. `fresh` re-arms the form for a second
  // signer on the same device without touching any cookie already set.
  // `triggerEl` is recorded so closeModal() can return focus to it
  // (point 5).
  function openModal(fresh, triggerEl) {
    if (!modal) { return; }
    ensureTurnstile();
    if (fresh) { resetFormFields(); }
    lastFocusedTrigger = triggerEl || document.activeElement;
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

  // Dismissal (close "x" / Escape / Skip) closes the popup and stays on the
  // door -- it never navigates. Point 2: this is now the ONE place utl_skip
  // gets written, unconditionally, on every dismissal path, which is what
  // flips the page into subtle mode (point 4) for the rest of this visit
  // and every visit after.
  function closeModal() {
    if (!modal) { return; }
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown, true);
    markSkipped();
    applyState();
    var toFocus = lastFocusedTrigger;
    lastFocusedTrigger = null;
    if (toFocus && typeof toFocus.focus === "function") { toFocus.focus(); }
  }

  function showStatus(message, ok) {
    if (!status) { return; }
    status.textContent = message;
    status.hidden = false;
    status.className = ok ? "ok" : "";
  }

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
    signAnotherBtn.addEventListener("click", function () { openModal(true, signAnotherBtn); });
  }

  // ---------------------------------------------------------------------
  // Subtle mode (points 2 + 4): signed or skipped -> no modal, ever. A
  // small dismissible pill instead, except on the front page's own
  // "signed" case, which keeps its existing inline welcome-back banner.
  // ---------------------------------------------------------------------
  var pillEl = null;

  function buildPill() {
    var pill = document.createElement("div");
    pill.id = "utl-wb-pill";
    pill.className = "utl-wb-pill";
    pill.setAttribute("role", "complementary");
    pill.hidden = true;

    var link = document.createElement("a");
    link.id = "utl-wb-pill-link";
    pill.appendChild(link);

    var dismissBtn = document.createElement("button");
    dismissBtn.type = "button";
    dismissBtn.className = "utl-wb-pill__dismiss";
    dismissBtn.setAttribute("aria-label", "Dismiss");
    dismissBtn.textContent = "×";
    dismissBtn.addEventListener("click", function () {
      pill.hidden = true;
      ssSet(SS_PILL_DISMISS_KEY, "1");
    });
    pill.appendChild(dismissBtn);

    document.body.appendChild(pill);
    return pill;
  }

  function showPill(kind) {
    // Never reappear same session after dismissal (point 4).
    if (ssGet(SS_PILL_DISMISS_KEY)) { return; }
    if (!pillEl) { pillEl = buildPill(); }
    var link = document.getElementById("utl-wb-pill-link");
    if (kind === "signed") {
      pillEl.setAttribute("aria-label", "You're signed up — continue to next actions");
      link.href = "/now.html";
      link.textContent = "Welcome back — next actions →";
    } else {
      pillEl.setAttribute("aria-label", "Join the conversation");
      link.href = "/join.html";
      link.textContent = "Join the conversation →";
    }
    pillEl.hidden = false;
  }

  function showBanner() {
    if (!banner) { return; }
    var storedName = lsGet(LS_NAME_KEY) || "";
    var heading = document.getElementById("wb-heading");
    if (heading) {
      var firstName = storedName ? storedName.trim().split(/\s+/)[0] : "";
      heading.textContent = "Welcome back, " + (firstName ? firstName : "friend") + ".";
    }
    banner.hidden = false;
  }

  // Bound once, regardless of current visibility -- applyState() only
  // toggles .hidden from here on.
  if (banner) {
    var dismiss = document.getElementById("wb-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", function () { banner.hidden = true; });
    }
    var signAnotherFromBanner = document.getElementById("wb-sign-another");
    if (signAnotherFromBanner) {
      signAnotherFromBanner.addEventListener("click", function () { openModal(true, signAnotherFromBanner); });
    }
  }

  // Re-run after every state-changing event (a dismissal, or landing here
  // already signed/skipped from a prior visit) to decide what -- if
  // anything -- shows.
  function applyState() {
    var state = getState();
    if (state === "signed") {
      // Rolling 180-day window: every recognized visit refreshes it.
      var existingId = getCookie(COOKIE_NAME);
      if (existingId) { setCookie(COOKIE_NAME, existingId, COOKIE_DAYS); }
      if (hadNativeModal && banner) {
        showBanner();
      } else {
        showPill("signed");
      }
    } else if (state === "skipped") {
      showPill("skipped");
    }
    // "eligible": nothing to render -- D-173, never on load.
  }

  // ---------------------------------------------------------------------
  // Eligible-page triggers (point 3). Always wired; each checks live
  // state before acting, so a mid-session skip/signup silently disarms
  // them (and, for link-based triggers, lets the default navigation to
  // join.html/now.html happen instead of doing nothing).
  // ---------------------------------------------------------------------
  if (essayEnd || essayCtaLink) {
    // Front page: exactly its existing #essay-end / #essay-cta-link
    // triggers, unchanged.
    if (essayEnd && window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting && !modalOpenedOnce && getState() === "eligible") {
            openModal(false, essayEnd);
          }
        }
      }, { threshold: 0.1 });
      observer.observe(essayEnd);
    }

    if (essayCtaLink) {
      essayCtaLink.addEventListener("click", function (e) {
        if (getState() !== "eligible") { return; } // subtle mode: no modal, ever -- let the link navigate.
        e.preventDefault();
        openModal(false, essayCtaLink);
      });
    }
  } else {
    // Every other page: open at most once per browser session (across
    // pages, via sessionStorage -- not just once per pageview), at 60%
    // scroll depth or on a click of any [data-join-trigger] element.
    var scrollListenerAttached = false;

    function maybeAutoOpen(triggerEl) {
      if (modalOpenedOnce || ssGet(SS_AUTO_OPEN_KEY)) { return; }
      if (getState() !== "eligible") { return; }
      ssSet(SS_AUTO_OPEN_KEY, "1");
      openModal(false, triggerEl);
    }

    function scrollDepthRatio() {
      var doc = document.documentElement;
      var scrollTop = window.pageYOffset || (doc && doc.scrollTop) || 0;
      var viewport = window.innerHeight || (doc && doc.clientHeight) || 0;
      var full = Math.max(
        (doc && doc.scrollHeight) || 0,
        (document.body && document.body.scrollHeight) || 0
      );
      if (!full || full <= viewport) { return 1; } // shorter than the viewport counts as fully read
      return (scrollTop + viewport) / full;
    }

    function onScroll() {
      if (modalOpenedOnce || ssGet(SS_AUTO_OPEN_KEY)) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      if (scrollDepthRatio() >= SCROLL_TRIGGER_RATIO) {
        window.removeEventListener("scroll", onScroll);
        maybeAutoOpen(document.body);
      }
    }

    if (getState() === "eligible") {
      window.addEventListener("scroll", onScroll, { passive: true });
      scrollListenerAttached = true;
    }

    document.addEventListener("click", function (e) {
      var el = e.target && e.target.closest ? e.target.closest("[data-join-trigger]") : null;
      if (!el) { return; }
      if (getState() !== "eligible") { return; } // subtle mode: no modal, ever -- let the click do its default thing.
      e.preventDefault();
      if (scrollListenerAttached) { window.removeEventListener("scroll", onScroll); }
      maybeAutoOpen(el);
    });
  }

  applyState();
})();
