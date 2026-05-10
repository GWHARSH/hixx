import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const SettingsContext = createContext({
  settings: null,
  loading: true,
  refreshSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!settings);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (data && !error) {
        setSettings(data);
        localStorage.setItem('cached_settings', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const value = { settings, loading, refreshSettings };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
