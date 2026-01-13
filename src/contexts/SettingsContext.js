import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    autoRefresh: true,
    refreshInterval: 12,
    notifications: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (window.electronAPI && window.electronAPI.getSettings) {
      try {
        const savedSettings = await window.electronAPI.getSettings();
        setSettings(savedSettings);
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
  };

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (window.electronAPI && window.electronAPI.setSettings) {
      try {
        await window.electronAPI.setSettings(updated);
      } catch (err) {
        console.error('Error saving settings:', err);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
