// Fills the Instagram gallery tiles with real posts fetched from the
// serverless endpoint (see netlify/functions/instagram-feed.js). Until
// window.INSTAGRAM_FEED_ENDPOINT is set (after deploying the backend, see
// INSTAGRAM_SETUP.md), this script does nothing and the manual photo
// placeholders already in the HTML stay exactly as they are.

(function () {
  const ENDPOINT = window.INSTAGRAM_FEED_ENDPOINT;
  if (!ENDPOINT) return;

  const CACHE_KEY = "pirosmani-instagram-cache-v1";
  const CACHE_TTL_MS = 60 * 60 * 1000;

  function renderTiles(posts) {
    const tiles = document.querySelectorAll(".instagram-tile[data-instagram-slot]");
    tiles.forEach((tile, i) => {
      const post = posts[i];
      if (!post || !post.image) return;

      const link = document.createElement("a");
      link.href = post.link || "#";
      link.target = "_blank";
      link.rel = "noopener";

      const img = document.createElement("img");
      img.src = post.image;
      img.alt = post.caption || "";
      img.loading = "lazy";

      link.appendChild(img);
      tile.replaceChildren(link);
    });
  }

  function loadFromCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.posts;
    } catch {
      return null;
    }
  }

  function saveToCache(posts) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, ts: Date.now() }));
    } catch {
      // Private browsing / storage disabled — fine, just skip caching.
    }
  }

  const cached = loadFromCache();
  if (cached) renderTiles(cached);

  fetch(ENDPOINT)
    .then((r) => r.json())
    .then((posts) => {
      if (Array.isArray(posts) && posts.length) {
        renderTiles(posts);
        saveToCache(posts);
      }
    })
    .catch(() => {
      // Backend unreachable or not deployed yet — keep whatever is already showing.
    });
})();
