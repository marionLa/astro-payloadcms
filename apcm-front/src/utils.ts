export function formatDate(dateString: string | undefined) {
  if(!dateString) return ""
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
