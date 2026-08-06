// Cookieless, aggregate-only page-view measurement — Cloudflare Web Analytics.
// One edit point: swap TOKEN below for the real value once the operator enables Web Analytics
// for this zone in the Cloudflare dashboard (Analytics & Logs -> Web Analytics -> Add a site).
// Until a real token is set, this script does nothing — no beacon call is made, so pages ship
// clean either way. No cookie, no localStorage, and no identifier of any kind is set by this
// file; the only network call it can ever make is the single Cloudflare beacon load below.
// Plain-language disclosure of what this measures and doesn't: site/constitution.html.
(function () {
  "use strict";
  var TOKEN = "REPLACE_WITH_CF_WEB_ANALYTICS_TOKEN";
  if (!TOKEN || TOKEN.indexOf("REPLACE_WITH") === 0) { return; }
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
