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
      // Citizen-register translation layer (assessment D1): citizen_status/technical_code are
      // generated once, server-side, from the ledger's trust_status + verified_date
      // (tools/seal_translate.py, wired into tools/site_renderer.py::_claim_blob_html) -- this
      // script only displays them, so every page stays in sync with that one input.
      const citizenStatus = entry.citizen_status || "Status not yet translated for public display.";
      const technicalCode = entry.technical_code || entry.status || "";
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

      const technicalLine = technicalCode
        ? '<p class="claim-status-code">Internal ledger code: <code>' +
          window.Popover.escapeHtml(technicalCode) +
          "</code></p>"
        : "";

      return (
        '<p class="claim-id">' +
        window.Popover.escapeHtml(claimId) +
        '</p><p class="claim-status">' +
        window.Popover.escapeHtml(citizenStatus) +
        '</p><p class="claim-text">' +
        window.Popover.escapeHtml(text) +
        "</p>" +
        sourceLine +
        technicalLine
      );
    },
  });
})();
