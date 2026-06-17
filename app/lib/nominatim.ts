import { NominatimResult } from "./types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "WhereToShit/1.0 (toilet-finder-singapore)";

export async function searchAddress(
  query: string
): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    countrycodes: "sg",
    limit: "5",
    addressdetails: "1",
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) throw new Error("Nominatim search failed");
  return res.json();
}
