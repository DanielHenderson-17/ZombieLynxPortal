const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get("access_token");

if (accessToken) {
  fetch("https://discord.com/api/users/@me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (!data.id) return window.close();

      const checkRes = await fetch(`/api/discord/is-linked/${data.id}`);
      const checkData = await checkRes.json();

      if (checkData.isLinked) {
        document.body.innerHTML =
          "<p>This Discord account is already linked to another user. Please use a different account.</p>";
        setTimeout(() => window.close(), 5000);
        return;
      }

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "DISCORD_AUTH_SUCCESS",
            discordId: data.id,
            discordName: data.username + "#" + data.discriminator,
            discordImgUrl: data.avatar
              ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
              : null,
          },
          window.origin
        );
      }

      window.close();
    })
    .catch((err) => {
      console.error("❌ Error fetching Discord user details:", err);
      window.close();
    });
} else {
  window.close();
}
