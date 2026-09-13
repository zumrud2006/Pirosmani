// Fetches recent Instagram posts using the restaurant's own long-lived
// access token (stored as a Netlify environment variable, never in code)
// and returns a small JSON list the site's front-end can render into the
// gallery tiles. Results are cached in memory for an hour to stay well
// under Instagram's API rate limits.

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache = { data: null, ts: 0 };

exports.handler = async function () {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (cache.data && Date.now() - cache.ts < CACHE_TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify(cache.data) };
  }

  const token = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID;

  if (!token || !userId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "IG_ACCESS_TOKEN / IG_USER_ID are not set yet." }),
    };
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}&limit=8`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: json.error.message }) };
    }

    const posts = (json.data || [])
      .filter((item) => item.media_type !== "VIDEO" || item.thumbnail_url)
      .map((item) => ({
        id: item.id,
        image: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
        caption: item.caption ? item.caption.slice(0, 140) : "",
        link: item.permalink,
      }));

    cache = { data: posts, ts: Date.now() };
    return { statusCode: 200, headers, body: JSON.stringify(posts) };
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Failed to reach Instagram." }) };
  }
};
