// Tiny wrapper around fetch for the DummyJSON API.
// All backend data in this app comes from https://dummyjson.com/
export const BASE_URL = "https://dummyjson.com";

// Performs a GET request and returns the parsed JSON.
// Throws on a non-2xx response so callers can show an error message.
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}
