const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchItems: () => ipcRenderer.invoke('api:fetchItems'),
  fetchEvents: () => ipcRenderer.invoke('api:fetchEvents'),
  fetchQuests: () => ipcRenderer.invoke('api:fetchQuests'),
  fetchWorkbench: () => ipcRenderer.invoke('api:fetchWorkbench'),

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
