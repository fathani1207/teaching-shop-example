export interface SiteSettings {
  orders_enabled: boolean;
}

export async function fetchSettings(): Promise<SiteSettings> {
  const response = await fetch("http://localhost:8000/api/settings/");
  return response.json();
}