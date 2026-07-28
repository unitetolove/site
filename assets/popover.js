/* Generic accessible popover component.
 *
 * Vanilla JS, no dependencies, no network calls. Reads per-page data from a
 * <script type="application/json"> blob and shows popovers on hover, focus, or
 * tap of configured trigger elements.
 *
 * Usage:
 *   Popover.init({
 *     dataId: 'glossary-data',
 *     triggerSelector: '.gloss-term',
 *     popoverClass: 'gloss-popover',
 *     getKey: (trigger) => trigger.getAttribute('data-term'),
 *     render: (entry, key) => '<p>...</p>',
 *   });
 */
(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init(options) {
    const dataId = options.dataId;
    const triggerSelector = options.triggerSelector;
    const popoverClass = options.popoverClass;
    const getKey = options.getKey;
    const render = options.render;

    const dataEl = document.getElementById(dataId);
    if (!dataEl) return;

    let data = {};
    try {
      data = JSON.parse(dataEl.textContent) || {};
    } catch (e) {
      return;
    }

    const popover = document.createElement("div");
    popover.setAttribute("role", "tooltip");
    popover.className = popoverClass;
    popover.style.position = "absolute";
    popover.style.zIndex = "100";
    popover.style.pointerEvents = "auto";
    popover.style.display = "none";
    document.body.appendChild(popover);

    let activeTrigger = null;

    function open(trigger) {
      const key = getKey(trigger);
      const entry = data[key];
      if (!entry) return;

      activeTrigger = trigger;
      popover.innerHTML = render(entry, key);
      popover.style.display = "block";
      popover.id = trigger.getAttribute("aria-describedby") || popoverClass + "-" + key;
      trigger.setAttribute("aria-expanded", "true");
      position(trigger);
    }

    function close() {
      if (!activeTrigger) return;
      activeTrigger.setAttribute("aria-expanded", "false");
      activeTrigger = null;
      popover.style.display = "none";
    }

    function position(trigger) {
      const rect = trigger.getBoundingClientRect();
      const popRect = popover.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 4;
      let left = rect.left + window.scrollX;

      if (left + popRect.width > window.innerWidth) {
        left = window.innerWidth - popRect.width - 8;
      }
      if (left < 8) left = 8;

      popover.style.top = top + "px";
      popover.style.left = left + "px";
    }

    function onTriggerLeave() {
      setTimeout(function () {
        const stillOnTrigger = document.activeElement.closest(triggerSelector);
        if (!popover.matches(":hover") && !(stillOnTrigger && stillOnTrigger === activeTrigger)) {
          close();
        }
      }, 50);
    }

    document.body.addEventListener("mouseover", function (e) {
      const t = e.target.closest(triggerSelector);
      if (t) {
        open(t);
      } else if (activeTrigger && !e.relatedTarget?.closest("." + popoverClass)) {
        onTriggerLeave();
      }
    });

    document.body.addEventListener("mouseout", function (e) {
      const t = e.target.closest(triggerSelector);
      if (t) onTriggerLeave();
    });

    document.body.addEventListener("focusin", function (e) {
      const t = e.target.closest(triggerSelector);
      if (t) open(t);
    });

    document.body.addEventListener("focusout", function (e) {
      const t = e.target.closest(triggerSelector);
      if (t) close();
    });

    document.body.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && activeTrigger) {
        close();
        activeTrigger.focus();
      }
    });

    popover.addEventListener("mouseleave", function () {
      close();
    });
  }

  window.Popover = {
    init: init,
    escapeHtml: escapeHtml,
  };
})();
