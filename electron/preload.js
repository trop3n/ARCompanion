const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchItems: () => ipcRenderer.invoke('api:fetchItems'),
  fetchEvents: () => ipcRenderer.invoke('api:fetchEvents'),
  fetchQuests: () => ipcRenderer.invoke('api:fetchQuests'),
  fetchHideout: () => ipcRenderer.invoke('api:fetchHideout'),
  fetchExpedition: () => ipcRenderer.invoke('api:fetchExpedition'),

  getSettings: () => ipcRenderer.invoke('storage:getSettings'),
  setSettings: (settings) => ipcRenderer.invoke('storage:setSettings', settings),

  clearCache: () => ipcRenderer.invoke('storage:clearCache'),

  onDataUpdate: (callback) => {
    ipcRenderer.on('data:updated', (_event, data) => callback(data));
  },

  removeDataUpdateListener: () => {
    ipcRenderer.removeAllListeners('data:updated');
  }
});
