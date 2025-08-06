export const STALE_TIME = 1 * 24 * 60 * 60 * 1000; // 1 day
export const CACHE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function getLocationFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    const locationData = {
      country: data.country_name,
      timezone: data.timezone,
      city: data.city,
      region: data.region,
    };
    return locationData;
  } catch (error) {
    console.log(error);
    return;
  }
}
