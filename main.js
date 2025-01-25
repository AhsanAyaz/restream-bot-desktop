const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const robot = require("robotjs");
const { pathToFileURL } = require("url");
// const startChatObserver = require("./chatObserver");

let mainWindow;
let audioWindow; // Hidden window for audio playback
const audioFilePath = path.join(__dirname, "audio.html");
const audioFileURL = pathToFileURL(audioFilePath).href;
console.log({ audioHTMLPath: audioFileURL });
let soundEffectsList = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Create hidden audio window
  audioWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  audioWindow.loadURL(audioFileURL);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : pathToFileURL(path.join(__dirname, "../build/index.html")).href
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
    audioWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    audioWindow.close();
  });

  // Start chat observer after window loads
  mainWindow.webContents.on("did-finish-load", () => {
    // startChatObserver(mainWindow);
  });
}

function simulateHotkey({ modifiers, key }) {
  console.log(`Triggering hotkey: ${modifiers.join("+")}+${key}`);
  modifiers.forEach((m) => robot.keyToggle(m, "down"));
  robot.keyTap(key);
  modifiers.forEach((m) => robot.keyToggle(m, "up"));
  console.log(`Triggered hotkey: ${modifiers.join("+")}+${key}`);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Audio", extensions: ["mp3", "wav", "ogg"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.on("register-soundboard-hotkey", async (_, effect) => {
  // register hotkey, to play the sound
  const parsedEffect = JSON.parse(effect);
  soundEffectsList = [parsedEffect, ...soundEffectsList];
  console.log("registered effect in main.js", effect);
});

ipcMain.on("unregister-soundboard-hotkey", async (_, effect) => {
  // Implementation depends on how you want to unregister (not covered here)
  const parsedEffect = JSON.parse(effect);
  soundEffectsList = soundEffectsList.filter(
    (eff) => eff.command !== parsedEffect.command
  );
  console.log("unregistered effect in main.js", effect);
});

ipcMain.on("execute-command", (_, command) => {
  console.log(`Executing command: ${command}`);

  if (command === "stop-all-sounds") {
    audioWindow.webContents.send("stop-all-sounds");
    return;
  }

  const effect = soundEffectsList.find((effect) => effect.command === command);
  if (effect) {
    if (effect.hotkey) {
      simulateHotkey(effect.hotkey);
      return;
    }

    if (effect.file) {
      audioWindow.webContents.send("play-sound", effect.file);
    }
  }
});
