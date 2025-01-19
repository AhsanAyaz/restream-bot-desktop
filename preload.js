const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  selectFile: () => {
    console.log("WHYYY");
    return ipcRenderer.invoke("select-file");
  },
  executeCommand: (command) => ipcRenderer.send("execute-command", command),
});
