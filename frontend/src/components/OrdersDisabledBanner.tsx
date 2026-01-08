import { useState, useEffect } from 'react';
import { SiteSettings, fetchSettings } from '../api/settings';

export default function OrdersDisabledBanner() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  if (!settings || settings.orders_enabled) return null;

  return (
    <div className="bg-red-100 text-red-800 text-center py-4 mb-8">
      <p className="font-semibold">Les commandes sont actuellement désactivées</p>
    </div>
  );
}