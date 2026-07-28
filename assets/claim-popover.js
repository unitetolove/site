/* Claim-hover popover component — ENG-049.
 *
 * Vanilla JS, no dependencies, no network calls. Reads per-page claim data from
 * <script type="application/json" id="claim-data"> and shows claim-summary popovers
 * on hover, focus, or tap of .claim-ref elements.
 */
(function () {
  "use strict";

  if (typeof window.Popover === "undefined") return;

  window.Popover.init({
    dataId: "claim-data",
    triggerSelector: ".claim-ref",
    popoverClass: "claim-popover",
    getKey: function (trigger) {
      return trigger.getAttribute("data-claim-id");
    },
    render: function (entry, claimId) {
      const status = entry.status || "UNKNOWN";
      const text = entry.text || "";
      const sourceTitle = entry.source_title || "";
      const sourceUrl = entry.source_url || "";

      const sourceLine = sourceUrl
        ? '<p class="claim-source"><a href="' +
          window.Popover.escapeHtml(sourceUrl) +
          '">Source: ' +
          window.Popover.escapeHtml(sourceTitle || sourceUrl) +
          "</a></p>"
        : sourceTitle
          ? '<p class="claim-source">Source: ' + window.Popover.escapeHtml(sourceTitle) + "</p>"
          : "";

      return (
        '<p class="claim-id">' +
        window.Popover.escapeHtml(claimId) +
        '</p><p class="claim-status">Status: ' +
        window.Popover.escapeHtml(status) +
        '</p><p class="claim-text">' +
        window.Popover.escapeHtml(text) +
        "</p>" +
        sourceLine
      );
    },
  });
})();
