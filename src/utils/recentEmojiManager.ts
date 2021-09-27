export function getRecentEmojis(): string[] {
  if (!localStorage["recentEmojis"]) return [];
  return JSON.parse(localStorage["recentEmojis"]);
}
export function addRecentEmoji(shortcode: string) {
  let recentEmojis = getRecentEmojis();
  recentEmojis = recentEmojis.filter((e) => e !== shortcode);
  recentEmojis = [shortcode, ...recentEmojis].slice(0, 20);
  localStorage["recentEmojis"] = JSON.stringify(recentEmojis);
}
