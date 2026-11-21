const { contextBridge, ipcRenderer } = require('electron');
const arg = k => (process.argv.find(a => a.startsWith(k + '=')) || '').split('=')[1];
contextBridge.exposeInMainWorld('bnApp', {
  gpu: arg('--bn-gpu') === '1',
  pending: arg('--bn-pending') === '1',
  setGpu: on => ipcRenderer.send('bn-set-gpu', on),
  confirmGpu: () => ipcRenderer.send('bn-confirm-gpu'),
  webglFailed: () => ipcRenderer.send('bn-webgl-failed'),
  quit: () => ipcRenderer.send('bn-quit'),
});
