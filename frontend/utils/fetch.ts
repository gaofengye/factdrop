export const fetchJson = async (url: string) => {
  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${text}`);
  }

  if (!text) {
    throw new Error("API returned empty response");
  }

  return JSON.parse(text);
};