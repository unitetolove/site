// Cookieless, aggregate-only page-view measurement — Cloudflare Web Analytics.
//
// DO NOT FILL IN THE TOKEN BELOW. This file must stay inert. (Verified in the Cloudflare
// dashboard 2026-08-07.) Both unitetolove.ca and unitetolove.com have had Web Analytics enabled
// since ~2026-07-28 on **Automatic setup** — Cloudflare injects the beacon at the edge for a
// proxied zone, so measurement is already running with no snippet at all. Pasting a real token
// here would load a SECOND beacon alongside the automatic one and double-count every page view.
//
// This file predates that discovery: it was written on the assumption the counter was dark and
// needed a manual token. It never was. Kept, inert, only as the documented no-op — if automatic
// setup is ever turned off, this is where a manual token would go, and only then.
//
// No cookie, no localStorage, and no identifier of any kind is set by this file; the only network
// call it could ever make is the single Cloudflare beacon load below, which the guard prevents.
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
