const { ipcMain } = require('electron');
const StoreModule = require('electron-store');
const Store = StoreModule.default || StoreModule;
const axios = require('axios');

const store = new Store();

const API_BASE_URL = 'https://metaforge.app/api/arc-raiders';
const FALLBACK_API_URL = 'https://ardb.app/api';
const CACHE_DURATION = 12 * 60 * 60 * 1000;

function isFresh(timestamp, hours = 12) {
  if (!timestamp) return false;
  const age = Date.now() - timestamp;
  return age < (hours * 60 * 60 * 1000);
}

function extractData(responseData) {
  // MetaForge API returns { data: [...], cachedAt: ... }
  // Extract the actual data array if it exists
  if (responseData && responseData.data && Array.isArray(responseData.data)) {
    return responseData.data;
  }
  // If response is already an array, return as-is
  if (Array.isArray(responseData)) {
    return responseData;
  }
  // Otherwise return the raw response
  return responseData;
}

async function fetchWithFallback(primaryUrl, fallbackUrl, cacheKey) {
  try {
    console.log(`Fetching from: ${primaryUrl}`);
    const response = await axios.get(primaryUrl, { timeout: 10000 });
    const extractedData = extractData(response.data);

    store.set(cacheKey, {
      data: extractedData,
      lastUpdated: Date.now(),
      source: 'primary'
    });
    console.log(`Successfully fetched ${cacheKey}: ${Array.isArray(extractedData) ? extractedData.length + ' items' : 'data received'}`);
    return extractedData;
  } catch (primaryError) {
    console.warn(`Primary API failed for ${cacheKey}, trying fallback...`, primaryError.message);

    if (fallbackUrl) {
      try {
        const response = await axios.get(fallbackUrl, { timeout: 10000 });
        const extractedData = extractData(response.data);

        store.set(cacheKey, {
          data: extractedData,
          lastUpdated: Date.now(),
          source: 'fallback'
        });
        return extractedData;
      } catch (fallbackError) {
        console.error(`Fallback API also failed for ${cacheKey}`, fallbackError.message);
      }
    }

    const cached = store.get(cacheKey);
    if (cached && cached.data) {
      console.log(`Returning stale cached data for ${cacheKey}`);
      return cached.data;
    }

    throw new Error(`Failed to fetch ${cacheKey} from all sources`);
  }
}

ipcMain.handle('api:fetchItems', async () => {
  const cached = store.get('items');

  if (cached && isFresh(cached.lastUpdated, 12)) {
    console.log('Returning cached items data');
    return cached.data;
  }

  console.log('Fetching fresh items data...');
  return await fetchWithFallback(
    `${API_BASE_URL}/items`,
    `${FALLBACK_API_URL}/items`,
    'items'
  );
});

ipcMain.handle('api:fetchEvents', async () => {
  const cached = store.get('events');

  if (cached && isFresh(cached.lastUpdated, 12)) {
    console.log('Returning cached events data');
    return cached.data;
  }

  console.log('Fetching fresh events data...');
  return await fetchWithFallback(
    `${API_BASE_URL}/events-schedule`,
    `${FALLBACK_API_URL}/events`,
    'events'
  );
});

ipcMain.handle('api:fetchQuests', async () => {
  const cached = store.get('quests');

  if (cached && isFresh(cached.lastUpdated, 12)) {
    console.log('Returning cached quests data');
    return cached.data;
  }

  console.log('Fetching fresh quests data...');
  return await fetchWithFallback(
    `${API_BASE_URL}/quests`,
    `${FALLBACK_API_URL}/quests`,
    'quests'
  );
});

ipcMain.handle('api:fetchWorkbench', async () => {
  const cached = store.get('workbench');

  if (cached && isFresh(cached.lastUpdated, 12)) {
    console.log('Returning cached workbench data');
    return cached.data;
  }

  console.log('Fetching fresh workbench data...');
  return await fetchWithFallback(
    `${API_BASE_URL}/workbench`,
    null,
    'workbench'
  );
});

ipcMain.handle('storage:getSettings', () => {
  return store.get('settings', {
    theme: 'dark',
    autoRefresh: true,
    refreshInterval: 12,
    notifications: true
  });
});

ipcMain.handle('storage:setSettings', (_event, settings) => {
  store.set('settings', settings);
  return settings;
});

ipcMain.handle('storage:clearCache', () => {
  store.clear();
  console.log('Cache cleared');
  return true;
});

console.log('API handlers registered');
