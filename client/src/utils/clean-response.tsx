export const cleanResponseMessage = (message: string) => {
  return message
    ?.replace(/Le \d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}.*$/s, "")
    ?.replace(/De:.*$/s, "")
    ?.replace(/reacted to your message.*$/s, "")
    ?.replace(/Objet :.*$/s, "")
    ?.replace(/Envoyé :.*$/s, "")
    ?.replace(/> Le.*/s, "")
    ?.replace(/Le lun.*$/s, "")
    ?.replace(/Le mar.*$/s, "")
    ?.replace(/Le mer.*$/s, "")
    ?.replace(/Le jeu.*$/s, "")
    ?.replace(/Le ven.*$/s, "")
    ?.replace(/Le sam.*$/s, "")
    ?.replace(/Le dim.*$/s, "")
    ?.replace(/On Monda.*$/s, "")
    ?.replace(/On Tuesd.*$/s, "")
    ?.replace(/On Wedne.*$/s, "")
    ?.replace(/On Thurs.*$/s, "")
    ?.replace(/On Frida.*$/s, "")
    ?.replace(/On Satur.*$/s, "")
    ?.replace(/On Sunda.*$/s, "")
    ?.replace(/Le \d{1,2} [A-Za-z]{3} \d{2}, à \d{1,2}:\d{2},.*$/s, "")
    ?.replace(/Le \d{1,2} \w+ \d{4} à \d{1,2}:\d{2}.*$/s, "")
    ?.replace(/--[a-fA-F0-9_-]+--/g, "")
    .replace(/Content-Type:.*$/gs, "")
    .replace(/Content-Disposition:.*$/gs, "")
    .replace(/Content-Transfer-Encoding:.*$/gs, "")
    .replace(/base64[^ ]+/gs, "[Image ou fichier ignoré]")
    ?.replace(/<br\s*\/?>/g, "\n")
    ?.replace(/({\s*".*?"\s*:\s*.*?})/gs, (match) => {
      try {
        return JSON.stringify(JSON.parse(match), null, 2);
      } catch {
        return match;
      }
    })
    ?.trim();
};
