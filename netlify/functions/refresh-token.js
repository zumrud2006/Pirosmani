// Instagram long-lived tokens expire after 60 days. This scheduled function
// (runs daily, see netlify.toml) refreshes the token before that happens and
// writes the new one back as a Netlify environment variable, so nobody has
// to remember to do it by hand. It only runs if the extra Netlify API
// credentials below are configured — otherwise it just skips itself.

exports.handler = async function () {
  const token = process.env.IG_ACCESS_TOKEN;
  const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!token || !netlifyToken || !siteId) {
    return { statusCode: 200, body: "skipped: rotation not configured" };
  }

  try {
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    const res = await fetch(refreshUrl);
    const json = await res.json();

    if (!json.access_token) {
      console.error("refresh-token: Instagram refused the refresh", json);
      return { statusCode: 502, body: "refresh failed" };
    }

    const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/env/IG_ACCESS_TOKEN`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${netlifyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "IG_ACCESS_TOKEN",
        values: [{ value: json.access_token, context: "all" }],
      }),
    });

    if (!updateRes.ok) {
      console.error("refresh-token: could not save new token", await updateRes.text());
      return { statusCode: 502, body: "env update failed" };
    }

    return { statusCode: 200, body: "token rotated" };
  } catch (err) {
    console.error("refresh-token: error", err);
    return { statusCode: 502, body: "error" };
  }
};
