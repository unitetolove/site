/* Glossary popover component — ENG-048.
 *
 * Vanilla JS, no dependencies, no network calls. Reads per-page glossary data from
 * <script type="application/json" id="glossary-data"> and shows plain-definition popovers
 * on hover, focus, or tap of .gloss-term elements.
 */
(function () {
  "use strict";

  if (typeof window.Popover === "undefined") return;

  window.Popover.init({
    dataId: "glossary-data",
    triggerSelector: ".gloss-term",
    popoverClass: "gloss-popover",
    getKey: function (trigger) {
      return trigger.getAttribute("data-term");
    },
    render: function (entry, slug) {
      const def = entry.definition || entry.definition_stub || "";
      const more = entry.deep_link
        ? '<p class="gloss-more"><a href="' +
          window.Popover.escapeHtml(entry.deep_link) +
          '">Read more</a></p>'
        : "";
      return '<p class="gloss-def">' + window.Popover.escapeHtml(def) + "</p>" + more;
    },
  });
})();
