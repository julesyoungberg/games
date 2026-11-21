// Carries browser progress over from the old address (wick-and-shade.vercel.app), whose
// forwarding page sends the save along as  #ws-import=<base64url JSON>.  Runs before the game
// reads its save. Merges rather than overwrites: keeps the furthest unlocked level and every
// finished room from both saves.
(function () {
  var KEY = 'wick-and-shade-save-v1';
  var m = /[#&]ws-import=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (!m) return;
  try {
    var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    var bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
    var json = decodeURIComponent(Array.prototype.map.call(bin, function (c) { return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
    var inc = JSON.parse(json);
    if (inc && typeof inc.unlocked === 'number') {
      var cur = null;
      try { cur = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
      var out = inc;
      if (cur && typeof cur.unlocked === 'number') {
        out = Object.assign({}, inc, cur);
        out.unlocked = Math.max(cur.unlocked, inc.unlocked);
        out.done = Object.assign({}, inc.done || {}, cur.done || {});
      }
      localStorage.setItem(KEY, JSON.stringify(out));
    }
  } catch (e) { /* bad or missing data: start as usual */ }
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
})();
