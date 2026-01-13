import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [quests, setQuests] = useState([]);
  const [workbench, setWorkbench] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.electronAPI) {
        throw new Error('Electron API not available. Running outside Electron?');
      }

      const [itemsData, eventsData, questsData, workbenchData] = await Promise.allSettled([
        window.electronAPI.fetchItems(),
        window.electronAPI.fetchEvents(),
        window.electronAPI.fetchQuests(),
        window.electronAPI.fetchWorkbench()
      ]);

      if (itemsData.status === 'fulfilled') {
        setItems(Array.isArray(itemsData.value) ? itemsData.value : []);
      }

      if (eventsData.status === 'fulfilled') {
        setEvents(eventsData.value || []);
      }

      if (questsData.status === 'fulfilled') {
        setQuests(Array.isArray(questsData.value) ? questsData.value : []);
      }

      if (workbenchData.status === 'fulfilled') {
        setWorkbench(Array.isArray(workbenchData.value) ? workbenchData.value : []);
      }

      const allFailed = [itemsData, eventsData, questsData, workbenchData].every(
        result => result.status === 'rejected'
      );

      if (allFailed) {
        throw new Error('Failed to load any data from API');
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <DataContext.Provider
      value={{
        items,
        events,
        quests,
        workbench,
        loading,
        error,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
