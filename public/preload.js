const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  selectFile: () => {
    console.log("WHYYY");
    return ipcRenderer.invoke("select-file");
  },
  registerSoundBoardCommand: (effect) => {
    return ipcRenderer.send("register-soundboard-hotkey", effect);
  },
  unRegisterSoundBoardCommand: (effect) => {
    return ipcRenderer.send("unregister-soundboard-hotkey", effect);
  },
  executeCommand: (command) => ipcRenderer.send("execute-command", command),
});
