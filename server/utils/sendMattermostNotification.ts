export const sendMattermostNotification = async (message: string) => {
  const MATTERMOST_WEBHOOK_URL = process.env.MM_WEBHOOK_URL;
  const MATTERMOST_CHANNEL = process.env.MM_CHANNEL;
  const BOT_ICON_URL = process.env.BOT_ICON_URL;

  if (!MATTERMOST_WEBHOOK_URL) {
    console.error("MATTERMOST_WEBHOOK_URL is not defined");
    return;
  }
  if (!MATTERMOST_CHANNEL) {
    console.error("MATTERMOST_CHANNEL is not defined");
    return;
  }

  try {
    await fetch(MATTERMOST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: MATTERMOST_CHANNEL,
        text: message,
        username: "Nono le robot de T-O",
        icon_url: BOT_ICON_URL,
      }),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi à Mattermost:", error);
  }
};
